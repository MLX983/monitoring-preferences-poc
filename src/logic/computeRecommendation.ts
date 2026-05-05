export type SliderKey = "signal" | "tolerance" | "control" | "surface";

export type SliderValues = Record<SliderKey, number>; // 0..100

export type PostureId =
  | "fast_filtered"
  | "fast_noisy"
  | "digest_review"
  | "manual_check";

export type Posture = {
  id: PostureId;
  title: string;
  body: string;
  reasons: [string, string];
};

/**
 * Core idea:
 * - SIGNAL (Notify): how quickly you want to know
 * - TOLERANCE (Surprise charges): slider LEFT “Surprises are fine” → higher tolerance for
 *   noise / lower surprise sensitivity; RIGHT “No surprises, ever” → lower tolerance for
 *   noise / higher surprise sensitivity.
 * - CONTROL (Automation): how much you want automation to act vs just inform
 * - SURFACE (Devices): how broadly you want monitoring to reach you
 *
 * Values are 0..100.
 */
export function computePosture(values: SliderValues): Posture {
  // normalize to 0..1
  const signal = clamp01(values.signal / 100);
  const surpriseSensitivity = clamp01(values.tolerance / 100);
  const control = clamp01(values.control / 100);
  const surface = clamp01(values.surface / 100);

  // derived signals (simple, legible)
  const urgency = signal; // want-to-know-fast
  const noiseAcceptance = 1 - surpriseSensitivity;
  const automationPreference = control; // system agency
  const reach = surface; // how many “surfaces” can interrupt you

  // interpretive thresholds (tunable)
  const urgent = urgency >= 0.66;
  const tolerant = noiseAcceptance >= 0.55;
  const automationHigh = automationPreference >= 0.6;
  const reachHigh = reach >= 0.6;

  // posture selection (ordered for readability)
  if (urgent && !tolerant) {
    // Fast + low tolerance => filtered, high-confidence
    return {
      id: "fast_filtered",
      title: "Fast, filtered alerts",
      body:
        "Prioritize speed, but keep noise low. Use strong rules, batching for borderline events, and high-signal triggers.",
      reasons: [
        "High urgency, low noise tolerance",
        automationHigh
          ? "Automation can triage and suppress low-value alerts"
          : "Human review stays in the loop for edge cases",
      ],
    };
  }

  if (urgent && tolerant) {
    // Fast + high tolerance => rapid + noisy (good for discovery / early warning)
    return {
      id: "fast_noisy",
      title: "Rapid alerts with early-warning noise",
      body:
        "You’ll see more pings, but you’ll learn sooner. Use lightweight rules now and tighten them once patterns emerge.",
      reasons: [
        "High urgency, higher noise tolerance",
        reachHigh ? "Broad delivery increases responsiveness" : "Keep delivery focused to avoid overload",
      ],
    };
  }

  if (!urgent && (automationHigh || reachHigh)) {
    // Not urgent but wants system to handle it or broad surfaces => digest + review
    return {
      id: "digest_review",
      title: "Digest-first monitoring with review",
      body:
        "Let the system watch continuously, but interrupt you less. Use digests, summaries, and escalation only for high-risk changes.",
      reasons: [
        "Lower urgency favors summaries over interruptions",
        automationHigh
          ? "Automation can watch constantly and escalate selectively"
          : "Broader surfaces support periodic review without panic",
      ],
    };
  }

  // Default: manual-first
  return {
    id: "manual_check",
    title: "Manual checks with minimal automation",
    body:
      "Keep notifications sparse. Rely on scheduled checks and a small set of truly critical alerts as a backstop.",
    reasons: [
      "Lower urgency and lower automation preference",
      "Keeps cognitive load predictable",
    ],
  };
}

/**
 * Compatibility wrapper: if other parts of your repo call `computeRecommendation`,
 * this keeps names consistent.
 */
export function computeRecommendation(values: SliderValues): Posture {
  return computePosture(values);
}

function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}
