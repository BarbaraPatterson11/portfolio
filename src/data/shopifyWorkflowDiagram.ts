import { WORKFLOW_PHASES, clampProgress, type WorkflowState } from './shopifyWorkflow.ts';

export const WORKFLOW_ROW_Y = [70,170,270,370,470,570];
export const WORKFLOW_NODE_GAP = 28;
const arrivals = [[.04,.17,.30],[.32],[.30,.40,.58,.68],[.32],[.30,.40,.50],[.28]];

/** Scroll thresholds are global; the left-hand phase can stay on screen
 * while the next connection draws without freezing the graph's progress. */
export function workflowNodeArrival(node: { phase: number; arrive: number }) {
  const phase = WORKFLOW_PHASES[node.phase];
  return phase.start + (phase.end - phase.start) * node.arrive;
}

/** Equal edge gaps, not equal centers: labels have different measured widths. */
const mobileLabels: Record<string, string> = {
  'BUSINESS GOALS': 'GOALS', 'TARGET CUSTOMERS': 'CUSTOMERS', 'SCOPE & ACCESS': 'ACCESS',
  'PRODUCT LISTINGS': 'LISTINGS', 'UI/UX & PDP': 'UI/UX', 'SEO & SPEED': 'SEO / SPEED',
  'MARKETING AUTOMATION': 'AUTOMATION', 'STORE OPERATIONS': 'OPERATIONS',
};

export function buildWorkflowDiagram(widths: Record<string,number> = {}, compact = false, compactHeight = 480) {
  const center = compact ? 186 : 500;
  const gap = compact ? 14 : WORKFLOW_NODE_GAP;
  const nodes = WORKFLOW_PHASES.flatMap((phase, index) => {
    const row = phase.nodes.map((label,n) => ({
      id: `${phase.id}-${n}`, phase:index, label: compact ? (mobileLabels[label] ?? label) : label,
      width:widths[`${phase.id}-${n}`] ?? Math.ceil((compact ? (mobileLabels[label] ?? label).length * 6 + 26 : label.length*9.5+34)),
      arrive:arrivals[index][n], x:0, y:compact ? 36 + index * ((compactHeight - 82) / 5) : WORKFLOW_ROW_Y[index],
    }));
    const totalWidth = row.reduce((sum,node)=>sum+node.width,0) + (row.length-1)*gap;
    let left = center-totalWidth/2;
    row.forEach(node=>{ node.x=left+node.width/2; left+=node.width+gap; });
    return row;
  });
  const connections: {
    phase:number; start:number; end:number;
    from:string; to:string; d:string;
  }[] = [];
  for(let phase=1;phase<WORKFLOW_PHASES.length;phase++) {
    const sources=nodes.filter(node=>node.phase===phase-1);
    const targets=nodes.filter(node=>node.phase===phase);
    for(const source of sources) for(const target of targets) {
      const sy=source.y+21, ty=target.y-21;
      // Horizontal tangents give both fanning links and the central S-link
      // the same soft bend as the reference diagram.
      const bend = source.x === target.x ? (compact ? 18 : 40) : (compact ? 28 : 72);
      const d=`M ${source.x} ${sy} C ${source.x+bend} ${sy}, ${target.x-bend} ${ty}, ${target.x} ${ty}`;
      connections.push({phase,from:source.id,to:target.id,d,
        start:Math.max(0,target.arrive-.30), end:target.arrive,
      });
    }
  }
  return { nodes, connections };
}
export const {nodes:WORKFLOW_NODES,connections:WORKFLOW_CONNECTIONS}=buildWorkflowDiagram();

interface DrawConnection {phase:number;start:number;end:number}
export function connectionDraw(connection: DrawConnection, state: WorkflowState) {
  // CSS draws/retracts the link over .9s after this threshold. Updating a
  // fractional dash target every scroll tick would continually restart that
  // transition and make quick wheel gestures feel stuck behind the pointer.
  return clampProgress(state.progress) >= workflowNodeArrival({phase:connection.phase,arrive:connection.end}) ? 1 : 0;
}
export function nodeConnected(node: {phase:number;arrive:number}, state: WorkflowState) {
  return clampProgress(state.progress) >= workflowNodeArrival(node);
}
