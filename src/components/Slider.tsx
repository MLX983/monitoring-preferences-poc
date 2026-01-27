export interface SliderProps {
    title: string;
    leftLabel: string;
    rightLabel: string;
    value: number; // 0-4
    onChange: (value: number) => void;
    supportText: string;
  
    // Controlled accordion state (managed by parent so multiple can be open)
    isInfoOpen: boolean;
    onToggleInfo: () => void;
  }
  
  export function Slider({
    title,
    leftLabel,
    rightLabel,
    value,
    onChange,
    supportText,
    isInfoOpen,
    onToggleInfo,
  }: SliderProps) {
    return (
      <div className="slider-container">
        <div className="slider-header">
          <h3 className="slider-title">{title}</h3>
  
          <button
            type="button"
            className="info-button"
            onClick={onToggleInfo}
            aria-label="Toggle info"
            aria-expanded={isInfoOpen}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" fill="none" />
              <path d="M8 6V8M8 10H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>
  
        {isInfoOpen && (
          <div className="slider-info-accordion">
            <p className="slider-support-text">{supportText}</p>
          </div>
        )}
  
        <div className="slider-labels">
          <span className="slider-label-left">{leftLabel}</span>
          <span className="slider-label-right">{rightLabel}</span>
        </div>
  
        <div className="slider-track" role="group" aria-label={title}>
          {[0, 1, 2, 3, 4].map((step) => (
            <button
              key={step}
              type="button"
              className={`slider-step ${value === step ? 'active' : ''}`}
              onClick={() => onChange(step)}
              aria-label={`Set to step ${step + 1}`}
              aria-pressed={value === step}
            />
          ))}
        </div>
      </div>
    );
  }
  