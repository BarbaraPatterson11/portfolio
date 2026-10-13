import { WORKFLOW_PHASES, clampProgress, getWorkflowState, type WorkflowState } from './shopifyWorkflow.ts';

export const WORKFLOW_ROW_Y = [70,170,270,370,470,570];
export const WORKFLOW_NODE_GAP = 28;
export const MOBILE_WORKFLOW_HEIGHT = 504;
export const MOBILE_PILL_HEIGHT = 32;
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
  'A/B TESTING': 'A/B TEST', 'MARKETING AUTOMATION': 'AUTOMATION', 'STORE OPERATIONS': 'OPERATIONS',
};

export function buildWorkflowDiagram(widths: Record<string,number> = {}, compact = false) {
  const center = compact ? 186 : 500;
  const gap = compact ? 24 : WORKFLOW_NODE_GAP;
  const nodes = WORKFLOW_PHASES.flatMap((phase, index) => {
    const row = phase.nodes.map((label,n) => ({
      id: `${phase.id}-${n}`, phase:index, label: compact ? (mobileLabels[label] ?? label) : label,
      width:widths[`${phase.id}-${n}`] ?? Math.ceil((compact ? (mobileLabels[label] ?? label).length * 8 + 26 : label.length*9.5+34)),
      arrive:arrivals[index][n], x:0,
      y:compact ? [24,100,176,318,394,470][index] + (index===2 && n>=2 ? 66 : 0) : WORKFLOW_ROW_Y[index],
    }));
    if (compact && index===2) {
      // Two readable columns instead of squeezing four pills into one row.
      row.forEach((node,n)=>{node.x=n%2===0?106:266;});
    } else {
      const totalWidth = row.reduce((sum,node)=>sum+node.width,0) + (row.length-1)*gap;
      let left = center-totalWidth/2;
      row.forEach(node=>{ node.x=left+node.width/2; left+=node.width+gap; });
    }
    return row;
  });
  const connections: {
    phase:number; start:number; end:number;
    from:string; to:string; d:string;
  }[] = [];
  const addConnection = (source: typeof nodes[number], target: typeof nodes[number]) => {
    const halfHeight = compact ? MOBILE_PILL_HEIGHT/2 : 20;
    const sy=source.y+halfHeight+1, ty=target.y-halfHeight-1;
    const bend = source.x === target.x ? (compact ? 14 : 40) : (compact ? 28 : 72);
    const d=`M ${source.x} ${sy} C ${source.x+bend} ${sy}, ${target.x-bend} ${ty}, ${target.x} ${ty}`;
    connections.push({phase:target.phase,from:source.id,to:target.id,d,
      start:Math.max(0,target.arrive-.30), end:target.arrive,
    });
  };
  for(let phase=1;phase<WORKFLOW_PHASES.length;phase++) {
    const sources=nodes.filter(node=>node.phase===phase-1);
    const targets=nodes.filter(node=>node.phase===phase);
    for(const source of sources) for(const target of targets) {
      if (compact && phase===2 && targets.indexOf(target)>=2) continue;
      if (compact && phase===3 && sources.indexOf(source)<2) continue;
      addConnection(source,target);
    }
    if (compact && phase===2) {
      addConnection(targets[0],targets[2]);
      addConnection(targets[1],targets[3]);
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
  return nodeConnected({phase:connection.phase,arrive:connection.end},state) ? 1 : 0;
}
export function nodeConnected(node: {phase:number;arrive:number}, state: WorkflowState) {
  if (state.connectedMask !== undefined) {
    const index=WORKFLOW_NODES.findIndex(candidate=>candidate.phase===node.phase && candidate.arrive===node.arrive);
    if (index>=0) return (state.connectedMask & (1<<index))!==0;
  }
  return clampProgress(state.progress) >= workflowNodeArrival(node);
}

/** Scroll noise cannot repeatedly restart a node's arrival animation. An
 * intentional reverse past the 0.3% release band still retracts the links. */
export function getStableWorkflowState(progress:number, previous:WorkflowState): WorkflowState {
  const next=getWorkflowState(progress);
  let connectedMask=0;
  WORKFLOW_NODES.forEach((node,index)=>{
    const release=nodeConnected(node,previous) ? .003 : 0;
    if (next.progress>=workflowNodeArrival(node)-release) connectedMask|=1<<index;
  });
  let activePhase=0;
  WORKFLOW_NODES.forEach((node,index)=>{
    if ((connectedMask & (1<<index))!==0) activePhase=Math.max(activePhase,node.phase);
  });
  const phase=WORKFLOW_PHASES[activePhase];
  return {...next,activePhase,phaseProgress:clampProgress((next.progress-phase.start)/(phase.end-phase.start)),connectedMask};
}
