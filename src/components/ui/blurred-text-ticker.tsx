import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

const supportWords = [
  'I MANAGE SHOPIFY STORES.',
  'I ORGANIZE LISTINGS.',
  'I OPTIMIZE CONVERSIONS.',
  'I DESIGN STOREFRONTS.',
];

interface BlurredTextTickerProps {
  isMobile: boolean;
}

/** Reserve the longest phrase so typing never moves the copy below. */
export function BlurredTextTicker({ isMobile }: BlurredTextTickerProps) {
  const [frame, setFrame] = useState({ phrase: 0, length: 0, deleting: false });
  const reduceMotion = useReducedMotion();
  const phrase = supportWords[frame.phrase];

  useEffect(() => {
    if (reduceMotion) return;
    const complete = frame.length === phrase.length;
    const delay = frame.deleting ? (frame.length === 0 ? 320 : 24) : complete ? 1800 : 48;
    const timer = window.setTimeout(() => {
      setFrame(previous => {
        if (previous.deleting && previous.length === 0) {
          return { phrase: (previous.phrase + 1) % supportWords.length, length: 0, deleting: false };
        }
        if (!previous.deleting && complete) return { ...previous, deleting: true };
        return { ...previous, length: previous.length + (previous.deleting ? -1 : 1) };
      });
    }, delay);
    return () => window.clearTimeout(timer);
  }, [frame, phrase, reduceMotion]);

  return (
    <div className={`hero-typewriter ${isMobile ? 'hero-typewriter-mobile' : ''}`}
      aria-label="Shopify store management, product listings, conversion rate optimization, and Shopify UI/UX storefront design">
      <div className="hero-typewriter-sizer" aria-hidden="true">
        {supportWords.map(word => <span key={word}>{word}</span>)}
      </div>
      <span className="hero-typewriter-live" aria-hidden="true">
        {reduceMotion ? supportWords[0] : phrase.slice(0, frame.length)}
        <span className="hero-typewriter-caret" />
      </span>
    </div>
  );
}
