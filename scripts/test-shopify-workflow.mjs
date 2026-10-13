import assert from 'node:assert/strict';
import { WORKFLOW_PHASES, getWorkflowState, phaseNodeState } from '../src/data/shopifyWorkflow.ts';
import { WORKFLOW_NODES, WORKFLOW_CONNECTIONS, WORKFLOW_NODE_GAP, buildWorkflowDiagram, connectionDraw, nodeConnected, workflowNodeArrival, getStableWorkflowState, MOBILE_PILL_HEIGHT } from '../src/data/shopifyWorkflowDiagram.ts';

assert.deepEqual(WORKFLOW_PHASES.map(p => p.label), ['DISCOVER','AUDIT & PLAN','IMPLEMENT','VERIFY & PUBLISH','OPTIMIZE','MEASURE & ITERATE']);
assert.deepEqual(WORKFLOW_PHASES[2].nodes, ['PRODUCT LISTINGS','UI/UX & PDP','CRO','SEO & SPEED']);
assert.deepEqual(WORKFLOW_PHASES[3].nodes, ['QA & PUBLISH']);
assert.deepEqual(WORKFLOW_PHASES[4].nodes, ['A/B TESTING','MARKETING AUTOMATION','STORE OPERATIONS']);
assert.deepEqual(WORKFLOW_PHASES[5].supportingLabels, ['SHOPIFY ANALYTICS','RESULTS & LEARNINGS','NEXT PRIORITIES']);
for (const direction of [1,-1]) {
  for (let step=0; step<=10000; step++) {
    const progress=direction===1 ? step/10000 : 1-step/10000;
    const state=getWorkflowState(progress);
    const phase=WORKFLOW_PHASES[state.activePhase];
    const nextPhase=WORKFLOW_PHASES[state.activePhase+1];
    assert.ok(progress>=phase.start && (!nextPhase || progress<nextPhase.start+(nextPhase.end-nextPhase.start)*nextPhase.activationProgress));
    assert.ok(state.phaseProgress>=0 && state.phaseProgress<=1);
    const current=WORKFLOW_PHASES.map((_,i)=>phaseNodeState(i,state.activePhase));
    assert.equal(current.filter(s=>s==='current').length,1);
    assert.equal(current.indexOf('current'),state.activePhase);
    for(const edge of WORKFLOW_CONNECTIONS) {
      const source=WORKFLOW_NODES.find(n=>n.id===edge.from);
      const target=WORKFLOW_NODES.find(n=>n.id===edge.to);
      assert.equal(connectionDraw(edge,state)===1,nodeConnected(target,state));
      if(nodeConnected(target,state)) assert.equal(nodeConnected(source,state),true);
    }
  }
}
WORKFLOW_PHASES.forEach((phase,index)=>{
  const arrival=phase.start+(phase.end-phase.start)*phase.activationProgress;
  assert.equal(getWorkflowState(arrival+.0000001).activePhase,index);
  if(index) assert.equal(getWorkflowState(arrival-.000001).activePhase,index-1);
});
for(const p of [0,.99,.12,.7,.3,1,.53,.14,0]) assert.equal(phaseNodeState(getWorkflowState(p).activePhase,getWorkflowState(p).activePhase),'current');
assert.equal(getWorkflowState(-1).activePhase,0);
assert.equal(getWorkflowState(2).activePhase,5);
assert.equal(getWorkflowState(NaN).activePhase,0);
// The same global threshold starts the incoming link and schedules the node's
// glow/ripple after the CSS .9s draw. A reverse crossing resets both targets.
for (const node of WORKFLOW_NODES) {
  const phase=WORKFLOW_PHASES[node.phase];
  const before=getWorkflowState(workflowNodeArrival(node)-.000001);
  const after=getWorkflowState(workflowNodeArrival(node)+.000001);
  assert.equal(nodeConnected(node,before),false);
  assert.equal(nodeConnected(node,after),true);
  for(const edge of WORKFLOW_CONNECTIONS.filter(edge=>edge.to===node.id)) {
    assert.ok(connectionDraw(edge,before)<1);
    assert.equal(connectionDraw(edge,after),1);
  }
  assert.equal(nodeConnected(node,getWorkflowState(1)),true);
}
assert.equal(WORKFLOW_CONNECTIONS.length,17);
for(const edge of WORKFLOW_CONNECTIONS) {
  const phase=WORKFLOW_PHASES[edge.phase];
  const middle=getWorkflowState(phase.start+(edge.start+edge.end)/2*(phase.end-phase.start));
  assert.equal(connectionDraw(edge,middle),0);
  assert.equal(connectionDraw(edge,getWorkflowState(1)),1);
  assert.equal(connectionDraw(edge,getWorkflowState(0)),0);
  const from=WORKFLOW_NODES.find(n=>n.id===edge.from), to=WORKFLOW_NODES.find(n=>n.id===edge.to);
  const points=edge.d.match(/-?\d+(?:\.\d+)?/g).map(Number);
  assert.deepEqual(points.slice(0,2),[from.x,from.y+21]);
  assert.deepEqual(points.slice(-2),[to.x,to.y-21]);
  assert.equal(points[3],points[1]);
  assert.equal(points[5],points[7]);
  for(let i=0;i<points.length;i+=2) {
    assert.ok(points[i+1]>=from.y+21 && points[i+1]<=to.y-21);
  }
}
for(const widths of [{},Object.fromEntries(WORKFLOW_NODES.map((n,i)=>[n.id,60+i*12]))]) {
  const diagram=buildWorkflowDiagram(widths);
  for(let phase=0;phase<6;phase++) {
    const row=diagram.nodes.filter(n=>n.phase===phase);
    row.slice(1).forEach((n,i)=>assert.equal(n.x-n.width/2-(row[i].x+row[i].width/2),WORKFLOW_NODE_GAP));
    assert.equal((row[0].x-row[0].width/2+row.at(-1).x+row.at(-1).width/2)/2,500);
    assert.equal(new Set(row.map(n=>n.y)).size,1);
  }
}
assert.equal(WORKFLOW_NODES.filter(n=>nodeConnected(n,getWorkflowState(0))).length,0);
for(const compact of [false,true]) {
  const diagram=buildWorkflowDiagram({},compact);
  for(const edge of diagram.connections) {
    const from=diagram.nodes.find(n=>n.id===edge.from);
    const to=diagram.nodes.find(n=>n.id===edge.to);
    assert.ok(to.y-21>from.y+21);
  }
}
console.log('Shopify workflow: content, boundaries, 20,002 forward/reverse samples, and fast jumps passed.');
console.log('Global connector/node activation, source readiness, fast jumps, and reverse resets passed.');
console.log('Equal measured-width gaps, centered rows, and 17 curved links with horizontal tangents passed.');

