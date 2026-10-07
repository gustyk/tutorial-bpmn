import { readdir, readFile } from 'node:fs/promises';
import { BpmnModdle } from 'bpmn-moddle';

const root = new URL('../public/bpmn/', import.meta.url);
const entries = await readdir(root);
const files = entries.filter((name) => name.endsWith('.bpmn'));
if (!files.length) throw new Error('No BPMN files found.');
const moddle = new BpmnModdle();
let failed = false;
for (const file of files) {
  const xml = await readFile(new URL(file, root), 'utf8');
  try {
    const { rootElement, warnings = [] } = await moddle.fromXML(xml);
    const definitions = rootElement;
    if (definitions.$type !== 'bpmn:Definitions') throw new Error('Root is not bpmn:Definitions.');
    const processes = definitions.rootElements.filter((element) => element.$type === 'bpmn:Process');
    if (!processes.length) throw new Error('No process definitions found.');
    const collaboration = definitions.rootElements.find((element) => element.$type === 'bpmn:Collaboration');
    const participants = collaboration?.participants ?? [];
    for (const participant of participants) {
      if (participant.processRef && !processes.some((process) => process.id === participant.processRef.id)) {
        throw new Error(`Participant ${participant.id} references a missing process.`);
      }
    }
    const diagram = definitions.diagrams?.[0];
    const planeElements = diagram?.plane?.planeElement ?? [];
    if (!diagram || !planeElements.length) throw new Error('BPMNDiagram plane is missing or empty.');
    const hasDi = (type, modelElement) => planeElements.some((di) => di.$type === type && di.bpmnElement?.id === modelElement.id);
    for (const process of processes) {
      const flows = process.flowElements.filter((element) => element.$type === 'bpmn:SequenceFlow');
      const nodes = process.flowElements.filter((element) => element.$type !== 'bpmn:SequenceFlow');
      const nodeIds = new Set(nodes.map((node) => node.id));
      for (const flow of flows) {
        if (!nodeIds.has(flow.sourceRef?.id) || !nodeIds.has(flow.targetRef?.id)) throw new Error(`Invalid sequence flow ${flow.id}.`);
        if (!hasDi('bpmndi:BPMNEdge', flow)) throw new Error(`Sequence flow ${flow.id} has no BPMN DI edge.`);
      }
      for (const node of nodes) {
        if (!hasDi('bpmndi:BPMNShape', node)) throw new Error(`Flow node ${node.id} has no BPMN DI shape.`);
      }
    }
    const ownerPool = (reference) => {
      if (participants.some((participant) => participant.id === reference?.id)) return reference.id;
      const process = processes.find((candidate) => candidate.flowElements.some((node) => node.id === reference?.id));
      return participants.find((participant) => participant.processRef?.id === process?.id)?.id;
    };
    for (const messageFlow of collaboration?.messageFlows ?? []) {
      const sourcePool = ownerPool(messageFlow.sourceRef);
      const targetPool = ownerPool(messageFlow.targetRef);
      if (!sourcePool || !targetPool) throw new Error(`Message flow ${messageFlow.id} has an unresolved participant endpoint.`);
      if (sourcePool === targetPool) throw new Error(`Message flow ${messageFlow.id} connects within one participant.`);
      if (!hasDi('bpmndi:BPMNEdge', messageFlow)) throw new Error(`Message flow ${messageFlow.id} has no BPMN DI edge.`);
    }
    for (const participant of participants) {
      if (!hasDi('bpmndi:BPMNShape', participant)) throw new Error(`Participant ${participant.id} has no BPMN DI shape.`);
    }
    if (warnings.length) console.warn(`${file}: warnings ${warnings.map((warning) => warning.message).join('; ')}`);
    console.log(`${file}: XML parsed; ${processes.length} process(es); ${warnings.length} warning(s).`);
  } catch (error) {
    failed = true;
    console.error(`${file}: ${error.message}`);
  }
}
if (failed) process.exitCode = 1;
