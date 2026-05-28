// src/pages/MonitoringPreferences.tsx

import * as React from "react";
import SliderRow from "../components/SliderRow";
import ResultsCard from "../components/ResultsCard";
import { ConfirmationModal } from "../components/ConfirmationModal";
import {
  computeRecommendation,
  type SliderValues,
  type SliderKey,
  type PostureId,
} from "../logic/computeRecommendation";
import { MODAL_POSTURE_BY_COMPUTE_POSTURE } from "../content/monitoringCopy";

type SliderCopy = {
  key: SliderKey;
  question: string;
  // The helper text shown in the section (and/or inside the info accordion, depending on SliderRow behavior)
  helperParagraphs: string[];
  // What shows inside the info accordion when the icon is toggled
  // (can be same as helperParagraphs if that’s how your Figma behaves)
  infoParagraphs: string[];
  leftLabel: string;
  rightLabel: string;
};

const SLIDERS: SliderCopy[] = [
  {
    key: "signal",
    question: "How often should we notify you?",
    helperParagraphs: [
      "Some people only want alerts when something important changes. Others want regular updates.",
      "This helps us choose how often to check in.",
    ],
    infoParagraphs: [
      "Some people only want alerts when something important changes. Others want regular updates.",
      "This helps us choose how often to check in.",
    ],
    leftLabel: "Fewer alerts",
    rightLabel: "More updates",
  },
  {
    key: "tolerance",
    question: "How much do surprise charges bother you?",
    helperParagraphs: [
      "Tell us how early you want to know if your bill may be higher than usual.",
      "This helps us decide when to warn you.",
    ],
    infoParagraphs: [
      "Tell us how early you want to know if your bill may be higher than usual.",
      "This helps us decide when to warn you.",
    ],
    leftLabel: "Small changes are okay",
    rightLabel: "Warn me early",
  },
  {
    key: "control",
    question: "How much should we handle for you?",
    helperParagraphs: [
      "Some people want to review things first. Others want us to handle more automatically.",
      "This helps us decide when to ask and when to act.",
    ],
    infoParagraphs: [
      "Some people want to review things first. Others want us to handle more automatically.",
      "This helps us decide when to ask and when to act.",
    ],
    leftLabel: "Ask me first",
    rightLabel: "Handle more for me",
  },
  {
    key: "surface",
    question: "Should we watch individual devices?",
    helperParagraphs: [
      "One device can use much more than the others.",
      "This helps us decide whether to watch the total only or each device too.",
    ],
    infoParagraphs: [
      "One device can use much more than the others.",
      "This helps us decide whether to watch the total only or each device too.",
    ],
    leftLabel: "Watch the overall total",
    rightLabel: "Watch each device",
  },
];

const DEFAULTS: SliderValues = {
  signal: 60,
  tolerance: 40,
  control: 55,
  surface: 50,
};

function sliderValuesEqual(a: SliderValues, b: SliderValues): boolean {
  return (
    a.signal === b.signal &&
    a.tolerance === b.tolerance &&
    a.control === b.control &&
    a.surface === b.surface
  );
}

export default function MonitoringPreferences() {
  const [values, setValues] = React.useState<SliderValues>(DEFAULTS);
  const [stabilityPulse, setStabilityPulse] = React.useState(0);
  const [saveModalOpen, setSaveModalOpen] = React.useState(false);
  const valuesRef = React.useRef<SliderValues>(DEFAULTS);
  /** Last-pressed adjustment session overwrites; fine for one pointer. */
  const adjustmentStartPostureRef = React.useRef<PostureId | null>(null);
  const adjustmentStartValuesRef = React.useRef<SliderValues | null>(null);

  // Keep this memo — computeRecommendation should remain the single source of truth
  const posture = React.useMemo(() => computeRecommendation(values), [values]);

  const handleAdjustmentSessionStart = React.useCallback(() => {
    adjustmentStartPostureRef.current = computeRecommendation(valuesRef.current).id;
    adjustmentStartValuesRef.current = { ...valuesRef.current };
  }, []);

  const handleAdjustmentSessionEnd = React.useCallback(() => {
    const startPosture = adjustmentStartPostureRef.current;
    const startValues = adjustmentStartValuesRef.current;
    adjustmentStartPostureRef.current = null;
    adjustmentStartValuesRef.current = null;

    if (startPosture === null || startValues === null) return;

    const endValues = valuesRef.current;
    if (sliderValuesEqual(startValues, endValues)) return;

    const endPosture = computeRecommendation(endValues).id;
    if (startPosture !== endPosture) return;

    setStabilityPulse((n) => n + 1);
  }, []);

  function setValue(key: SliderKey, next: number) {
    const nextValues = { ...valuesRef.current, [key]: next };
    valuesRef.current = nextValues;
    setValues(nextValues);
  }

  return (
    <div className="page">
      <div className="page__inner">
        {/* Header */}
        <header className="stack-tight">
          <h1 className="h1">We'll keep an eye on things</h1>
          <p className="subhead">
            Choose what you want us to watch and when we should let you know.
          </p>
        </header>

        <main
          style={{
            marginTop: "var(--space-intro-to-first-block, 32px)",
            display: "grid",
            gap: 0,
          }}
        >
          <div className="stack">
            {SLIDERS.map((s) => (
              <SliderRow
                key={s.key}
                question={s.question}
                helperParagraphs={s.helperParagraphs}
                infoParagraphs={s.infoParagraphs}
                leftLabel={s.leftLabel}
                rightLabel={s.rightLabel}
                value={values[s.key]}
                onChange={(n: number) => setValue(s.key, n)}
                onAdjustmentSessionStart={handleAdjustmentSessionStart}
                onAdjustmentSessionEnd={handleAdjustmentSessionEnd}
              />
            ))}
          </div>

          <div
            style={{ marginTop: "var(--space-sliders-to-explanatory-section, 32px)" }}
          >
            <p className="results-card-helper">
              Small changes help fine-tune when we alert you.
            </p>
            <ResultsCard posture={posture} stabilityPulse={stabilityPulse} />
            <div
              className="page-cta"
              style={{ marginTop: "var(--spacing-between-sections, 32px)" }}
            >
              <button
                className="button-primary button-primary--save-embed"
                type="button"
                onClick={() => setSaveModalOpen(true)}
              >
                Save
              </button>
            </div>
          </div>
        </main>
      </div>

      <ConfirmationModal
        isOpen={saveModalOpen}
        onClose={() => setSaveModalOpen(false)}
        postureId={MODAL_POSTURE_BY_COMPUTE_POSTURE[posture.id]}
      />
    </div>
  );
}