// Tiny reversals around an arrival must not restart the glow/counter/ripple.
// Once the user actually scrolls back beyond the release band, it must reset.
for(const node of WORKFLOW_NODES) {
  const arrival=workflowNodeArrival(node);
  let state=getStableWorkflowState(arrival-.005,getWorkflowState(0));
  assert.equal(nodeConnected(node,state),false);
  state=getStableWorkflowState(arrival+.0001,state);
  assert.equal(nodeConnected(node,state),true);
  const phase=state.activePhase;
  for(const delta of [-.0004,.0001,-.001,.0002,-.002]) {
    state=getStableWorkflowState(arrival+delta,state);
    assert.equal(nodeConnected(node,state),true);
    assert.equal(state.activePhase,phase);
  }
  state=getStableWorkflowState(arrival-.004,state);
  assert.equal(nodeConnected(node,state),false);
}

// No compact connector may pass through an unrelated pill. Sample the cubic
// curves, covering both the two-column implementation group and merge links.
const mobile=buildWorkflowDiagram(); // Desktop remains unchanged above.
assert.equal(mobile.connections.length,17);
const compact=buildWorkflowDiagram({},true);
assert.equal(new Set(compact.nodes.filter(n=>n.phase===2).map(n=>n.y)).size,2);
assert.equal(compact.connections.length,15);
for(const edge of compact.connections) {
  const points=edge.d.match(/-?\d+(?:\.\d+)?/g).map(Number);
  for(let sample=0;sample<=100;sample++) {
    const t=sample/100,u=1-t;
    const x=u**3*points[0]+3*u*u*t*points[2]+3*u*t*t*points[4]+t**3*points[6];
    const y=u**3*points[1]+3*u*u*t*points[3]+3*u*t*t*points[5]+t**3*points[7];
    for(const node of compact.nodes.filter(n=>n.id!==edge.from && n.id!==edge.to)) {
      assert.ok(!(Math.abs(x-node.x)<node.width/2 && Math.abs(y-node.y)<MOBILE_PILL_HEIGHT/2),`${edge.from} → ${edge.to} intersects ${node.id}`);
    }
  }
}
for(const node of compact.nodes) assert.ok(node.x-node.width/2>=0 && node.x+node.width/2<=372);
console.log('Slow-scroll boundary stability, deliberate reverse reset, and mobile paths clear of unrelated pills passed.');
