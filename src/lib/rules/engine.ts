/**
 * Rules engine untuk CriteriaChecker (IMPLEMENTATION-PLAN §4.4).
 * Berjalan di browser dengan bpmn-moddle untuk parsing BPMN XML.
 * 11 aturan + kombinator anyOf/allOf/not.
 */
import type {
  BpmnElement,
  CheckAuto,
  CheckAssisted,
  Criterion,
  CriterionResult,
  RuleClause,
  RuleResult,
} from './types';

// ─── Helpers untuk traverse elemen BPMN ──────────────────────────────────────

function allElements(root: BpmnElement): BpmnElement[] {
  const result: BpmnElement[] = [];
  const visit = (el: BpmnElement) => {
    result.push(el);
    for (const key of Object.keys(el)) {
      const val = el[key];
      if (Array.isArray(val)) val.forEach((v) => v && typeof v === 'object' && '$type' in v && visit(v as BpmnElement));
      else if (val && typeof val === 'object' && '$type' in (val as object)) visit(val as BpmnElement);
    }
  };
  visit(root);
  return result;
}

function ofType(elements: BpmnElement[], type: string): BpmnElement[] {
  return elements.filter((e) => e.$type === type || e.$type.startsWith(type));
}

function hasDefinition(el: BpmnElement, defType: string): boolean {
  const defs = (el.eventDefinitions ?? []) as BpmnElement[];
  return defs.some((d) => d.$type === defType);
}

function matchesName(el: BpmnElement, pattern: string): boolean {
  if (!el.name || typeof el.name !== 'string') return false;
  try {
    return new RegExp(pattern, 'i').test(el.name);
  } catch {
    return el.name.toLowerCase().includes(pattern.toLowerCase());
  }
}

// ─── 11 aturan ────────────────────────────────────────────────────────────────

function ruleElementExists(elements: BpmnElement[], clause: RuleClause): RuleResult {
  const { type = '', min = 1, max } = clause;
  const found = ofType(elements, type);
  if (found.length < min) return { status: 'fail', message: `Ditemukan ${found.length} elemen ${type}, minimum ${min}.` };
  if (max !== undefined && found.length > max) return { status: 'fail', message: `Ditemukan ${found.length} elemen ${type}, maksimum ${max}.` };
  return { status: 'pass' };
}

function ruleBoundaryAttachedTo(elements: BpmnElement[], clause: RuleClause): RuleResult {
  const boundaries = elements.filter((e) => e.$type === 'bpmn:BoundaryEvent');
  const matching = boundaries.filter((b) => {
    if (clause.eventDefinition && !hasDefinition(b, clause.eventDefinition)) return false;
    if (clause.interrupting !== undefined && (b.cancelActivity as boolean | undefined) !== clause.interrupting) return false;
    if (clause.activityMatch?.nameMatches) {
      const attached = b.attachedToRef as BpmnElement | undefined;
      if (!attached || !matchesName(attached, clause.activityMatch.nameMatches)) return false;
    }
    return true;
  });
  if (matching.length === 0) return { status: 'fail', message: 'Tidak ditemukan Boundary Event yang sesuai kriteria.' };
  return { status: 'pass' };
}

function ruleNoSequenceFlowAcrossParticipants(elements: BpmnElement[]): RuleResult {
  const seqFlows = ofType(elements, 'bpmn:SequenceFlow');
  const pools = elements.filter((e) => e.$type === 'bpmn:Participant');
  if (pools.length < 2) return { status: 'pass' };

  const poolMembership = new Map<string, string>();
  for (const pool of pools) {
    const process = pool.processRef as BpmnElement | undefined;
    if (!process) continue;
    const members = allElements(process);
    members.forEach((m) => { if (m.id) poolMembership.set(m.id as string, pool.id as string); });
  }

  const violations = seqFlows.filter((sf) => {
    const srcPool = poolMembership.get((sf.sourceRef as BpmnElement)?.id ?? '');
    const tgtPool = poolMembership.get((sf.targetRef as BpmnElement)?.id ?? '');
    return srcPool && tgtPool && srcPool !== tgtPool;
  });
  if (violations.length > 0) return { status: 'fail', message: `${violations.length} Sequence Flow melintasi batas pool.` };
  return { status: 'pass' };
}

