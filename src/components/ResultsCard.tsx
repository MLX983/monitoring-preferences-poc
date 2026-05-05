import * as React from "react";
import { flushSync } from "react-dom";
import type { Posture, PostureId } from "../logic/computeRecommendation";

/**
 * Figma-fidelity copy mapping.
 * We keep computeRecommendation as the logic source of truth (id),
 * and map to the exact UI strings here.
 */
const COPY_BY_POSTURE: Record<
  Posture["id"],
  {
    title: string; // top blue headline inside the card
    whyLabel: string;
    reasons: [string, string];
  }
> = {
  fast_filtered: {
    title: "We'll interrupt quickly, but only when it really matters.",
    whyLabel: "Here's why",
    reasons: ["High urgency", "Low tolerance for surprises"],
  },
  fast_noisy: {
    title: "We'll keep you informed quickly, even if it's a bit noisy at first.",
    whyLabel: "Here's why",
    reasons: ["High urgency", "Higher tolerance for noise"],
  },
  digest_review: {
    title: "We'll summarize routine variability and escalate only when patterns shift.",
    whyLabel: "Here's why",
    reasons: ["Lower urgency", "Preference for review over interruptions"],
  },
  manual_check: {
    title: "We'll stay quiet during normal variability and escalate when patterns shift.",
    whyLabel: "Here's why",
    reasons: ["Low interruption preference", "High sensitivity to surprise charges"],
  },
};

const STABILITY_MESSAGE_BY_POSTURE: Record<PostureId, string> = {
  fast_filtered: "Still filtering for high-confidence alerts",
  fast_noisy: "Still surfacing early warning signs",
  digest_review: "Still saving most updates for review",
  manual_check: "Still keeping notifications sparse",
};

/** Match `.card-title-layer` transition duration in primitives.css */
const PRE_DELAY_MS = 300;
const FADE_MS = 450;
/** Hold stability line fully visible before fading out. */
const HOLD_MS = 900;

type Props = {
  posture: Posture;
  /** Incremented when sliders change but posture id stays the same — triggers title stability feedback. */
  stabilityPulse: number;
};

export default function ResultsCard({ posture, stabilityPulse }: Props) {
  const copy = COPY_BY_POSTURE[posture.id];

  const headline = copy?.title ?? posture.title;
  const whyLabel = copy?.whyLabel ?? "Here's why";

  const reasons: [string, string] = copy?.reasons ?? posture.reasons;

  const stabilityLine = STABILITY_MESSAGE_BY_POSTURE[posture.id];

  const [layerPostureOpacity, setLayerPostureOpacity] = React.useState(1);
  const [layerStabilityOpacity, setLayerStabilityOpacity] = React.useState(0);
  const timersRef = React.useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = React.useCallback(() => {
    timersRef.current.forEach(clearTimeout);
    timersRef.current = [];
  }, []);

  React.useEffect(() => {
    clearTimers();
    setLayerPostureOpacity(1);
    setLayerStabilityOpacity(0);
  }, [posture.id, clearTimers]);

  React.useEffect(() => {
    if (stabilityPulse === 0) return;

    clearTimers();

    const schedule = (delayMs: number, fn: () => void) => {
      const t = window.setTimeout(fn, delayMs);
      timersRef.current.push(t);
    };

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setLayerPostureOpacity(0);
      setLayerStabilityOpacity(1);
      const t = window.setTimeout(() => {
        setLayerStabilityOpacity(0);
        setLayerPostureOpacity(1);
      }, PRE_DELAY_MS + HOLD_MS);
      timersRef.current.push(t);
      return () => clearTimers();
    }

    /**
     * Safari/WebKit + React 18 may skip CSS opacity transitions if batched updates never
     * commit a “reset” frame. flushSync commits the baseline; double rAF starts the crossfade
     * after paint so `transition: opacity` runs reliably.
     */
    flushSync(() => {
      setLayerPostureOpacity(1);
      setLayerStabilityOpacity(0);
    });

    let raf1 = 0;
    let raf2 = 0;
    raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(() => {
        // 1) Brief pause on default title.
        // 2) Fade default out.
        // 3) Fade stability in.
        // 4) Hold.
        // 5) Fade stability out.
        // 6) Fade default back in.
        schedule(PRE_DELAY_MS, () => {
          setLayerPostureOpacity(0);
        });

        schedule(PRE_DELAY_MS + FADE_MS, () => {
          setLayerStabilityOpacity(1);
        });

        schedule(PRE_DELAY_MS + FADE_MS + FADE_MS + HOLD_MS, () => {
          setLayerStabilityOpacity(0);
        });

        schedule(PRE_DELAY_MS + FADE_MS + FADE_MS + HOLD_MS + FADE_MS, () => {
          setLayerPostureOpacity(1);
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(raf1);
      window.cancelAnimationFrame(raf2);
      clearTimers();
    };
  }, [stabilityPulse, clearTimers]);

  return (
    <div className="card">
      <div className="card-title-wrap">
        <div className="card-title-layer" style={{ opacity: layerPostureOpacity }}>
          {headline}
        </div>
        <div
          className="card-title-layer card-title-layer--overlay"
          aria-hidden={layerStabilityOpacity === 0}
          style={{ opacity: layerStabilityOpacity }}
        >
          {stabilityLine}
        </div>
      </div>

      <div className="card-body">
        <div style={{ fontWeight: 700, marginBottom: "var(--spacing-tight, 4px)" }}>
          {whyLabel}
        </div>

        <div style={{ display: "grid", gap: "var(--spacing-tight, 4px)" }}>
          <div>{reasons[0]}</div>
          <div>{reasons[1]}</div>
        </div>
      </div>
    </div>
  );
}
