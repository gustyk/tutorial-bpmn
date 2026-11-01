/**
 * Types untuk rules engine (IMPLEMENTATION-PLAN §4.4).
 * Berjalan di browser dengan bpmn-moddle (parse + traverse).
 */

export type RuleResult =
  | { status: 'pass' }
  | { status: 'fail'; message: string }
  | { status: 'assisted'; message: string; note: string };

export type CheckMode = 'auto' | 'manual' | 'assisted';

export interface RuleClause {
  rule: string;
  type?: string;
  min?: number;
  max?: number;
  eventDefinition?: string;
  interrupting?: boolean;
  activityMatch?: { nameMatches?: string };
  splitType?: string;
  joinType?: string;
  marker?: 'multiInstance' | 'compensation' | 'loop';
}

export interface CheckAuto extends RuleClause {
  mode: 'auto';
  anyOf?: RuleClause[];
  allOf?: RuleClause[];
  not?: RuleClause;
}

export interface CheckManual {
  mode: 'manual';
  question: string;
}

export interface CheckAssisted extends RuleClause {
  mode: 'assisted';
  assistedNote: string;
}

export type CheckDefinition = CheckAuto | CheckManual | CheckAssisted;

export interface Criterion {
  id: string;
  statement: string;
  rationale?: string;
  readIfFailed?: string[];
  check: CheckDefinition;
}

export interface CriteriaFile {
  schemaVersion: 1;
  caseId: string;
  criteria: Criterion[];
}

export interface CriterionResult {
  id: string;
  statement: string;
  mode: CheckMode;
  status: 'pass' | 'fail' | 'manual' | 'assisted';
  message?: string;
  note?: string;
  readIfFailed?: string[];
}

/** Tipe minimal bpmn-moddle element yang kita butuhkan */
export interface BpmnElement {
  $type: string;
  id?: string;
  name?: string;
  [key: string]: unknown;
}
