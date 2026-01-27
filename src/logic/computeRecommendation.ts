// Maps slider values → recommended strategy + posture.
// This function must be deterministic and explainable.
// No side effects, no UI logic.

import type { StrategyId } from './strategies';
import type { PostureId } from './postures';

export interface SliderValues {
  interruptionTolerance: number; // 0-4: 0 = "Don't bother me", 4 = "Keep me informed"
  surpriseSensitivity: number; // 0-4: 0 = "Surprises are fine", 4 = "No surprises, ever"
  automationTrust: number; // 0-4: 0 = "I want to decide", 4 = "Handle it for me"
  deviceImpact: number; // 0-4: 0 = "Let it average out", 4 = "Flag imbalances early"
}

export interface Recommendation {
  strategyId: StrategyId;
  postureId: PostureId;
  drivers: [string, string]; // Top 2 drivers as short phrases
}

// Thresholds for decision-making (explicit and easy to change)
const LOW_THRESHOLD = 1; // Values 0-1 are considered "low"
const HIGH_THRESHOLD = 3; // Values 3-4 are considered "high"

// Deterministic tie-break order (when scores are equal)
const STRATEGY_TIE_BREAK: StrategyId[] = ['S3', 'S2', 'S4', 'S5', 'S6', 'S7', 'S1'];

/**
 * Computes a recommendation based on slider values.
 * Uses a simple scoring model where each strategy gets a score,
 * and the highest score wins (ties broken deterministically).
 */
export function computeRecommendation(values: SliderValues): Recommendation {
  const { interruptionTolerance, surpriseSensitivity, automationTrust, deviceImpact } = values;

  // Score each strategy
  const scores: Record<StrategyId, number> = {
    S1: scoreS1(interruptionTolerance, surpriseSensitivity),
    S2: scoreS2(interruptionTolerance),
    S3: scoreS3(interruptionTolerance, surpriseSensitivity, deviceImpact),
    S4: scoreS4(surpriseSensitivity, deviceImpact),
    S5: scoreS5(deviceImpact, surpriseSensitivity),
    S6: scoreS6(interruptionTolerance, automationTrust),
    S7: scoreS7(interruptionTolerance, automationTrust),
  };

  // Find the strategy with the highest score (deterministic tie-break)
  const bestStrategy = pickBestStrategy(scores);

  // Compute posture based on dominant signals
  const postureId = computePosture(values);

  // Identify top 2 drivers (in UI language)
  const drivers = identifyDrivers(values);

  return {
    strategyId: bestStrategy,
    postureId,
    drivers,
  };
}

function pickBestStrategy(scores: Record<StrategyId, number>): StrategyId {
  let bestScore = -Infinity;
  const best: StrategyId[] = [];

  for (const id of Object.keys(scores) as StrategyId[]) {
    const score = scores[id];
    if (score > bestScore) {
      bestScore = score;
      best.length = 0;
      best.push(id);
    } else if (score === bestScore) {
      best.push(id);
    }
  }

  if (best.length === 1) return best[0];

  // Tie-break using a stable preference order
  for (const id of STRATEGY_TIE_BREAK) {
    if (best.includes(id)) return id;
  }

  // Fallback (should never happen)
  return 'S3';
}

// Scoring functions for each strategy

function scoreS1(interruptionTolerance: number, surpriseSensitivity: number): number {
  // S1: Monthly summary only - low interruption, low surprise sensitivity
  let score = 0;
  if (interruptionTolerance <= LOW_THRESHOLD) score += 3;
  if (surpriseSensitivity <= LOW_THRESHOLD) score += 2;
  if (interruptionTolerance === 0) score += 1; // Very low = stronger signal
  return score;
}

function scoreS2(interruptionTolerance: number): number {
  // S2: Weekly summaries - moderate interruption tolerance
  let score = 0;
  if (interruptionTolerance === 2) score += 3;
  if (interruptionTolerance === 3) score += 2;
  if (interruptionTolerance === 1) score += 1; // Some users near low still like weekly
  return score;
}

function scoreS3(interruptionTolerance: number, surpriseSensitivity: number, deviceImpact: number): number {
  // S3: Trend-change escalation - low interruptions + cares about meaningful shifts
  let score = 0;
  if (interruptionTolerance <= LOW_THRESHOLD) score += 2;
  if (surpriseSensitivity >= 2) score += 1;
  if (deviceImpact >= 2) score += 1;
  if (interruptionTolerance === 0 && (surpriseSensitivity >= 2 || deviceImpact >= 2)) score += 1;
  return score;
}

