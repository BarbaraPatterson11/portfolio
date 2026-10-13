import { useLayoutEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { useReducedMotion } from 'framer-motion';

/** Only the digit rolls. Phase copy stays stationary and updates immediately. */
export function WorkflowPhaseCounter({ value, compact = false }: { value:number; compact?: boolean }) {
  const reduced=useReducedMotion();
  const track=useRef<HTMLSpanElement>(null);
  const counter=useRef<HTMLSpanElement>(null);
  const position=useRef({digit:value+10});
  useLayoutEffect(()=>{
    const paint=()=>{
      // Full-em reel rows leave clearance between glyphs. The .11em inset
      // aligns their baseline with the original .78em display line box.
      if(track.current) track.current.style.transform=`translate3d(0,${-(position.current.digit+(compact ? 0 : .11))}em,0)`;
      if(counter.current) counter.current.dataset.displayedCount=String(Math.round(position.current.digit)%10).padStart(2,'0');
    };
    paint();
    if(reduced) { position.current.digit=value+10; paint(); return; }
    const tween=gsap.to(position.current,{digit:value+10,duration:.55,ease:'power2.out',onUpdate:paint});
    return ()=>{tween.kill();};
  },[value,reduced,compact]);
  return <span ref={counter} className="workflow-counter" aria-hidden="true" data-counter-target={value}>
    <span className="workflow-count-zero">0</span>
    <span className="workflow-count-reel"><span ref={track} className="workflow-count-track">
      {Array.from({length:30},(_,i)=><span key={i} className="workflow-count-digit">{i%10}</span>)}
    </span></span>
  </span>;
}
