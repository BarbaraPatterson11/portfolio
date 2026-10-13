export const WORKFLOW_PHASES = [
  {
    id: 'discover', label: 'DISCOVER', heading: 'Understand the Business', start: 0, end: 0.14, activationProgress: 0,
    shortDescription: 'Understand the business before making changes.',
    description: "Identify the client's business objectives, target customers, products, offers, and existing challenges. Define project responsibilities, confirm the scope of work, and arrange appropriate Shopify access.",
    areas: ['Business Goals', 'Target Customers', 'Project Scope & Access'],
    leftDetails: [],
    nodes: ['BUSINESS GOALS', 'TARGET CUSTOMERS', 'SCOPE & ACCESS'],
    supportingLabels: ['BUSINESS GOALS', 'TARGET CUSTOMERS', 'SCOPE & ACCESS'],
  },
  {
    id: 'audit-plan', label: 'AUDIT & PLAN', heading: 'Diagnose & Prioritize', start: 0.14, end: 0.28, activationProgress: 0.32,
    shortDescription: 'Find problems before choosing solutions.',
    description: 'Review the store, performance data, and customer feedback to find the highest-priority opportunities before implementation.',
    areas: ['Store Audit', 'Baseline Analytics', 'Backup', 'Client Approval'],
    leftDetails: [
      { title: 'Store Audit', text: 'Review the homepage, navigation, collections, product pages, cart flow, and technical setup.' },
      { title: 'Data Analysis', text: 'Analyze baseline KPIs, funnel performance, customer segments, and conversion drop-offs using Shopify Analytics and GA4.' },
      { title: 'Customer Insights', text: 'Review support tickets, reviews, FAQs, session behavior, and customer objections to identify purchase friction.' },
      { title: 'Strategic Plan', text: 'Develop CRO hypotheses, prioritize by impact and effort, and define an actionable implementation roadmap.' },
    ],
    nodes: ['AUDIT & PLAN'],
    supportingLabels: ['STORE AUDIT', 'BASELINE ANALYTICS', 'BACKUP & APPROVAL'],
  },
  {
    id: 'implement', label: 'IMPLEMENT', heading: 'Improve the Store', start: 0.28, end: 0.53, activationProgress: 0.30,
    shortDescription: 'Build a better shopping experience.',
    description: 'Organize product listings, descriptions, variants, inventory, and collections. Improve storefront UI/UX, product detail pages, USP messaging, navigation, conversion opportunities, product SEO, and website performance.',
    areas: ['Product Listings', 'Storefront UI/UX & PDP', 'CRO', 'SEO & Speed'],
    leftDetails: [],
    nodes: ['PRODUCT LISTINGS', 'UI/UX & PDP', 'CRO', 'SEO & SPEED'],
    supportingLabels: ['PRODUCT LISTINGS', 'UI/UX & PDP', 'CRO', 'SEO & SPEED'],
  },
  {
    id: 'verify-publish', label: 'VERIFY & PUBLISH', heading: 'Quality Assurance', start: 0.53, end: 0.68, activationProgress: 0.32,
    shortDescription: 'Verify every important change before publishing.',
    description: 'Test desktop and mobile layouts, product variants, Add to Cart functionality, cart behavior, checkout journeys, tracking, and affected storefront elements. Publish only after approval, then verify the live store.',
    areas: ['Desktop & Mobile QA', 'Cart & Checkout Tests', 'Approved Publishing'],
    leftDetails: [],
    nodes: ['QA & PUBLISH'],
    supportingLabels: ['DESKTOP & MOBILE QA', 'CART & CHECKOUT', 'APPROVED PUBLISHING'],
  },
  {
    id: 'optimize', label: 'OPTIMIZE', heading: 'Operate & Experiment', start: 0.68, end: 0.83, activationProgress: 0.30,
    shortDescription: 'Keep optimizing beyond the initial changes.',
    description: 'Develop and evaluate CRO experiments when traffic and resources allow. Support approved email and operational automations using Klaviyo or Shopify Flow, while maintaining accurate product information and ongoing store operations.',
    areas: ['A/B Testing', 'Klaviyo & Shopify Flow', 'Store Operations'],
    leftDetails: [],
    nodes: ['A/B TESTING', 'MARKETING AUTOMATION', 'STORE OPERATIONS'],
    supportingLabels: ['A/B TESTING', 'MARKETING AUTOMATION', 'STORE OPERATIONS'],
  },
  {
    id: 'measure-iterate', label: 'MEASURE & ITERATE', heading: 'Report & Improve Again', start: 0.83, end: 1, activationProgress: 0.28,
    shortDescription: 'Measure what changed. Plan what comes next.',
    description: 'Review conversion performance, average order value, product performance, store health, and relevant retention metrics. Document results, explain limitations, share recommendations, and identify the next improvement priorities.',
    areas: ['Shopify Analytics', 'Results & Learnings', 'Next Priorities'],
    leftDetails: [],
    nodes: ['MEASURE & ITERATE'],
    supportingLabels: ['SHOPIFY ANALYTICS', 'RESULTS & LEARNINGS', 'NEXT PRIORITIES'],
  },
] as const;

export interface WorkflowState { activePhase: number; progress: number; phaseProgress: number; connectedMask?: number }
export const clampProgress = (progress: number) => Number.isFinite(progress) ? Math.max(0, Math.min(1, progress)) : 0;

/** One mapping governs the number, copy, group glow, and path drawing. */
export function getWorkflowState(progress: number): WorkflowState {
  const p = clampProgress(progress);
  // Keep the current copy/number on screen while the incoming connector draws.
  // A phase becomes active at the same progress its first node is connected.
  const nextPhase = WORKFLOW_PHASES.findIndex((phase, index) => index > 0 && p < phase.start + (phase.end - phase.start) * phase.activationProgress);
  const index = nextPhase === -1 ? WORKFLOW_PHASES.length - 1 : nextPhase - 1;
  const phase = WORKFLOW_PHASES[index];
  return { activePhase: index, progress: p, phaseProgress: clampProgress((p - phase.start) / (phase.end - phase.start)) };
}

export function phaseNodeState(phase: number, activePhase: number) {
  return phase === activePhase ? 'current' : phase < activePhase ? 'completed' : 'upcoming';
}
