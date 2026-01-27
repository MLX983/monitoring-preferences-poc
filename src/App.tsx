import { useMemo, useState } from 'react';
import { Slider } from './components/Slider';
import { ResultsCard } from './components/ResultsCard';
import { ConfirmationModal } from './components/ConfirmationModal';
import { computeRecommendation, type SliderValues } from './logic/computeRecommendation';
import { strategies } from './logic/strategies';
import { postures } from './logic/postures';
import './App.css';

type AccordionKey = keyof SliderValues;

function App() {
  const [sliderValues, setSliderValues] = useState<SliderValues>({
    interruptionTolerance: 2,
    surpriseSensitivity: 2,
    automationTrust: 2,
    deviceImpact: 2,
  });

  const [openAccordions, setOpenAccordions] = useState<Record<AccordionKey, boolean>>({
    interruptionTolerance: false,
    surpriseSensitivity: false,
    automationTrust: false,
    deviceImpact: false,
  });

  const [isModalOpen, setIsModalOpen] = useState(false);

  const recommendation = useMemo(() => computeRecommendation(sliderValues), [sliderValues]);
  const strategy = strategies[recommendation.strategyId];
  const posture = postures[recommendation.postureId];

  const handleSliderChange = (key: AccordionKey, value: number) => {
    setSliderValues((prev) => ({ ...prev, [key]: value }));
  };

  const toggleAccordion = (key: AccordionKey) => {
    setOpenAccordions((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">We&apos;ll keep an eye on things</h1>
        <p className="app-subhead">
          Tell us what matters and we&apos;ll keep you informed without unnecessary interruptions.
        </p>
      </header>

      <main className="app-main">
        <div className="sliders-section">
          <Slider
            title="How often should we notify you?"
            leftLabel="Don't bother me"
            rightLabel="Keep me informed"
            value={sliderValues.interruptionTolerance}
            onChange={(value) => handleSliderChange('interruptionTolerance', value)}
            supportText={
              "Some people want updates only when something really changes. Others want regular check-ins. This helps us decide how often to speak up."
            }
            isInfoOpen={openAccordions.interruptionTolerance}
            onToggleInfo={() => toggleAccordion('interruptionTolerance')}
          />

          <Slider
            title="How much do surprise charges bother you?"
            leftLabel="Surprises are fine"
            rightLabel="No surprises, ever"
            value={sliderValues.surpriseSensitivity}
            onChange={(value) => handleSliderChange('surpriseSensitivity', value)}
            supportText={
              "If your bill might be higher than usual, should we warn you ahead of time? This helps us decide when to step in early."
            }
            isInfoOpen={openAccordions.surpriseSensitivity}
            onToggleInfo={() => toggleAccordion('surpriseSensitivity')}
          />

          <Slider
            title="How much should we handle for you?"
            leftLabel="I want to decide"
            rightLabel="Handle it for me"
            value={sliderValues.automationTrust}
            onChange={(value) => handleSliderChange('automationTrust', value)}
            supportText={
              "Some people want to review things before acting. Others are happy to let the system take care of it. This helps us choose between suggestions and automatic actions."
            }
            isInfoOpen={openAccordions.automationTrust}
            onToggleInfo={() => toggleAccordion('automationTrust')}
          />

          <Slider
            title="Should we watch individual devices?"
            leftLabel="Let it average out"
            rightLabel="Flag imbalances early"
            value={sliderValues.deviceImpact}
            onChange={(value) => handleSliderChange('deviceImpact', value)}
            supportText={
              "Sometimes one device uses much more than the others. This helps us decide whether to look at totals only, or call out device-level issues."
            }
            isInfoOpen={openAccordions.deviceImpact}
            onToggleInfo={() => toggleAccordion('deviceImpact')}
          />
        </div>

        <ResultsCard strategy={strategy} drivers={recommendation.drivers} />

        <button type="button" className="save-button" onClick={handleSave}>
          Save
        </button>
      </main>

      <ConfirmationModal posture={posture} isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default App;
