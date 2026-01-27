import { useEffect, useState } from 'react';
import type { Strategy } from '../logic/strategies';

export interface ResultsCardProps {
  strategy: Strategy;
  drivers: [string, string];
}

export function ResultsCard({ strategy, drivers }: ResultsCardProps) {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsAnimating(true);
    const timer = setTimeout(() => setIsAnimating(false), 450);
    return () => clearTimeout(timer);
    // Trigger only when the displayed content actually changes
  }, [strategy.id, drivers[0], drivers[1]]);

  return (
    <div className={`results-card ${isAnimating ? 'animate' : ''}`}>
      <p className="results-primary-line">{strategy.primaryLine}</p>

      <div className="results-based-on">
        <span className="results-label">Based on your choices</span>
      </div>

      <div className="results-reasons" aria-label="Reasons">
        <span className="results-chip">{drivers[0]}</span>
        <span className="results-chip">{drivers[1]}</span>
      </div>
    </div>
  );
}
