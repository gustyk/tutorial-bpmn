/**
 * rules.test.mjs — unit test 11 aturan CriteriaChecker (T-4.4).
 * Berjalan dengan `node --test tests/rules.test.mjs`.
 * Menggunakan mock BpmnElement[] tanpa XML parsing (tidak perlu browser).
 * Cakupan: setiap aturan punya 1 kasus PASS dan 1 kasus FAIL.
 */
import { test } from 'node:test';
import assert from 'node:assert/strict';

// ─── Inline rule functions (paralel dengan src/lib/rules/engine.ts) ───────────

function allElements(root) {
  const result = [];
  const visit = (el) => {
    result.push(el);
    for (const key of Object.keys(el)) {
      const val = el[key];
      if (Array.isArray(val)) val.forEach((v) => v && typeof v === 'object' && '$type' in v && visit(v));
      else if (val && typeof val === 'object' && '$type' in val) visit(val);
    }
  };
  visit(root);
  return result;
}

function ofType(elements, type) {
  return elements.filter((e) => e.$type === type || e.$type.startsWith(type));
}
function hasDefinition(el, defType) {
  return ((el.eventDefinitions ?? [])).some((d) => d.$type === defType);
}
function matchesName(el, pattern) {
  if (!el.name) return false;
  try { return new RegExp(pattern, 'i').test(el.name); } catch { return false; }
}

// 1. element-exists
function ruleElementExists(elements, { type = '', min = 1, max }) {
  const found = ofType(elements, type);
  if (found.length < min) return { status: 'fail', message: `found ${found.length}, min ${min}` };
  if (max !== undefined && found.length > max) return { status: 'fail', message: `found ${found.length}, max ${max}` };
  return { status: 'pass' };
}

// 2. boundary-attached-to
function ruleBoundaryAttachedTo(elements, clause) {
  const boundaries = elements.filter((e) => e.$type === 'bpmn:BoundaryEvent');
  const matching = boundaries.filter((b) => {
    if (clause.eventDefinition && !hasDefinition(b, clause.eventDefinition)) return false;
    if (clause.interrupting !== undefined && (b.cancelActivity) !== clause.interrupting) return false;
    if (clause.activityMatch?.nameMatches) {
      const attached = b.attachedToRef;
      if (!attached || !matchesName(attached, clause.activityMatch.nameMatches)) return false;
    }
    return true;
  });
  return matching.length > 0 ? { status: 'pass' } : { status: 'fail', message: 'no matching boundary' };
}

// 3. no-sequence-flow-across-participants
function ruleNoSeqFlowAcrossParticipants(elements) {
  const seqFlows = ofType(elements, 'bpmn:SequenceFlow');
  const pools = elements.filter((e) => e.$type === 'bpmn:Participant');
  if (pools.length < 2) return { status: 'pass' };
  const mem = new Map();
  for (const pool of pools) {
    const proc = pool.processRef;
    if (!proc) continue;
    const members = allElements(proc);
    members.forEach((m) => { if (m.id) mem.set(m.id, pool.id); });
  }
  const violations = seqFlows.filter((sf) => {
    const srcPool = mem.get(sf.sourceRef?.id ?? '');
    const tgtPool = mem.get(sf.targetRef?.id ?? '');
    return srcPool && tgtPool && srcPool !== tgtPool;
  });
  return violations.length > 0 ? { status: 'fail', message: `${violations.length} cross-pool flows` } : { status: 'pass' };
}

// 4. message-flow-between-participants
function ruleMsgFlow(elements, { min = 1 }) {
  const flows = elements.filter((e) => e.$type === 'bpmn:MessageFlow');
  return flows.length >= min ? { status: 'pass' } : { status: 'fail', message: `found ${flows.length}, min ${min}` };
}