function ruleMessageFlowBetweenParticipants(elements: BpmnElement[], clause: RuleClause): RuleResult {
  const msgFlows = elements.filter((e) => e.$type === 'bpmn:MessageFlow');
  const min = clause.min ?? 1;
  if (msgFlows.length < min) return { status: 'fail', message: `Ditemukan ${msgFlows.length} Message Flow, minimum ${min}.` };
  return { status: 'pass' };
}

function ruleGatewaySplitLabeled(elements: BpmnElement[], clause: RuleClause): RuleResult {
  const { type = 'bpmn:ExclusiveGateway' } = clause;
  const splits = ofType(elements, type).filter((gw) => {
    const outgoing = (gw.outgoing ?? []) as BpmnElement[];
    return outgoing.length > 1;
  });
  const unlabeled = splits.filter((gw) => {
    const outgoing = (gw.outgoing ?? []) as BpmnElement[];
    const nonDefault = outgoing.filter((sf) => {
      const defaultFlow = gw.default as BpmnElement | undefined;
      return !defaultFlow || sf.id !== defaultFlow.id;
    });
    return nonDefault.some((sf) => !(sf.conditionExpression));
  });
  if (unlabeled.length > 0) return { status: 'fail', message: `${unlabeled.length} outgoing flow gateway tidak memiliki kondisi atau default.` };
  return { status: 'pass' };
}

function ruleGatewayJoinType(elements: BpmnElement[], clause: RuleClause): RuleResult {
  const { splitType = 'bpmn:ParallelGateway', joinType = 'bpmn:ParallelGateway' } = clause;
  const splits = ofType(elements, splitType).filter((gw) => ((gw.outgoing ?? []) as BpmnElement[]).length > 1);
  const joins = ofType(elements, joinType).filter((gw) => ((gw.incoming ?? []) as BpmnElement[]).length > 1);
  if (splits.length > 0 && joins.length === 0) return { status: 'fail', message: `Ada ${splits.length} gateway split (${splitType}) tetapi tidak ada join yang sesuai.` };
  return { status: 'pass' };
}

function ruleMarkerOnActivity(elements: BpmnElement[], clause: RuleClause): RuleResult {
  const { marker = 'multiInstance', activityMatch } = clause;
  const activities = elements.filter((e) =>
    e.$type.includes('Task') || e.$type === 'bpmn:SubProcess' || e.$type === 'bpmn:CallActivity'
  );
  const relevant = activityMatch?.nameMatches
    ? activities.filter((a) => matchesName(a, activityMatch.nameMatches!))
    : activities;

  const hasMarker = relevant.some((a) => {
    if (marker === 'loop') return !!(a.loopCharacteristics && (a.loopCharacteristics as BpmnElement).$type === 'bpmn:StandardLoopCharacteristics');
    if (marker === 'multiInstance') return !!(a.loopCharacteristics && (a.loopCharacteristics as BpmnElement).$type === 'bpmn:MultiInstanceLoopCharacteristics');
    if (marker === 'compensation') return !!(a.isForCompensation);
    return false;
  });
  if (!hasMarker) return { status: 'fail', message: `Tidak ditemukan activity dengan marker ${marker}.` };
  return { status: 'pass' };
}

