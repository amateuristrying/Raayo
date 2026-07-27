import { useEffect, useLayoutEffect, useRef } from "react";
import { Outlet, useLocation } from "react-router-dom";
import gsap from "gsap";
import { CreateMarketModal } from "@/components/common/CreateMarketModal";
import { PredictionModal } from "@/components/common/PredictionModal";
import { ToastHost } from "@/components/common/ToastHost";
import { startMarketSimulation } from "@/engine/markets";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

/** App chrome: navbar + sidebar around the routed page. */
export function AppLayout() {
  const rootRef = useRef<HTMLDivElement>(null);

  // Client-side liveness: probabilities drift subtly while the app is open.
  useEffect(() => startMarketSimulation(), []);

  useLayoutEffect(() => {
    let timeline: gsap.core.Timeline | undefined;
    const ctx = gsap.context(() => {
      // fromTo with explicit end values + clearProps: from() captures the
      // current state as the destination, which under StrictMode
      // double-effects can be an already-hidden state; lazy: false makes the
      // hidden-tab progress(1) guard write styles synchronously.
      timeline = gsap.timeline({ defaults: { ease: "power3.out" } });
      timeline
        .fromTo(
          ".anim-nav",
          { autoAlpha: 0, y: -16 },
          { autoAlpha: 1, y: 0, duration: 0.5, lazy: false, clearProps: "all" },
        )
        .fromTo(
          ".anim-sidebar",
          { autoAlpha: 0, x: -20 },
          { autoAlpha: 1, x: 0, duration: 0.5, lazy: false, clearProps: "all" },
          "-=0.35",
        );
    }, rootRef);

    // rAF pauses in background tabs; jump to the finished state so the chrome
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
  }, []);

  return (
    <div ref={rootRef} className="min-h-screen">
      <ScrollToTop />
      <Navbar />
      <div className="flex items-start">
        <Sidebar />
        <Outlet />
      </div>
      <PredictionModal />
      <CreateMarketModal />
      <ToastHost />
    </div>
  );
}
