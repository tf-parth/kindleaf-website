import React, { useState, useEffect, useRef } from 'react';

function BrewingGuide() {
  const [isBrewing, setIsBrewing] = useState(false);
  const [timerText, setTimerText] = useState('03:00');
  const [liquidOpacity, setLiquidOpacity] = useState(0.2);
  const [liquidColor, setLiquidColor] = useState('#808080');
  const [liquidHeight, setLiquidHeight] = useState('90');
  const [isSteaming, setIsSteaming] = useState(false);
  const [brewStep, setBrewStep] = useState(1);
  const brewIntervalRef = useRef(null);

  const startBrew = () => {
    if (isBrewing) {
      resetBrew();
      return;
    }

    setIsBrewing(true);
    setIsSteaming(true);

    let totalSeconds = 180;
    const animationSteps = 12;
    let currentStep = 0;

    setLiquidColor('#c5a880');
    setLiquidOpacity(0.15);
    setLiquidHeight('80');
    setBrewStep(1);

    brewIntervalRef.current = setInterval(() => {
      currentStep++;
      totalSeconds -= (180 / animationSteps);

      const min = Math.floor(totalSeconds / 60);
      const sec = Math.floor(totalSeconds % 60);
      setTimerText(`${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`);

      const completionRatio = currentStep / animationSteps;
      setLiquidOpacity(0.15 + (0.75 * completionRatio));

      if (completionRatio >= 0.25 && completionRatio < 0.5) {
        setBrewStep(2);
      } else if (completionRatio >= 0.5 && completionRatio < 0.75) {
        setBrewStep(3);
      } else if (completionRatio >= 0.75) {
        setBrewStep(4);
      }

      if (currentStep >= animationSteps) {
        clearInterval(brewIntervalRef.current);
        setTimerText('00:00');
        setIsSteaming(false);
      }
    }, 1000);
  };

  const resetBrew = () => {
    setIsBrewing(false);
    setIsSteaming(false);
    clearInterval(brewIntervalRef.current);
    setTimerText('03:00');
    setLiquidColor('#808080');
    setLiquidOpacity(0.2);
    setLiquidHeight('90');
    setBrewStep(1);
  };

  useEffect(() => {
    return () => clearInterval(brewIntervalRef.current);
  }, []);

  return (
    <section id="brewing" className="brewing-section scroll-reveal">
      <div className="section-container">
        <div className="section-header center-align">
          <span className="section-tag">The Art of Tea</span>
          <h2 className="section-title">How to Brew the Perfect Cup</h2>
          <p className="section-subtitle">
            A mindful brew unlocks the full botanical synergy of Green Tea, Tulsi, Lemongrass, and Ginger.
          </p>
        </div>

        <div className="brewing-steps-container">
          <div className="brewing-visual-panel">
            <div className="brewing-interactive-mug">
              <div className={`steam-container ${isSteaming ? 'steaming' : ''}`}>
                <span className="steam-line line-1"></span>
                <span className="steam-line line-2"></span>
                <span className="steam-line line-3"></span>
              </div>
              <svg viewBox="0 0 100 120" className="mug-svg">
                <path d="M 68,45 C 85,45 85,85 68,85" stroke="#c5a880" strokeWidth="8" fill="none" strokeLinecap="round"/>
                <path d="M 20,30 L 20,95 C 20,105 32,112 50,112 C 68,112 80,105 80,95 L 80,30 Z" fill="#1b4332"/>
                <path id="tea-liquid" d={`M 23,${liquidHeight} C 35,${liquidHeight} 45,${liquidHeight} 77,${liquidHeight} L 77,95 C 77,101 68,107 50,107 C 32,107 23,101 23,95 Z`} fill={liquidColor} opacity={liquidOpacity}/>
                <ellipse cx="50" cy="30" rx="30" ry="8" fill="#1b4332" stroke="#c5a880" strokeWidth="2"/>
                <ellipse id="tea-surface" cx="50" cy={liquidHeight} rx="27" ry="6" fill={liquidColor === '#808080' ? '#666666' : '#b8986c'} opacity={liquidOpacity}/>
              </svg>
            </div>
            <div className="timer-widget">
              <div className="timer-display">{timerText}</div>
              <button 
                type="button" 
                className={`btn btn-small ${isBrewing ? 'btn-secondary' : 'btn-primary'}`} 
                onClick={startBrew}
              >
                {isBrewing ? 'Reset Brew' : 'Simulate Brew'}
              </button>
            </div>
          </div>

          <div className="brewing-texts">
            <div className={`brewing-step-item ${brewStep === 1 ? 'active' : ''}`}>
              <div className="step-num">01</div>
              <div>
                <h4>Heat the Water</h4>
                <p>Bring fresh water to a gentle bubble (approx. 85°C). Avoid boiling water completely, as burning green tea leaves creates a bitter flavor profile.</p>
              </div>
            </div>
            <div className={`brewing-step-item ${brewStep === 2 ? 'active' : ''}`}>
              <div className="step-num">02</div>
              <div>
                <h4>Measure the Blend</h4>
                <p>Add 1 teaspoon (about 2g) of Kindleaf Handcrafted Herbal Green Tea into your cup or infuser basket.</p>
              </div>
            </div>
            <div className={`brewing-step-item ${brewStep === 3 ? 'active' : ''}`}>
              <div className="step-num">03</div>
              <div>
                <h4>Infuse and Breathe</h4>
                <p>Pour hot water and cover. Steep for exactly 3 to 5 minutes depending on desired strength. Watch the water take on a golden hue.</p>
              </div>
            </div>
            <div className={`brewing-step-item ${brewStep === 4 ? 'active' : ''}`}>
              <div className="step-num">04</div>
              <div>
                <h4>Sip Mindfully</h4>
                <p>Inhale the warm herbal aroma of lemongrass and ginger. Take your first sip. Reconnect with yourself.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BrewingGuide;
