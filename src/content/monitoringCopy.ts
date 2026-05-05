import type { Posture } from "../logic/computeRecommendation";

/**
 * Maps computeRecommendation reasons to Figma-approved strings.
 * Analyzes the posture reasons to determine the appropriate Figma copy.
 * 
 * Mapping logic:
 * - Interruption preference: based on urgency level (high urgency = higher preference)
 * - Sensitivity to surprises: based on noise tolerance (low tolerance = high sensitivity)
 */
export function mapPostureReasonsToFigma(posture: Posture): [string, string] {
  const [reason1, reason2] = posture.reasons;
  const reason1Lower = reason1.toLowerCase();
  
  // Map first reason: interruption preference
  // Analyze for urgency indicators
  let mappedReason1: string;
  if (reason1Lower.includes("high urgency") || reason1Lower.includes("urgent")) {
    mappedReason1 = "Higher interruption preference";
  } else if (reason1Lower.includes("lower urgency")) {
    mappedReason1 = "Low interruption preference";
  } else {
    // Fallback: use posture ID
    if (posture.id === "fast_filtered" || posture.id === "fast_noisy") {
      mappedReason1 = "Higher interruption preference";
    } else {
      mappedReason1 = "Low interruption preference";
    }
  }
  
  // Map second reason: sensitivity to surprise charges
  // Analyze for tolerance/noise indicators
  let mappedReason2: string;
  const allReasonsText = `${reason1} ${reason2}`.toLowerCase();
  
  if (allReasonsText.includes("low noise tolerance") || 
      allReasonsText.includes("low tolerance") ||
      reason1Lower.includes("low noise tolerance")) {
    mappedReason2 = "High sensitivity to surprise charges";
  } else if (allReasonsText.includes("higher noise tolerance") ||
             allReasonsText.includes("higher tolerance") ||
             reason1Lower.includes("higher noise tolerance")) {
    mappedReason2 = "Lower sensitivity to surprise charges";
  } else {
    // Fallback: use posture ID
    if (posture.id === "fast_filtered") {
      mappedReason2 = "High sensitivity to surprise charges";
    } else if (posture.id === "fast_noisy") {
      mappedReason2 = "Lower sensitivity to surprise charges";
    } else {
      // For digest_review and manual_check, default to high sensitivity
      mappedReason2 = "High sensitivity to surprise charges";
    }
  }
  
  return [mappedReason1, mappedReason2];
}

/**
 * Gets the Figma-aligned title for the results card.
 */
export function getFigmaTitle(): string {
  return "We'll stay quiet during normal variability and escalate when patterns shift.";
}