function ruleCompensationHasHandler(elements: BpmnElement[]): RuleResult {
  const compThrows = elements.filter((e) =>
    (e.$type === 'bpmn:IntermediateThrowEvent' || e.$type === 'bpmn:EndEvent') && hasDefinition(e, 'bpmn:CompensateEventDefinition')
  );
  if (compThrows.length === 0) return { status: 'pass' };
  const compActivities = elements.filter((e) => e.isForCompensation === true);
  if (compActivities.length === 0) return { status: 'fail', message: 'Compensation throw ditemukan tetapi tidak ada activity compensation handler (isForCompensation=true).' };
  return { status: 'pass' };
}

function ruleAllTokensReachEnd(elements: BpmnElement[]): RuleResult {
  const flowNodes = elements.filter((e) =>
    e.$type.includes('Task') || e.$type.includes('Gateway') || e.$type.includes('Event') || e.$type === 'bpmn:SubProcess'
  );
  const endEvents = elements.filter((e) => e.$type === 'bpmn:EndEvent');
  if (endEvents.length === 0) return { status: 'fail', message: 'Tidak ada End Event dalam model.' };

  // Buat adjacency graph
  const seqFlows = elements.filter((e) => e.$type === 'bpmn:SequenceFlow');
  const successors = new Map<string, string[]>();
  for (const sf of seqFlows) {
    const src = (sf.sourceRef as BpmnElement)?.id;
    const tgt = (sf.targetRef as BpmnElement)?.id;
    if (src && tgt) {
      const list = successors.get(src) ?? [];
      list.push(tgt);
      successors.set(src, list);
    }
  }
  const endIds = new Set(endEvents.map((e) => e.id as string));

  // BFS dari setiap flow node; cek apakah bisa mencapai End
  const canReachEnd = (startId: string): boolean => {
    const visited = new Set<string>();
    const queue = [startId];
    while (queue.length > 0) {
      const curr = queue.shift()!;
      if (endIds.has(curr)) return true;
      if (visited.has(curr)) continue;
      visited.add(curr);
      (successors.get(curr) ?? []).forEach((s) => queue.push(s));
    }
    return false;
  };

  const stuck = flowNodes.filter((n) => n.id && !endIds.has(n.id as string) && !canReachEnd(n.id as string));
  if (stuck.length > 0) return { status: 'fail', message: `${stuck.length} flow node tidak memiliki jalur ke End Event.` };
  return { status: 'pass' };
}

function ruleSubprocessStartEvent(elements: BpmnElement[]): RuleResult {
  const subprocesses = elements.filter((e) => e.$type === 'bpmn:SubProcess' && !e.triggeredByEvent);
  const violations: string[] = [];
  for (const sp of subprocesses) {
    const children = allElements(sp);
    const starts = children.filter((e) => e.$type === 'bpmn:StartEvent' && e !== sp);
    const hasNoneStart = starts.some((s) => !((s.eventDefinitions ?? []) as BpmnElement[]).length);
    if (starts.length > 0 && !hasNoneStart) violations.push(sp.id as string ?? '?');
  }
  if (violations.length > 0) return { status: 'fail', message: `${violations.length} Embedded Subprocess tidak memakai None Start Event.` };
  return { status: 'pass' };
}

function ruleEventPositionValid(elements: BpmnElement[]): RuleResult {
  // Heuristik: periksa Error boundary sebagai non-interrupting (selalu salah)
  const violations: string[] = [];
  const boundaries = elements.filter((e) => e.$type === 'bpmn:BoundaryEvent');
  for (const b of boundaries) {
    const isInterrupting = b.cancelActivity !== false;
    const defs = (b.eventDefinitions ?? []) as BpmnElement[];
    const hasError = defs.some((d) => d.$type === 'bpmn:ErrorEventDefinition');
    if (hasError && !isInterrupting) violations.push(b.id as string ?? '?');
    const hasCancel = defs.some((d) => d.$type === 'bpmn:CancelEventDefinition');
    if (hasCancel && !isInterrupting) violations.push(b.id as string ?? '?');
  }
  if (violations.length > 0) return { status: 'fail', message: `${violations.length} event berada pada posisi yang tidak sah (Error/Cancel boundary harus interrupting).` };
  return { status: 'pass' };
}