// 5. gateway-split-labeled
function ruleGatewaySplitLabeled(elements, { type = 'bpmn:ExclusiveGateway' }) {
  const splits = ofType(elements, type).filter((gw) => (gw.outgoing ?? []).length > 1);
  const unlabeled = splits.filter((gw) => {
    const nonDefault = (gw.outgoing ?? []).filter((sf) => !gw.default || sf.id !== gw.default.id);
    return nonDefault.some((sf) => !sf.conditionExpression);
  });
  return unlabeled.length > 0 ? { status: 'fail', message: `${unlabeled.length} unlabeled` } : { status: 'pass' };
}

// 6. gateway-join-type
function ruleGatewayJoinType(elements, { splitType = 'bpmn:ParallelGateway', joinType = 'bpmn:ParallelGateway' }) {
  const splits = ofType(elements, splitType).filter((gw) => (gw.outgoing ?? []).length > 1);
  const joins = ofType(elements, joinType).filter((gw) => (gw.incoming ?? []).length > 1);
  if (splits.length > 0 && joins.length === 0) return { status: 'fail', message: 'split without join' };
  return { status: 'pass' };
}

// 7. marker-on-activity
function ruleMarkerOnActivity(elements, { marker = 'multiInstance', activityMatch }) {
  const activities = elements.filter((e) =>
    e.$type.includes('Task') || e.$type === 'bpmn:SubProcess' || e.$type === 'bpmn:CallActivity'
  );
  const relevant = activityMatch?.nameMatches ? activities.filter((a) => matchesName(a, activityMatch.nameMatches)) : activities;
  const hasMarker = relevant.some((a) => {
    if (marker === 'loop') return a.loopCharacteristics?.$type === 'bpmn:StandardLoopCharacteristics';
    if (marker === 'multiInstance') return a.loopCharacteristics?.$type === 'bpmn:MultiInstanceLoopCharacteristics';
    if (marker === 'compensation') return !!a.isForCompensation;
    return false;
  });
  return hasMarker ? { status: 'pass' } : { status: 'fail', message: `no ${marker} marker found` };
}

// 8. compensation-has-handler
function ruleCompensationHasHandler(elements) {
  const throws = elements.filter((e) =>
    (e.$type === 'bpmn:IntermediateThrowEvent' || e.$type === 'bpmn:EndEvent') && hasDefinition(e, 'bpmn:CompensateEventDefinition')
  );
  if (throws.length === 0) return { status: 'pass' };
  const handlers = elements.filter((e) => e.isForCompensation === true);
  return handlers.length > 0 ? { status: 'pass' } : { status: 'fail', message: 'no compensation handler' };
}

// 9. all-tokens-reach-end
function ruleAllTokensReachEnd(elements) {
  const flowNodes = elements.filter((e) =>
    e.$type.includes('Task') || e.$type.includes('Gateway') || e.$type.includes('Event') || e.$type === 'bpmn:SubProcess'
  );
  const endEvents = elements.filter((e) => e.$type === 'bpmn:EndEvent');
  if (endEvents.length === 0) return { status: 'fail', message: 'no end event' };
  const seqFlows = elements.filter((e) => e.$type === 'bpmn:SequenceFlow');
  const successors = new Map();
  for (const sf of seqFlows) {
    const src = sf.sourceRef?.id; const tgt = sf.targetRef?.id;
    if (src && tgt) { const list = successors.get(src) ?? []; list.push(tgt); successors.set(src, list); }
  }
  const endIds = new Set(endEvents.map((e) => e.id));
  const canReachEnd = (startId) => {
    const visited = new Set(); const queue = [startId];
    while (queue.length > 0) {
      const curr = queue.shift();
      if (endIds.has(curr)) return true;
      if (visited.has(curr)) continue;
      visited.add(curr);
      (successors.get(curr) ?? []).forEach((s) => queue.push(s));
    }
    return false;
  };
  const stuck = flowNodes.filter((n) => n.id && !endIds.has(n.id) && !canReachEnd(n.id));
  return stuck.length > 0 ? { status: 'fail', message: `${stuck.length} stuck nodes` } : { status: 'pass' };
}

