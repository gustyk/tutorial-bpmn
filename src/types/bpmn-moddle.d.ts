declare module 'bpmn-moddle' {
  interface ModdleElement {
    $type: string;
    id?: string;
    name?: string;
    [key: string]: unknown;
  }

  interface FromXMLResult {
    rootElement: ModdleElement;
    warnings: unknown[];
  }

  class BpmnModdle {
    fromXML(xml: string): Promise<FromXMLResult>;
    toXML(element: ModdleElement, options?: object): Promise<{ xml: string }>;
  }

  export default BpmnModdle;
}