// ─── Dispatch ─────────────────────────────────────────────────────────────────

function runRule(elements: BpmnElement[], clause: RuleClause): RuleResult {
  switch (clause.rule) {
    case 'element-exists': return ruleElementExists(elements, clause);
    case 'boundary-attached-to': return ruleBoundaryAttachedTo(elements, clause);
    case 'no-sequence-flow-across-participants': return ruleNoSequenceFlowAcrossParticipants(elements);
    case 'message-flow-between-participants': return ruleMessageFlowBetweenParticipants(elements, clause);
    case 'gateway-split-labeled': return ruleGatewaySplitLabeled(elements, clause);
    case 'gateway-join-type': return ruleGatewayJoinType(elements, clause);
    case 'marker-on-activity': return ruleMarkerOnActivity(elements, clause);
    case 'compensation-has-handler': return ruleCompensationHasHandler(elements);
    case 'all-tokens-reach-end': return ruleAllTokensReachEnd(elements);
    case 'subprocess-start-event': return ruleSubprocessStartEvent(elements);
    case 'event-position-valid': return ruleEventPositionValid(elements);
    default: return { status: 'fail', message: `Aturan tidak dikenal: ${clause.rule}` };
  }
}

function runCheck(elements: BpmnElement[], check: CheckAuto | CheckAssisted): RuleResult {
  // Kombinator
  if ('anyOf' in check && check.anyOf) {
    const results = check.anyOf.map((c) => runRule(elements, c));
    if (results.some((r) => r.status === 'pass')) return { status: 'pass' };
    return results[0];
  }
  if ('allOf' in check && check.allOf) {
    for (const c of check.allOf) {
      const r = runRule(elements, c);
      if (r.status !== 'pass') return r;
    }
    return { status: 'pass' };
  }
  if ('not' in check && check.not) {
    const r = runRule(elements, check.not);
    return r.status === 'pass' ? { status: 'fail', message: 'Kondisi NOT: aturan seharusnya tidak terpenuhi.' } : { status: 'pass' };
  }
  // Single rule
  if (check.rule) return runRule(elements, check as RuleClause);
  return { status: 'fail', message: 'Definisi check tidak lengkap.' };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Jalankan satu kriteria terhadap daftar elemen BPMN yang sudah di-parse.
 */
export function evaluateCriterion(elements: BpmnElement[], criterion: Criterion): CriterionResult {
  const { id, statement, check, readIfFailed } = criterion;

  if (check.mode === 'manual') {
    return { id, statement, mode: 'manual', status: 'manual', message: check.question, readIfFailed };
  }

  if (check.mode === 'assisted') {
    const r = runCheck(elements, check as CheckAssisted);
    return {
      id,
      statement,
      mode: 'assisted',
      status: r.status === 'pass' ? 'assisted' : 'fail',
      message: r.status === 'fail' ? (r as { message: string }).message : 'Struktur yang cocok ditemukan (dugaan — periksa sendiri).',
      note: (check as CheckAssisted).assistedNote,
      readIfFailed,
    };
  }

  // auto
  const r = runCheck(elements, check as CheckAuto);
  return {
    id,
    statement,
    mode: 'auto',
    status: r.status,
    message: r.status === 'fail' ? (r as { message: string }).message : undefined,
    readIfFailed,
  };
}

/**
 * Parse BPMN XML dengan bpmn-moddle dan kembalikan daftar semua elemen.
 * Harus dipanggil dari browser (import dinamis bpmn-moddle).
 */
export async function parseBpmnElements(xml: string): Promise<BpmnElement[]> {
  const BpmnModdle = (await import('bpmn-moddle')).default;
  const moddle = new BpmnModdle();
  const { rootElement } = await moddle.fromXML(xml) as { rootElement: BpmnElement };
  return allElements(rootElement);
}
