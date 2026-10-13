import React, { useEffect } from 'react';
import { gsap } from 'gsap';
import { VisualEditorProvider } from './contexts/VisualEditorContext';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Navbar } from './components/layout/Navbar';
import { SideNav } from './components/layout/SideNav';
import { Hero } from './sections/Hero';
import { Tools } from './sections/Tools';
import { EcommercePlatforms } from './sections/EcommercePlatforms';
import { Services } from './sections/Services';
import { Portfolio } from './sections/Portfolio';
import { Skills } from './sections/Skills';
import { Contact } from './sections/Contact';
import { useHeroIntro } from './hooks/useHeroIntro';
import { useSideNavVisibility } from './hooks/useSideNavVisibility';
import { subscribeStageRelayout } from './lib/viewportStage';
import { startSmoothScroll } from './lib/smoothScroll';
import { SiteCursor } from './components/ui/SiteCursor';

gsap.registerPlugin(ScrollTrigger);
// Browser toolbar changes do not alter the mobile scene's stable svh height.
ScrollTrigger.config({ ignoreMobileResize: true });

if (import.meta.env.DEV) {
  // Companion to `__viewportStage`: lets a scroll timeline be inspected and
  // stepped from the console when checking how the stage rescale behaves.
  Object.assign(window, { gsap, ScrollTrigger });
}

const App: React.FC = () => {
  useEffect(() => startSmoothScroll(), []);

  useEffect(() => {
    // Refresh ScrollTrigger after all sections mount
    const timer = setTimeout(() => ScrollTrigger.refresh(), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    // Every ScrollTrigger start/end is a cached pixel measurement. Rescaling
    // the stage — restoring the window down, rotating a phone, switching the
    // preview canvas — invalidates all of them at once, and without this the
    // page keeps playing the old timeline: that is what left the About panel
    // stuck half-faded after a resize.
    let timer = 0;
    const unsubscribe = subscribeStageRelayout(() => {
      // Settle first: dragging a window edge rescales the stage on every frame,
      // and a full refresh per frame would crawl.
      window.clearTimeout(timer);
      timer = window.setTimeout(() => ScrollTrigger.refresh(), 140);
    });

    return () => {
      window.clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  return (
    <VisualEditorProvider>
      <AppContent />
    </VisualEditorProvider>
  );
};

const AppContent: React.FC = () => {
  const isHeroIntro = useHeroIntro();
  const isSideNavVisible = useSideNavVisibility();

  return (
    <div className="relative">
      <SiteCursor />
      {/* Everything below is laid out on the fixed design canvas. */}
      <div id="viewport-stage" className="viewport-stage">
        <Navbar isVisible={isHeroIntro} />
        <SideNav isVisible={isSideNavVisible} />
        <main>
          <Hero isLoaded={true} />
          <Services />
          <Skills />
          <EcommercePlatforms />
          <Tools />
          <Portfolio />
          <Contact />
        </main>
      </div>
    </div>
  );
};

export default App;
