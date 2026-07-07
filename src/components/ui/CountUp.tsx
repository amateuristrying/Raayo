import { useEffect, useRef } from "react";
import gsap from "gsap";

interface CountUpProps {
  value: number;
  suffix?: string;
  /** Format with Indian digit grouping (12,840). */
  grouped?: boolean;
  duration?: number;
  className?: string;
}

function format(value: number, grouped: boolean, suffix: string): string {
  const rounded = Math.round(value);
  return (grouped ? rounded.toLocaleString("en-IN") : String(rounded)) + suffix;
}

/** Animates a number from 0 to `value` on mount using GSAP. */
export function CountUp({
  value,
  suffix = "",
  grouped = false,
  duration = 1.4,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const counter = { current: 0 };
    const tween = gsap.to(counter, {
      current: value,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        if (ref.current) {
          ref.current.textContent = format(counter.current, grouped, suffix);
        }
      },
    });

    // rAF pauses in background tabs; land on the final value instead of
    // leaving a half-counted number on screen.
    const finishIfHidden = () => {
      if (document.hidden) tween.progress(1);
    };
    finishIfHidden();
    document.addEventListener("visibilitychange", finishIfHidden);

    return () => {
      document.removeEventListener("visibilitychange", finishIfHidden);
      tween.kill();
    };
  }, [value, suffix, grouped, duration]);

  return (
    <span ref={ref} className={className}>
      {format(0, grouped, suffix)}
    </span>
  );
}
