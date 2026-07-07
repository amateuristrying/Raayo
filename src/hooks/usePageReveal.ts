import { useLayoutEffect, type RefObject } from "react";
import gsap from "gsap";

interface RevealStep {
  selector: string;
  offset: { x?: number; y?: number };
  duration: number;
  stagger?: number;
  position: number;
}

/*
 * Shared entrance choreography. Pages opt elements in via class names:
 *   .anim-hero    — page hero (fade + rise)
 *   .anim-metric  — hero metrics (stagger in)
 *   .anim-rise    — whole sections (fade + rise, staggered)
 *   .anim-chip    — small chips (quick stagger)
 *   .anim-item    — cards inside browse sections (sequential reveal)
 *   .anim-rail>*  — right-rail panels (fade from the right)
 */
const REVEAL_STEPS: RevealStep[] = [
  { selector: ".anim-hero", offset: { y: 24 }, duration: 0.6, position: 0 },
  {
    selector: ".anim-metric",
    offset: { y: 14 },
    duration: 0.45,
    stagger: 0.07,
    position: 0.1,
  },
  {
    selector: ".anim-rise",
    offset: { y: 24 },
    duration: 0.55,
    stagger: 0.08,
    position: 0.15,
  },
  {
    selector: ".anim-chip",
    offset: { y: 10 },
    duration: 0.35,
    stagger: 0.025,
    position: 0.35,
  },
  {
    selector: ".anim-item",
    offset: { y: 18 },
    duration: 0.5,
    stagger: 0.05,
    position: 0.3,
  },
  {
    selector: ".anim-rail > *",
    offset: { x: 20 },
    duration: 0.5,
    stagger: 0.07,
    position: 0.2,
  },
];

/**
 * Runs the page entrance timeline on mount; reverts cleanly on unmount.
 *
 * Uses fromTo with explicit end values (never from()): from() reads the
 * element's current state as the destination, which under StrictMode
 * double-effects / route transitions can capture an already-hidden state
 * and leave elements invisible. clearProps removes the inline styles when
 * each tween finishes so CSS hover transforms keep working; lazy: false
 * makes the hidden-tab progress(1) guard write styles synchronously.
 */
export function usePageReveal(rootRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let timeline: gsap.core.Timeline | undefined;
    const ctx = gsap.context(() => {
      timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      for (const step of REVEAL_STEPS) {
        const probe = step.selector.replace(" > *", "");
        if (root.querySelector(probe)) {
          timeline.fromTo(
            step.selector,
            {
              autoAlpha: 0,
              x: step.offset.x ?? 0,
              y: step.offset.y ?? 0,
            },
            {
              autoAlpha: 1,
              x: 0,
              y: 0,
              duration: step.duration,
              stagger: step.stagger,
              lazy: false,
              clearProps: "all",
            },
            step.position,
          );
        }
      }
    }, rootRef);

    // rAF pauses in background tabs; jump to the finished state so the page
    // is never blank when the user returns mid-intro.
    const finishIfHidden = () => {
      if (document.hidden) timeline?.progress(1);
    };
    finishIfHidden();
    document.addEventListener("visibilitychange", finishIfHidden);

    return () => {
      document.removeEventListener("visibilitychange", finishIfHidden);
      ctx.revert();
    };
  }, [rootRef]);
}