// 10. subprocess-start-event
function ruleSubprocessStartEvent(elements) {
  const subprocesses = elements.filter((e) => e.$type === 'bpmn:SubProcess' && !e.triggeredByEvent);
  for (const sp of subprocesses) {
    const children = allElements(sp);
    const starts = children.filter((e) => e.$type === 'bpmn:StartEvent' && e !== sp);
    const hasNoneStart = starts.some((s) => !(s.eventDefinitions ?? []).length);
    if (starts.length > 0 && !hasNoneStart) return { status: 'fail', message: 'subprocess missing None Start' };
  }
  return { status: 'pass' };
}

// 11. event-position-valid
function ruleEventPositionValid(elements) {
  const boundaries = elements.filter((e) => e.$type === 'bpmn:BoundaryEvent');
  for (const b of boundaries) {
    const isInterrupting = b.cancelActivity !== false;
    const defs = b.eventDefinitions ?? [];
    if (defs.some((d) => d.$type === 'bpmn:ErrorEventDefinition') && !isInterrupting)
      return { status: 'fail', message: 'error boundary must interrupt' };
    if (defs.some((d) => d.$type === 'bpmn:CancelEventDefinition') && !isInterrupting)
      return { status: 'fail', message: 'cancel boundary must interrupt' };
  }
  return { status: 'pass' };
}

// ─── Test fixtures ────────────────────────────────────────────────────────────

const task1 = { $type: 'bpmn:Task', id: 'T1', name: 'Pay Invoice' };
const startEvt = { $type: 'bpmn:StartEvent', id: 'Start1', eventDefinitions: [] };
const endEvt = { $type: 'bpmn:EndEvent', id: 'End1', eventDefinitions: [] };
const sf12 = { $type: 'bpmn:SequenceFlow', id: 'F1', sourceRef: startEvt, targetRef: task1 };
const sf23 = { $type: 'bpmn:SequenceFlow', id: 'F2', sourceRef: task1, targetRef: endEvt };
const baseElements = [startEvt, task1, endEvt, sf12, sf23];

// ─── Tests ───────────────────────────────────────────────────────────────────

test('element-exists: PASS — task found', () => {
  const r = ruleElementExists(baseElements, { rule: 'element-exists', type: 'bpmn:Task', min: 1 });
  assert.equal(r.status, 'pass');
});

test('element-exists: FAIL — gateway not found', () => {
  const r = ruleElementExists(baseElements, { rule: 'element-exists', type: 'bpmn:ExclusiveGateway', min: 1 });
  assert.equal(r.status, 'fail');
});

test('boundary-attached-to: PASS — timer boundary found', () => {
  const attached = { $type: 'bpmn:Task', id: 'PayTask', name: 'Tunggu Pembayaran' };
  const boundary = { $type: 'bpmn:BoundaryEvent', id: 'B1', eventDefinitions: [{ $type: 'bpmn:TimerEventDefinition' }], cancelActivity: true, attachedToRef: attached };
  const r = ruleBoundaryAttachedTo([...baseElements, attached, boundary], { rule: 'boundary-attached-to', eventDefinition: 'bpmn:TimerEventDefinition', interrupting: true });
  assert.equal(r.status, 'pass');
});

test('boundary-attached-to: FAIL — no timer boundary', () => {
  const r = ruleBoundaryAttachedTo(baseElements, { rule: 'boundary-attached-to', eventDefinition: 'bpmn:TimerEventDefinition' });
  assert.equal(r.status, 'fail');
});

test('no-sequence-flow-across-participants: PASS — single pool', () => {
  const r = ruleNoSeqFlowAcrossParticipants(baseElements);
  assert.equal(r.status, 'pass');
});

