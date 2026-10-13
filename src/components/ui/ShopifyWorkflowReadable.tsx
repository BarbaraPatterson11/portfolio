import { WORKFLOW_PHASES, phaseNodeState, type WorkflowState } from '../../data/shopifyWorkflow';
import { scrollToPosition } from '../../lib/smoothScroll';

/** Full-size vertical presentation for phones, tablets, and reduced motion. */
export function ShopifyWorkflowReadable({ state, interactive = true }: { state: WorkflowState; interactive?: boolean }) {
  return (
    <section className="workflow-readable-list" aria-labelledby="workflow-readable-heading">
      <p className="journey-kicker">MY SHOPIFY WORKFLOW</p>
      <h2 id="workflow-readable-heading">A clear process. Continuous improvement.</h2>
      <ol className="workflow-vertical-phases">
        {WORKFLOW_PHASES.map((phase, index) => (
          <li key={phase.id} id={`workflow-phase-${phase.id}`} data-readable-phase={index}
            data-state={phaseNodeState(index, state.activePhase)} aria-current={state.activePhase === index ? 'step' : undefined}>
            <div className="workflow-card-number">{String(index + 1).padStart(2, '0')}</div>
            <p className="workflow-card-label">{phase.label}</p>
            <h3>{phase.heading}</h3>
            <p className="workflow-card-short">{phase.shortDescription}</p>
            <ul className="workflow-card-nodes" aria-label={`${phase.label} core areas`}>
              {phase.supportingLabels.map(label => <li key={label}><span aria-hidden="true" />{label}</li>)}
            </ul>
            <p className="workflow-card-description">{phase.description}</p>
            {index === 5 && <div className="workflow-readable-loop">
              <svg viewBox="0 0 300 48" aria-hidden="true"><path d="M 280 36 C 290 5, 10 5, 20 36 M 13 28 L 20 36 L 28 28" /></svg>
              {interactive ? <a href="#workflow-phase-audit-plan" onClick={event => {
                const target = document.getElementById('workflow-phase-audit-plan');
                if (!target) return;
                event.preventDefault();
                scrollToPosition(target.getBoundingClientRect().top + window.scrollY - 70);
              }}>MEASURE → LEARN → REPRIORITIZE → IMPROVE<span>Back to Audit & Plan ↺</span></a>
                : <p>MEASURE → LEARN → REPRIORITIZE → IMPROVE. Back to Audit & Plan.</p>}
            </div>}
          </li>
        ))}
      </ol>
    </section>
  );
}