function scoreS4(surpriseSensitivity: number, deviceImpact: number): number {
  // S4: Overage forecasting - high surprise sensitivity (cost-oriented)
  let score = 0;
  if (surpriseSensitivity >= HIGH_THRESHOLD) score += 4;
  if (surpriseSensitivity === 4) score += 1; // Very high = stronger signal
  if (deviceImpact <= 2) score += 1; // Not primarily device-focused
  return score;
}

function scoreS5(deviceImpact: number, surpriseSensitivity: number): number {
  // S5: Per-device imbalance monitoring - high device impact sensitivity
  let score = 0;
  if (deviceImpact >= HIGH_THRESHOLD) score += 4;
  if (deviceImpact === 4) score += 1; // Very high = stronger signal
  if (surpriseSensitivity >= 2) score += 1; // Often overlaps with “no surprises”
  return score;
}

function scoreS6(interruptionTolerance: number, automationTrust: number): number {
  // S6: Quiet mode - very low interruption tolerance
  let score = 0;
  if (interruptionTolerance === 0) score += 4;
  if (interruptionTolerance === 1) score += 2;
  if (automationTrust <= LOW_THRESHOLD) score += 1; // Prefers to decide
  return score;
}

function scoreS7(interruptionTolerance: number, automationTrust: number): number {
  // S7: High-touch mode - high interruption tolerance
  let score = 0;
  if (interruptionTolerance >= HIGH_THRESHOLD) score += 4;
  if (interruptionTolerance === 4) score += 1; // Very high = stronger signal
  if (automationTrust >= 2) score += 1; // Trusts “handle it for me” more
  return score;
}

/**
 * Computes posture from slider values.
 * Postures are broader categories than strategies.
 */
function computePosture(values: SliderValues): PostureId {
  const { interruptionTolerance, surpriseSensitivity, deviceImpact } = values;

  // High-touch: very high interruption tolerance
  if (interruptionTolerance >= HIGH_THRESHOLD) {
    return 'high-touch';
  }

  // Early warnings: high surprise sensitivity or high device impact
  if (surpriseSensitivity >= HIGH_THRESHOLD || deviceImpact >= HIGH_THRESHOLD) {
    return 'early-warnings';
  }

  // Regular check-ins: moderate interruption tolerance
  if (interruptionTolerance >= 2 && interruptionTolerance <= 3) {
    return 'regular';
  }

  // Quiet by default: low interruption tolerance
  return 'quiet';
}

/**
 * Identifies the top 2 drivers from slider values.
 * Returns short phrases in the same language as the slider endpoints.
 */
function identifyDrivers(values: SliderValues): [string, string] {
  const { interruptionTolerance, surpriseSensitivity, automationTrust, deviceImpact } = values;

  const driverScores: Array<{ phrase: string; score: number }> = [];

  // Interruption tolerance drivers (match slider endpoints)
  if (interruptionTolerance <= LOW_THRESHOLD) {
    driverScores.push({ phrase: "Don’t bother me", score: 4 - interruptionTolerance });
  } else if (interruptionTolerance >= HIGH_THRESHOLD) {
    driverScores.push({ phrase: 'Keep me informed', score: interruptionTolerance });
  } else {
    // mid-range can still be a driver, but weaker
    driverScores.push({ phrase: 'A balanced pace', score: 2 });
  }

  // Surprise sensitivity drivers
  if (surpriseSensitivity >= HIGH_THRESHOLD) {
    driverScores.push({ phrase: 'No surprises, ever', score: surpriseSensitivity });
  } else if (surpriseSensitivity <= LOW_THRESHOLD) {
    driverScores.push({ phrase: 'Surprises are fine', score: 2 - surpriseSensitivity });
  }

  // Device impact drivers
  if (deviceImpact >= HIGH_THRESHOLD) {
    driverScores.push({ phrase: 'Flag imbalances early', score: deviceImpact });
  } else if (deviceImpact <= LOW_THRESHOLD) {
    driverScores.push({ phrase: 'Let it average out', score: 2 - deviceImpact });
  }

  // Automation trust drivers
  if (automationTrust >= HIGH_THRESHOLD) {
    driverScores.push({ phrase: 'Handle it for me', score: automationTrust - 1 });
  } else if (automationTrust <= LOW_THRESHOLD) {
    driverScores.push({ phrase: 'I want to decide', score: 2 - automationTrust });
  }

  // Sort by score and take top 2
  driverScores.sort((a, b) => b.score - a.score);

  // Deduplicate phrases (just in case)
  const unique = Array.from(new Set(driverScores.map(d => d.phrase)));

  if (unique.length >= 2) {
    return [unique[0], unique[1]];
  }
  if (unique.length === 1) {
    return [unique[0], 'Standard monitoring'];
  }
  return ['Standard monitoring', 'Balanced preferences'];
}
