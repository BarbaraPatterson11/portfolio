import React, { useLayoutEffect, useRef, useState, useMemo } from 'react';
import { useReducedMotion } from 'framer-motion';
import { WORKFLOW_PHASES, clampProgress, type WorkflowState } from '../../data/shopifyWorkflow';
import { WORKFLOW_ROW_Y, MOBILE_WORKFLOW_HEIGHT, MOBILE_PILL_HEIGHT, buildWorkflowDiagram, connectionDraw, nodeConnected } from '../../data/shopifyWorkflowDiagram';
import { useIsMobileCanvas } from '../../hooks/useViewport';

export const EcommerceArchitectureGraph: React.FC<{ state: WorkflowState }> = ({ state }) => {
  const reducedMotion = useReducedMotion();
  const compact = useIsMobileCanvas();
  const svgRef = useRef<SVGSVGElement>(null);
  const [widths, setWidths] = useState<Record<string,number>>({});
  // One fixed diagram. Never change its coordinate system during scrolling.
  useLayoutEffect(() => {
    let cancelled = false;
    const measure = () => {
      if (cancelled || !svgRef.current) return;
      const next: Record<string,number> = {};
      svgRef.current.querySelectorAll<SVGTextElement>('[data-node-label]').forEach(text => {
        next[text.dataset.nodeLabel!] = Math.ceil(text.getComputedTextLength() + (compact ? 26 : 34));
      });
      setWidths(next);
    };
    measure();
    void document.fonts.ready.then(measure);
    return () => { cancelled = true; };
  }, [compact]);
  const {nodes,connections}=useMemo(()=>buildWorkflowDiagram(widths, compact),[widths, compact]);
  const pillHeight=compact ? MOBILE_PILL_HEIGHT : 40;
  const connected = nodes.filter(node => nodeConnected(node, state));
  const latest = connected.at(-1)?.id;
  const loopDraw = state.activePhase === 5 ? clampProgress((state.phaseProgress - .38) / .57) : 0;
  const finalWidth = nodes.at(-1)!.width;
  const auditWidth = nodes.find(node=>node.id==='audit-plan-0')!.width;
  const finalY = nodes.at(-1)!.y;
  const auditY = nodes.find(node=>node.id==='audit-plan-0')!.y;
  const loop = compact
    ? `M ${186+finalWidth/2} ${finalY} C 358 ${finalY} 366 ${finalY} 366 ${finalY-26} L 366 ${auditY+26} C 366 ${auditY} 358 ${auditY} ${186+auditWidth/2} ${auditY}`
    : `M ${500+finalWidth/2} 570 C 940 570 945 570 945 480 L 945 260 C 945 170 940 170 ${500+auditWidth/2} 170`;
  return <div className="client-workflow-graph">
    <svg ref={svgRef} viewBox={compact ? `0 0 372 ${MOBILE_WORKFLOW_HEIGHT}` : '0 0 1000 620'} className="shopify-workflow-svg" role="img" data-active-phase={state.activePhase}
      aria-label={`My Shopify workflow. Active phase: ${WORKFLOW_PHASES[state.activePhase].label}. Nodes illuminate when their connections arrive. Measurement feeds back into Audit and Plan.`}>
      <defs>
        <filter id="workflow-glow" x="-100%" y="-120%" width="300%" height="340%"><feGaussianBlur stdDeviation="4.5" result="blur" /><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="workflow-line-gradient" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="white" stopOpacity=".7"/><stop offset="1" stopColor="white" stopOpacity=".25"/></linearGradient>
        <marker id="workflow-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M 1 1 L 9 5 L 1 9" fill="none" stroke="white" /></marker>
      </defs>
      {!compact && WORKFLOW_PHASES.map((phase, index) => <text key={phase.id} x="34" y={WORKFLOW_ROW_Y[index]} dominantBaseline="central"
        className="workflow-level" data-connected={connected.some(node=>node.phase===index)}>{phase.label}</text>)}
      {connections.map((curve,index) => {
        const draw = connectionDraw(curve,state);
        return <g key={`${curve.from}-${curve.to}`} data-connection={index} data-from={curve.from} data-to={curve.to} data-connected={draw===1} data-draw={draw.toFixed(3)} data-owner-phase={curve.phase}>
          <path d={curve.d} className="workflow-path-base" />
          <path d={curve.d} pathLength="1" className="workflow-path" style={{strokeDashoffset:1-draw}} />
          {!reducedMotion && <>
            <path d={curve.d} className="workflow-flow" />
            <circle r="2.8" className="workflow-packet"><animateMotion dur="2.6s" repeatCount="indefinite" keyPoints="0;1" keyTimes="0;1" calcMode="linear" path={curve.d} /></circle>
            {!compact && <circle r="2.2" className="workflow-packet workflow-packet-back"><animateMotion dur="3.1s" begin="0.8s" repeatCount="indefinite" keyPoints="1;0" keyTimes="0;1" calcMode="linear" path={curve.d} /></circle>}
          </>}
        </g>;
      })}
      <g data-feedback-loop data-draw={loopDraw.toFixed(3)}>
        <path d={loop} className="workflow-path-base" />
        <path d={loop} className="workflow-path workflow-feedback" pathLength="1" markerEnd={loopDraw>=.999?'url(#workflow-arrow)':undefined} style={{strokeDashoffset:1-loopDraw,opacity:.6}} />
        {loopDraw>=.999 && !reducedMotion && !compact && <circle r="2.6" fill="white"><animateMotion dur="5s" repeatCount="indefinite" path={loop} /></circle>}
        {!compact && <text x="930" y="385" transform="rotate(-90 930 385)" className="workflow-loop-label" opacity={loopDraw*.55}>LEARN · REPRIORITIZE · IMPROVE</text>}
      </g>
      {nodes.map(node => {
        const on = nodeConnected(node,state);
        const width = widths[node.id] ?? node.width;
        const waveSpread = compact ? 10 : 16;
        return <g key={node.id} transform={`translate(${node.x} ${node.y})`} className="workflow-node"
          style={{'--arrival-delay': node.phase === 0 ? '0s' : '.9s'} as React.CSSProperties}
          data-x={node.x} data-y={node.y} data-width={width}
          data-workflow-node={node.id} data-phase={node.phase} data-connected={on} data-hot={on && node.id===latest}>
          <title>{node.label}: {WORKFLOW_PHASES[node.phase].description}</title>
          <rect className="workflow-node-glow" x={-width/2} y={-pillHeight/2} width={width} height={pillHeight} rx={pillHeight/2} />
          <rect className="workflow-node-wave" x={-width/2} y={-pillHeight/2} width={width} height={pillHeight} rx={pillHeight/2} ry={pillHeight/2}
            style={{
              '--wave-left': `${-width / 2}px`,
              '--wave-width': `${width}px`,
              '--wave-left-end': `${-width / 2 - waveSpread}px`,
              '--wave-width-end': `${width + waveSpread * 2}px`,
              '--wave-top-end': `${-20 - waveSpread}px`,
              '--wave-height-end': `${40 + waveSpread * 2}px`,
              '--wave-radius-end': `${20 + waveSpread}px`,
              '--wave-scale-x': (width + 16) / width,
            } as React.CSSProperties}
            vectorEffect="non-scaling-stroke"
            aria-hidden="true" data-ripple-for={node.id} />
          <rect className="workflow-node-pill" x={-width/2} y={-pillHeight/2} width={width} height={pillHeight} rx={pillHeight/2} />
          <circle cx={-width/2+(compact ? 11 : 16)} cy="0" r={compact ? 2.5 : 3.2} />
          <text data-node-label={node.id} x="8" y="0" dominantBaseline="central" textAnchor="middle">{node.label}</text>
        </g>;
      })}
    </svg>
  </div>;
};
