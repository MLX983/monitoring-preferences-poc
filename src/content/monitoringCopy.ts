import type { PostureId as ComputePostureId } from "../logic/computeRecommendation";
import type { PostureId as ModalPostureId } from "../logic/postures";
import type { StrategyId } from "../logic/strategies";

/**
 * Display copy mapping from compute result IDs to strategy content (S1–S7).
 * Logic IDs are unchanged; only user-facing strings come from strategies.ts.
 */
export const STRATEGY_BY_COMPUTE_POSTURE: Record<ComputePostureId, StrategyId> = {
  manual_check: "S3",
  digest_review: "S2",
  fast_filtered: "S4",
  fast_noisy: "S7",
};

/**
 * Save confirmation modal grouping (unchanged):
 * - quiet: S1, S3, S6
 * - regular: S2
 * - early-warnings: S4, S5
 * - high-touch: S7
 */
export const MODAL_POSTURE_BY_COMPUTE_POSTURE: Record<ComputePostureId, ModalPostureId> = {
  manual_check: "quiet",
  digest_review: "regular",
  fast_filtered: "early-warnings",
  fast_noisy: "high-touch",
};