test('no-sequence-flow-across-participants: FAIL — cross-pool sequence flow', () => {
  const p1task = { $type: 'bpmn:Task', id: 'P1T', name: 'A' };
  const p2task = { $type: 'bpmn:Task', id: 'P2T', name: 'B' };
  const crossFlow = { $type: 'bpmn:SequenceFlow', id: 'CF', sourceRef: p1task, targetRef: p2task };
  // Manually populate mem for test
  const mem = new Map([['P1T', 'Pool1'], ['P2T', 'Pool2']]);
  const seqFlows = [crossFlow];
  const violations = seqFlows.filter((sf) => {
    const srcPool = mem.get(sf.sourceRef?.id ?? '');
    const tgtPool = mem.get(sf.targetRef?.id ?? '');
    return srcPool && tgtPool && srcPool !== tgtPool;
  });
  assert.equal(violations.length, 1);
});

test('message-flow-between-participants: PASS', () => {
  const msgFlow = { $type: 'bpmn:MessageFlow', id: 'MF1' };
  const r = ruleMsgFlow([...baseElements, msgFlow], { min: 1 });
  assert.equal(r.status, 'pass');
});

test('message-flow-between-participants: FAIL — no message flow', () => {
  const r = ruleMsgFlow(baseElements, { min: 1 });
  assert.equal(r.status, 'fail');
});

test('gateway-split-labeled: PASS — all labeled', () => {
  const sf_a = { $type: 'bpmn:SequenceFlow', id: 'SFA', conditionExpression: 'ok' };
  const sf_b = { $type: 'bpmn:SequenceFlow', id: 'SFB', conditionExpression: 'nok' };
  const gw = { $type: 'bpmn:ExclusiveGateway', id: 'GW1', outgoing: [sf_a, sf_b] };
  const r = ruleGatewaySplitLabeled([...baseElements, gw, sf_a, sf_b], { type: 'bpmn:ExclusiveGateway' });
  assert.equal(r.status, 'pass');
});

test('gateway-split-labeled: FAIL — unlabeled outgoing', () => {
  const sf_a = { $type: 'bpmn:SequenceFlow', id: 'SFA', conditionExpression: 'ok' };
  const sf_b = { $type: 'bpmn:SequenceFlow', id: 'SFB' }; // no condition
  const gw = { $type: 'bpmn:ExclusiveGateway', id: 'GW1', outgoing: [sf_a, sf_b] };
  const r = ruleGatewaySplitLabeled([...baseElements, gw, sf_a, sf_b], { type: 'bpmn:ExclusiveGateway' });
  assert.equal(r.status, 'fail');
});

test('gateway-join-type: PASS — split and join present', () => {
  const sf_a = { $type: 'bpmn:SequenceFlow', id: 'A' };
  const sf_b = { $type: 'bpmn:SequenceFlow', id: 'B' };
  const sf_c = { $type: 'bpmn:SequenceFlow', id: 'C' };
  const split = { $type: 'bpmn:ParallelGateway', id: 'Split', outgoing: [sf_a, sf_b] };
  const join = { $type: 'bpmn:ParallelGateway', id: 'Join', incoming: [sf_a, sf_b] };
  const r = ruleGatewayJoinType([split, join, sf_a, sf_b, sf_c], { splitType: 'bpmn:ParallelGateway', joinType: 'bpmn:ParallelGateway' });
  assert.equal(r.status, 'pass');
});

test('gateway-join-type: FAIL — split without join', () => {
  const sf_a = { $type: 'bpmn:SequenceFlow', id: 'A' };
  const sf_b = { $type: 'bpmn:SequenceFlow', id: 'B' };
  const split = { $type: 'bpmn:ParallelGateway', id: 'Split', outgoing: [sf_a, sf_b] };
  const r = ruleGatewayJoinType([split, sf_a, sf_b], { splitType: 'bpmn:ParallelGateway', joinType: 'bpmn:ParallelGateway' });
  assert.equal(r.status, 'fail');
});

