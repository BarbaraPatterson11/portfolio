import React, { useLayoutEffect, useRef, useCallback, useState } from 'react';
import { motion, useAnimationControls, useReducedMotion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useVisualEditor } from '../contexts/VisualEditorContext';
import { useViewport } from '../hooks/useViewport';
import { toCanvasLength } from '../lib/canvasUnits';
import { scrollToPosition } from '../lib/smoothScroll';
import { EditableElement } from '../components/editor/EditableElement';
import { BlurredTextTicker } from '../components/ui/blurred-text-ticker';
import { EcommerceArchitectureGraph } from '../components/ui/EcommerceArchitectureGraph';
import { WorkflowPhaseCounter } from '../components/ui/WorkflowPhaseCounter';
import { ShopifyWorkflowReadable } from '../components/ui/ShopifyWorkflowReadable';
import { WORKFLOW_PHASES, getWorkflowState } from '../data/shopifyWorkflow';
import { WORKFLOW_NODES, nodeConnected } from '../data/shopifyWorkflowDiagram';

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  isLoaded: boolean;
}

export const Hero: React.FC<HeroProps> = ({ isLoaded }) => {
  const sceneRef = useRef<HTMLElement>(null);
  const workflowSceneRef = useRef<HTMLElement>(null);
  const portraitRef = useRef<HTMLDivElement>(null);
  const portraitPoseRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const readableRef = useRef<HTMLDivElement>(null);
  const workflowTriggerRef = useRef<ReturnType<typeof ScrollTrigger.create> | null>(null);
  const { mode: canvasMode } = useViewport();
  const isMobileViewport = canvasMode === 'mobile';
  const portraitIntroControls = useAnimationControls();
  const [workflowState, setWorkflowState] = useState(() => getWorkflowState(0));
  const commitWorkflow = useCallback((progress: number) => {
    const next = getWorkflowState(progress);
    setWorkflowState(previous => {
      const sameNodes = WORKFLOW_NODES.every(node => nodeConnected(node, previous) === nodeConnected(node, next));
      const sameLoop = next.activePhase !== 5 || Math.round(previous.phaseProgress * 100) === Math.round(next.phaseProgress * 100);
      // Small touch/scroll corrections at an arrival boundary must not restart
      // the same light and ripple repeatedly. A deliberate reverse still works.
      if (isMobileViewport && !sameNodes && Math.abs(next.progress - previous.progress) < .003) return previous;
      return previous.activePhase === next.activePhase && sameNodes && sameLoop ? previous : next;
    });
  }, [isMobileViewport]);
  const reducedMotion = useReducedMotion();
  const readableWorkflow = !!reducedMotion;
  const activePhase = WORKFLOW_PHASES[workflowState.activePhase];
  const ease = [0.16, 1, 0.3, 1] as const;
  const { layout, configLoaded, editMode } = useVisualEditor();
  const getLayout = useCallback((id: string) => {
    const mobileId = `${id}Mobile`;
    const config = isMobileViewport && layout[mobileId] ? layout[mobileId] : layout[id];
    if (!config) return config;
    // Saved values may still be written with `vw` / `vh`; rewrite them into
    // canvas units so they scale with the stage instead of the raw window.
    return {
      ...config,
      fontSize: toCanvasLength(config.fontSize),
      letterSpacing: toCanvasLength(config.letterSpacing),
      lineHeight: toCanvasLength(config.lineHeight),
      width: toCanvasLength(config.width),
      height: toCanvasLength(config.height),
    };
  }, [isMobileViewport, layout]);

  // Stacking is NEVER changed for edit mode. The editor draws its selection and
  // handles outside the stage, so it does not need the element raised — and the
  // composition Frank edits stays byte-for-byte the one a visitor sees, which is
  // the whole reason its coordinates can be trusted.
  const getElementLayer = useCallback((id: string, fallback: number) => {
    const activeId = isMobileViewport ? `${id}Mobile` : id;
    return layout[activeId]?.zIndex ?? fallback;
  }, [isMobileViewport, layout]);

  const editModeRef = useRef(editMode);
  useLayoutEffect(() => { editModeRef.current = editMode; }, [editMode]);

  // Pause the portrait intro on the exact rendered frame while the editor is
  // open. This lets the saved image position be inspected and dragged without
  // an independent entrance animation continuing underneath the editor.
  useLayoutEffect(() => {
    if (editMode) {
      portraitIntroControls.stop();
      return;
    }
    void portraitIntroControls.start(isLoaded
      ? { opacity: 1, scale: 1, x: 0, y: 0 }
      : { opacity: 0, scale: 0.96, x: 0, y: isMobileViewport ? 0 : 30 });
  }, [editMode, isLoaded, isMobileViewport, portraitIntroControls]);

  // Keep the scroll-driven composition at the same frame while the editor is
  // open. Disabling its trigger preserves GSAP's current inline transforms;
  // re-enabling and refreshing resumes from the actual scroll position.
  useLayoutEffect(() => {
    const trigger = workflowTriggerRef.current;
    if (!trigger) return;
    if (editMode) trigger.disable(false);
    else {
      trigger.enable(false, false);
      ScrollTrigger.refresh();
    }
  }, [editMode]);

  useLayoutEffect(() => {
    // Keep this timeline mounted while editing. Tearing down its context resets
    // the portrait wrappers to their initial transforms, which looked like the
    // image moved as soon as the settings opened.
    if (!configLoaded || !sceneRef.current || !workflowSceneRef.current || !portraitRef.current || !portraitPoseRef.current || !aboutRef.current) return;

    const ctx = gsap.context(() => {
      const heroItems = gsap.utils.toArray<HTMLElement>('.hero-scroll-out');
      const aboutItems = gsap.utils.toArray<HTMLElement>('.about-scroll-in');

      if (readableWorkflow) {
        gsap.set(aboutRef.current, { autoAlpha: 0 });
        gsap.set(heroItems, { autoAlpha: 1, y: 0 });
        gsap.set(portraitRef.current, { x: 0, y: 0, scale: 1, autoAlpha: 1 });
        gsap.set(portraitPoseRef.current, { x: 0, y: 0 });
        let cards: { top: number; height: number }[] = [];
        const measure = () => {
          cards = Array.from(readableRef.current?.querySelectorAll<HTMLElement>('[data-readable-phase]') ?? []).map(card => {
            const rect = card.getBoundingClientRect();
            return { top: rect.top + window.scrollY, height: rect.height };
          });
        };
        const update = () => {
          const focus = window.scrollY + window.innerHeight * .5;
          let index = 0;
          cards.forEach((card, i) => { if (focus >= card.top) index = i; });
          const card = cards[index];
          if (!card) return;
          const phase = WORKFLOW_PHASES[index];
          const local = Math.max(0, Math.min(1, (focus - card.top) / card.height));
          commitWorkflow(phase.start + local * (phase.end - phase.start));
        };
        measure();
        workflowTriggerRef.current = ScrollTrigger.create({ trigger: readableRef.current, start: 'top bottom', end: 'bottom top', onUpdate: update,
          onRefresh: () => { measure(); update(); } });
        if (editModeRef.current) workflowTriggerRef.current.disable(false);
        update();
        return;
      }

      // Hero and workflow adjoin in normal document flow. Only the workflow
      // pins; portrait and copy retain their opacity and scroll together.
      gsap.set(aboutRef.current, { autoAlpha: 1, pointerEvents: 'auto' });
      gsap.set(aboutItems, { autoAlpha: 1, y: 0 });
      gsap.set(portraitPoseRef.current, { x: 0, y: 0, scale: 1 });
      const workflowClock = { progress: 0 };
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: workflowSceneRef.current,
          start: 'top top',
          end: 'bottom bottom',
          pin: isMobileViewport ? workflowSceneRef.current?.querySelector<HTMLElement>('.workflow-scene') : false,
          pinSpacing: false,
          pinType: 'fixed',
          anticipatePin: 1,
          scrub: 0.3,
          invalidateOnRefresh: true,
        },
      });
      workflowTriggerRef.current = timeline.scrollTrigger ?? null;
      if (editModeRef.current) workflowTriggerRef.current?.disable(false);

      // Preserve 3.4 screens of workflow progress once it reaches the top.
      timeline.to(workflowClock, {
        progress: 1,
        duration: 1,
        ease: 'none',
        onUpdate: () => commitWorkflow(workflowClock.progress),
      });

      // Rebuild at the actual scroll position after mode changes or a refresh.
      // The single ScrollTrigger progress is the source of truth, including
      // reverse scrolling and refreshes. Lenis already smooths physical input.
      timeline.scrollTrigger?.refresh();
      timeline.totalProgress(timeline.scrollTrigger?.progress ?? 0);
      commitWorkflow(workflowClock.progress);

      return () => {
        timeline.kill();
        workflowTriggerRef.current = null;
      };

    }, sceneRef);

    return () => {
      workflowTriggerRef.current = null;
      ctx.revert();
    };
  }, [configLoaded, isMobileViewport, readableWorkflow, commitWorkflow]);

  return (
    <section
      id="home"
      ref={sceneRef}
      className={`relative bg-black overflow-visible ${readableWorkflow ? 'workflow-readable-mode' : ''}`}
    >
      <div className="hero-page relative h-[var(--screen-h)] min-h-[var(--screen-h)] overflow-hidden bg-black">
        {/* Keep the saved composition on its fixed, bottom-anchored canvas. */}
        <div className="hero-canvas hero-reference-composition canvas-box">
          <div className="hero-reference-portrait" style={{ zIndex: getElementLayer('characterImage', 20) }}>
            <div ref={portraitRef} className="h-full w-full will-change-transform">
              <motion.div
                initial={{ opacity: 0, scale: 0.96, x: 0, y: isMobileViewport ? 0 : 30 }}
                animate={portraitIntroControls}
                transition={{ duration: isMobileViewport ? 0.82 : 1.2, ease, delay: 0.12 }}
                className="h-full w-full"
              >
                <div ref={portraitPoseRef} className="h-full w-full origin-bottom">
                  <EditableElement id="characterImage" label="Portrait" kind="image" className="h-full w-full">
                    <img
                      src={`${import.meta.env.BASE_URL}profile.png`}
                      alt="Frank Glen Martin"
                      className="hero-reference-image"
                      draggable={false}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      style={{ width: getLayout('characterImage')?.width, height: getLayout('characterImage')?.height }}
                    />
                  </EditableElement>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="hero-reference-copy">
            <div className="hero-scroll-out" data-hero-identity style={{ zIndex: getElementLayer('iAmFrankText', 10) }}>
              <EditableElement id="iAmFrankText" label="Frank Martin title">
                <h1 className="hero-reference-name" style={{
                  fontSize: getLayout('iAmFrankText')?.fontSize,
                  fontWeight: getLayout('iAmFrankText')?.fontWeight,
                  letterSpacing: getLayout('iAmFrankText')?.letterSpacing,
                  lineHeight: getLayout('iAmFrankText')?.lineHeight,
                  color: getLayout('iAmFrankText')?.color,
                }}>
                  {['Frank', 'Martin'].map((name, index) => (
                    <span key={name} className="hero-name-line">
                      <motion.span initial={reducedMotion ? false : { y: '105%' }}
                        animate={{ y: 0 }} transition={{ duration: 0.9, delay: 0.3 + index * 0.1, ease }}>
                        {name}
                      </motion.span>
                    </span>
                  ))}
                </h1>
              </EditableElement>
            </div>

            <div className="hero-scroll-out hero-reference-role-wrap">
              <EditableElement id="roleTitleText" label="Shopify & Ecommerce VA">
                <p className="hero-reference-role" style={{
                  fontSize: getLayout('roleTitleText')?.fontSize,
                  fontWeight: getLayout('roleTitleText')?.fontWeight,
                  letterSpacing: getLayout('roleTitleText')?.letterSpacing,
                  lineHeight: getLayout('roleTitleText')?.lineHeight,
                  color: getLayout('roleTitleText')?.color,
                }}><span>Shopify &amp;</span><span> Ecommerce VA</span></p>
              </EditableElement>
            </div>

            <div className="hero-scroll-out hero-reference-specialization">
              <EditableElement id="specializationText" label="Shopify specialization typewriter">
                <div style={{ fontSize: getLayout('specializationText')?.fontSize }}>
                  <BlurredTextTicker isMobile={isMobileViewport} />
                </div>
                <p className="hero-reference-lede">
                  Product listings, store management, CRO and UI/UX design.
                  {!isMobileViewport && ' From setup to everyday operations.'}
                </p>
              </EditableElement>
            </div>

          </div>

          <a href="#about" className="hero-scroll-out hero-scroll-story" onClick={event => {
            const target = document.getElementById('about');
            if (!target) return;
            event.preventDefault();
            scrollToPosition(window.scrollY + target.getBoundingClientRect().top);
          }}>
            <span>Scroll the story</span>
            <span className="hero-scroll-chevrons" aria-hidden="true"><i /><i /></span>
          </a>
        </div>

      </div>

      <section id="about" ref={workflowSceneRef}
        className="workflow-chapter relative h-[calc(4.4*var(--screen-h))] bg-black">
        <div className="workflow-scene sticky top-0 h-[var(--screen-h)] overflow-hidden bg-black">
          <div ref={aboutRef} className="hero-about-panel journey-panel">
            <div className="about-scroll-in journey-backdrop" aria-hidden="true">
              <svg viewBox="0 0 1920 920" preserveAspectRatio="xMidYMid slice">
                <defs>
                  <pattern id="journey-digits" width="42" height="54" patternUnits="userSpaceOnUse">
                    <text x="8" y="18">0</text><text x="18" y="44">1</text>
                  </pattern>
                  <radialGradient id="journey-matrix-fade">
                    <stop offset="0%" stopColor="white" /><stop offset="100%" stopColor="black" />
                  </radialGradient>
                  <mask id="journey-matrix-mask"><rect width="1920" height="920" fill="url(#journey-matrix-fade)" /></mask>
                </defs>
                <g mask="url(#journey-matrix-mask)" opacity=".055" transform="translate(110 100) skewX(-12)">
                  <rect width="1900" height="760" fill="url(#journey-digits)" />
                </g>
              </svg>
            </div>
            <div className="journey-grid">
              <div className="journey-copy-col">
                <p className="about-scroll-in journey-kicker">MY SHOPIFY WORKFLOW</p>
                <div className="about-scroll-in journey-counter" aria-label={`Phase ${workflowState.activePhase + 1} of 6`}>
                  <WorkflowPhaseCounter value={workflowState.activePhase+1} compact={isMobileViewport} />
                </div>
                <div className="about-scroll-in journey-stage">
                  <span className="journey-stage-diamond" aria-hidden="true" />
                  <span>{activePhase.label}</span>
                </div>
                <div className="about-scroll-in journey-phase-copy">
                  <div>
                    <h2 className="journey-heading">{activePhase.heading}</h2>
                    <p className="journey-copy">{activePhase.shortDescription}</p>
                    {isMobileViewport ? (
                      activePhase.leftDetails.length > 0 ? (
                        <p className="journey-mobile-summary">Store audit · Data analysis · Customer insights · Strategic plan</p>
                      ) : (
                        <p className="journey-mobile-summary">{activePhase.areas.join(' · ')}</p>
                      )
                    ) : activePhase.leftDetails.length > 0 ? (
                      <div className="journey-audit-details" aria-label="Audit and planning priorities">
                        <p className="journey-audit-intro">{activePhase.description}</p>
                        <ul>
                          {activePhase.leftDetails.map((detail) => (
                            <li key={detail.title}>
                              <strong>{detail.title}</strong>
                              <span>{detail.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="journey-proof">{activePhase.description}</p>
                    )}
                  </div>
                </div>
              </div>
              <div className="about-scroll-in journey-system">
                <EcommerceArchitectureGraph state={workflowState} />
              </div>
            </div>
            <div className="about-scroll-in journey-footer">
              <span>SCENE <strong>02</strong> · MY SHOPIFY WORKFLOW</span>
              <a href="#services">EXPLORE SERVICES ↓</a>
            </div>
          </div>
        </div>
      </section>
      <div ref={readableRef} className={readableWorkflow ? 'workflow-readable-container' : 'sr-only'}>
        <ShopifyWorkflowReadable state={workflowState} interactive={readableWorkflow} />
      </div>
    </section>
  );
};
