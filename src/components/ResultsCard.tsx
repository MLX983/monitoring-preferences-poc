import * as React from "react";
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

/** Match `.card-title-layer { transition: opacity … }` in primitives.css (in + out ≈ 200ms each; total sequence ≈ 200 + 950 + 200ms). */
const FADE_IN_MS = 200;
const HOLD_MS = 950;

type Props = {
  posture: Posture;
  /** Incremented when sliders change but posture id stays the same — triggers title stability feedback. */
  stabilityPulse: number;
};

export default function ResultsCard({ posture, stabilityPulse }: Props) {
  // IMPORTANT: no memoization that can go stale.
  // This recomputes every render based on current posture.id.
  const copy = COPY_BY_POSTURE[posture.id];

  // Fallback: if an id is missing from the map (shouldn't happen), use logic copy.
  const headline = copy?.title ?? posture.title;
  const whyLabel = copy?.whyLabel ?? "Here's why";

  // If mapping exists, use it; otherwise use posture.reasons (both!)
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
    setLayerPostureOpacity(1);
    setLayerStabilityOpacity(0);

    const reducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      setLayerPostureOpacity(0);
      setLayerStabilityOpacity(1);
      const t = window.setTimeout(() => {
        setLayerStabilityOpacity(0);
        setLayerPostureOpacity(1);
      }, 650);
      timersRef.current.push(t);
      return () => clearTimers();
    }

    const startFadeToStability = () => {
      setLayerPostureOpacity(0);
      setLayerStabilityOpacity(1);
    };

    const startFadeToPosture = () => {
      setLayerPostureOpacity(1);
      setLayerStabilityOpacity(0);
    };

    let raf2 = 0;
    const raf1 = window.requestAnimationFrame(() => {
      raf2 = window.requestAnimationFrame(startFadeToStability);
    });

    const tHold = window.setTimeout(() => {
      startFadeToPosture();
    }, FADE_IN_MS + HOLD_MS);

    timersRef.current.push(tHold);

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
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