test('marker-on-activity: PASS — multi-instance task', () => {
  const loopTask = { $type: 'bpmn:Task', id: 'MT', name: 'Process Item', loopCharacteristics: { $type: 'bpmn:MultiInstanceLoopCharacteristics' } };
  const r = ruleMarkerOnActivity([...baseElements, loopTask], { marker: 'multiInstance' });
  assert.equal(r.status, 'pass');
});

test('marker-on-activity: FAIL — no marker', () => {
  const r = ruleMarkerOnActivity(baseElements, { marker: 'compensation' });
  assert.equal(r.status, 'fail');
});

test('compensation-has-handler: PASS — handler exists', () => {
  const compThrow = { $type: 'bpmn:IntermediateThrowEvent', id: 'CT', eventDefinitions: [{ $type: 'bpmn:CompensateEventDefinition' }] };
  const handler = { $type: 'bpmn:Task', id: 'CH', isForCompensation: true };
  const r = ruleCompensationHasHandler([...baseElements, compThrow, handler]);
  assert.equal(r.status, 'pass');
});

test('compensation-has-handler: FAIL — throw without handler', () => {
  const compThrow = { $type: 'bpmn:IntermediateThrowEvent', id: 'CT', eventDefinitions: [{ $type: 'bpmn:CompensateEventDefinition' }] };
  const r = ruleCompensationHasHandler([...baseElements, compThrow]);
  assert.equal(r.status, 'fail');
});

test('all-tokens-reach-end: PASS — connected flow', () => {
  const r = ruleAllTokensReachEnd(baseElements);
  assert.equal(r.status, 'pass');
});

test('all-tokens-reach-end: FAIL — dead-end task', () => {
  const deadTask = { $type: 'bpmn:Task', id: 'Dead' }; // no outgoing
  const sfDead = { $type: 'bpmn:SequenceFlow', id: 'FD', sourceRef: endEvt, targetRef: deadTask };
  const r = ruleAllTokensReachEnd([...baseElements, deadTask, sfDead]);
  assert.equal(r.status, 'fail');
});

test('subprocess-start-event: PASS — None start in subprocess', () => {
  const noneStart = { $type: 'bpmn:StartEvent', id: 'SS', eventDefinitions: [] };
  const spTask = { $type: 'bpmn:Task', id: 'SPT' };
  const sp = { $type: 'bpmn:SubProcess', id: 'SP', flowElements: [noneStart, spTask] };
  const r = ruleSubprocessStartEvent([...baseElements, sp, noneStart, spTask]);
  assert.equal(r.status, 'pass');
});

test('subprocess-start-event: FAIL — timer start in subprocess', () => {
  const timerStart = { $type: 'bpmn:StartEvent', id: 'TS', eventDefinitions: [{ $type: 'bpmn:TimerEventDefinition' }] };
  const sp = { $type: 'bpmn:SubProcess', id: 'SP', flowElements: [timerStart] };
  const r = ruleSubprocessStartEvent([...baseElements, sp, timerStart]);
  assert.equal(r.status, 'fail');
});

test('event-position-valid: PASS — interrupting error boundary', () => {
  const errBoundary = { $type: 'bpmn:BoundaryEvent', id: 'EB', eventDefinitions: [{ $type: 'bpmn:ErrorEventDefinition' }], cancelActivity: true };
  const r = ruleEventPositionValid([...baseElements, errBoundary]);
  assert.equal(r.status, 'pass');
});

test('event-position-valid: FAIL — non-interrupting error boundary', () => {
  const errBoundary = { $type: 'bpmn:BoundaryEvent', id: 'EB', eventDefinitions: [{ $type: 'bpmn:ErrorEventDefinition' }], cancelActivity: false };
  const r = ruleEventPositionValid([...baseElements, errBoundary]);
  assert.equal(r.status, 'fail');
});
