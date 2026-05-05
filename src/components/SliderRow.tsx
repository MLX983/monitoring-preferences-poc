// src/components/SliderRow.tsx

import * as React from "react";
import Slider from "./Slider";

type Props = {
  question: string;
  helperParagraphs: string[];
  infoParagraphs: string[];
  value: number; // 0..100
  onChange: (next: number) => void;
  leftLabel: string;
  rightLabel: string;
  onAdjustmentSessionStart?: () => void;
  onAdjustmentSessionEnd?: () => void;
};

export default function SliderRow({
  question,
  helperParagraphs: _helperParagraphs,
  infoParagraphs,
  value,
  onChange,
  leftLabel,
  rightLabel,
  onAdjustmentSessionStart,
  onAdjustmentSessionEnd,
}: Props) {
  const [open, setOpen] = React.useState(false);
  const panelId = React.useId();

  return (
    <div className="section">
      <div className="section-header">
        <div className="section-title">
          {question}
        </div>

        <button
          type="button"
          className="section-info-icon"
          aria-expanded={open}
          aria-controls={panelId}
          aria-label={`More info about ${question}`}
          onClick={() => setOpen((v) => !v)}
        >
          i
        </button>
      </div>

      <div
        className={`info-panel-disclosure${open ? " info-panel-disclosure--open" : ""}`}
        aria-hidden={!open}
      >
        <div id={panelId} className="info-panel">
          {infoParagraphs.map((paragraph, index) => (
            <div key={index} className="info-panel-body">
              {paragraph}
            </div>
          ))}
        </div>
      </div>

      <Slider
        value={value}
        onChange={onChange}
        className="slider"
        onAdjustmentSessionStart={onAdjustmentSessionStart}
        onAdjustmentSessionEnd={onAdjustmentSessionEnd}
      />

      <div className="range-labels">
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
    </div>
  );
}
