import React, { useState } from 'react';

const intentionsByTime = {
  morning: [
    { id: 'm-digest', label: 'Metabolism Kickstart', sub: 'Ignite gastric fire after breakfast', icon: '🔥' },
    { id: 'm-focus', label: 'Mental Focus', sub: 'Calm energy for work hours', icon: '🧠' },
    { id: 'm-imm', label: 'Daily Immunity Shield', sub: 'Tulsi adaptogenic boost', icon: '🛡️' }
  ],
  afternoon: [
    { id: 'a-bloat', label: 'Bloating Relief', sub: 'Soothe fullness after lunch', icon: '🎈' },
    { id: 'a-stress', label: 'Mid-day Stress Buster', sub: 'Protect your peace, pause work', icon: '💆' },
    { id: 'a-hydrate', label: 'Clean Rejuvenation', sub: 'Freshen up your energy', icon: '✨' }
  ],
  evening: [
    { id: 'e-relax', label: 'Sleep Preparation', sub: 'Decompress before bed', icon: '🌙' },
    { id: 'e-digest', label: 'Heavy Dinner Digestion', sub: 'Spiced ginger digestive aid', icon: '🫚' },
    { id: 'e-detox', label: 'Gentle Overnight Cleanse', sub: 'Detoxify and rest', icon: '💧' }
  ]
};

const ritualResults = {
  'morning_m-digest': {
    title: 'The Sun-Fire Awakening',
    desc: 'Sip 20 minutes after your breakfast. Focus on the warm notes of dry ginger triggering your digestion. Pair this ritual with sunlight exposure.',
    brewTime: '3 Minutes',
    pair: '5 minutes of direct morning sunlight',
    goal: 'Ignite Kapha dosha, eliminate breakfast bloating'
  },
  'morning_m-focus': {
    title: 'The Clarity Ritual',
    desc: 'Prepare the cup just before starting your work. Inhale the clean steam of Lemongrass. Leave your phone in another room for the first 15 minutes of work.',
    brewTime: '3 Minutes',
    pair: 'Deep, single-task work blocks',
    goal: 'Calm the central nervous system via adaptogenic Tulsi'
  },
  'morning_m-imm': {
    title: 'The Ayurvedic Shield',
    desc: 'A daily morning tonic. Focus on the taste of Holy Basil. Let the antioxidants set a protective layer for your day.',
    brewTime: '4 Minutes',
    pair: 'Light morning stretching/yoga',
    goal: 'Fortify white blood cell activity, adapt to atmospheric changes'
  },
  'afternoon_a-bloat': {
    title: 'The Midday Lightness',
    desc: 'Sip 30 minutes after your lunch. The Lemongrass and Ginger active compounds relax tight gastric muscles, releasing trapped wind and reducing inflation.',
    brewTime: '4 Minutes',
    pair: '100 steps of gentle walking post-meal',
    goal: 'Speed up gastric clearance, reduce post-lunch lethargy'
  },
  'afternoon_a-stress': {
    title: 'The Digital Detox Break',
    desc: 'Step away from all screens. Feel the warm weight of the mug. Take deep nasal breaths. This is a guilt-free pause in your productive day.',
    brewTime: '3 Minutes',
    pair: 'Silence and complete offline presence',
    goal: 'Lower cortisol spikes, restore cognitive clarity'
  },
  'afternoon_a-hydrate': {
    title: 'The Refreshing Infusion',
    desc: 'A light, refreshing cup to clear away brain fog. Let the bright citrus notes of Lemongrass awaken your cognitive senses.',
    brewTime: '3 Minutes',
    pair: 'A large glass of water beforehand',
    goal: 'Cellular hydration, gentle internal cleaning'
  },
  'evening_e-relax': {
    title: 'The Sunset Stillness',
    desc: 'A mindful cup brewed 1 hour before sleep. Let the calming adaptogens in Tulsi ease your mind out of work mode. Read a physical book while sipping.',
    brewTime: '5 Minutes',
    pair: 'Dim lights and a physical fiction book',
    goal: 'Settle down overactive synapses, prepare melatonin cycles'
  },
  'evening_e-digest': {
    title: 'The Overnight Balance',
    desc: 'Brewed right after dinner. The warm ginger comforts the stomach lining, while Lemongrass works on processing proteins and fats.',
    brewTime: '5 Minutes',
    pair: 'No heavy screen scrolling',
    goal: 'Prevent overnight acid reflux, support gut repair cycles'
  },
  'evening_e-detox': {
    title: 'The Soothing Restorative',
    desc: 'A long, slow brew. Breathe in the warm herbal aroma. Let your body enter deep parasympathetic rest.',
    brewTime: '4 Minutes',
    pair: 'Gratitude journaling (write down 3 things)',
    goal: 'Flush out free radicals, lower systemic inflammation'
  }
};

function RitualPlanner() {
  const [plannerStep, setPlannerStep] = useState(1);
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedIntention, setSelectedIntention] = useState('');

  const plannerKey = `${selectedTime}_${selectedIntention}`;
  const ritualResult = ritualResults[plannerKey] || null;

  return (
    <section id="planner" className="planner-section scroll-reveal">
      <div className="section-container">
        <div className="section-header center-align">
          <span className="section-tag">Interactive Planner</span>
          <h2 className="section-title">Design Your Daily Tea Ritual</h2>
          <p className="section-subtitle">
            How you sip matters. Answer two simple questions to receive a personalized, Ayurvedic-inspired daily ritual for your mind and body.
          </p>
        </div>

        <div className="planner-box">
          <div className="planner-progress">
            <span className={`progress-step ${plannerStep >= 1 ? 'active' : ''} ${plannerStep > 1 ? 'completed' : ''}`}>1. Time of Day</span>
            <span className="progress-divider"></span>
            <span className={`progress-step ${plannerStep >= 2 ? 'active' : ''} ${plannerStep > 2 ? 'completed' : ''}`}>2. Intention</span>
            <span className="progress-divider"></span>
            <span className={`progress-step ${plannerStep >= 3 ? 'active' : ''}`}>3. Your Ritual</span>
          </div>

          {/* Step 1 */}
          {plannerStep === 1 && (
            <div className="planner-card active">
              <h3>When do you want to introduce your ritual?</h3>
              <div className="planner-options-grid">
                <button type="button" className="planner-option-btn" onClick={() => { setSelectedTime('morning'); setPlannerStep(2); }}>
                  <span className="opt-icon">🌅</span>
                  <span className="opt-title">Morning Hour</span>
                  <span className="opt-sub">Post-Breakfast / Early Start</span>
                </button>
                <button type="button" className="planner-option-btn" onClick={() => { setSelectedTime('afternoon'); setPlannerStep(2); }}>
                  <span className="opt-icon">☀️</span>
                  <span className="opt-title">Afternoon Pause</span>
                  <span className="opt-sub">Post-Lunch Pick-Me-Up</span>
                </button>
                <button type="button" className="planner-option-btn" onClick={() => { setSelectedTime('evening'); setPlannerStep(2); }}>
                  <span className="opt-icon">🌙</span>
                  <span className="opt-title">Evening Wind-down</span>
                  <span className="opt-sub">After-Dinner Digestion</span>
                </button>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {plannerStep === 2 && (
            <div className="planner-card active">
              <h3>What is your body &amp; mind seeking most?</h3>
              <div className="planner-options-grid">
                {intentionsByTime[selectedTime]?.map(item => (
                  <button key={item.id} type="button" className="planner-option-btn" onClick={() => { setSelectedIntention(item.id); setPlannerStep(3); }}>
                    <span className="opt-icon">{item.icon}</span>
                    <span className="opt-title">{item.label}</span>
                    <span className="opt-sub">{item.sub}</span>
                  </button>
                ))}
              </div>
              <button type="button" className="btn btn-secondary back-btn" onClick={() => setPlannerStep(1)}>← Back to Time</button>
            </div>
          )}

          {/* Step 3 */}
          {plannerStep === 3 && ritualResult && (
            <div className="planner-card result-card active">
              <div className="result-badge">Recommended Ritual</div>
              <h3>{ritualResult.title}</h3>
              <p className="result-desc">{ritualResult.desc}</p>
              
              <div className="ritual-tips">
                <div className="tip-item">
                  <strong>Brewing Time:</strong> <span>{ritualResult.brewTime}</span>
                </div>
                <div className="tip-item">
                  <strong>Best Paired With:</strong> <span>{ritualResult.pair}</span>
                </div>
                <div className="tip-item">
                  <strong>Ayurvedic Goal:</strong> <span>{ritualResult.goal}</span>
                </div>
              </div>

              <div className="planner-result-actions">
                <button type="button" className="btn btn-primary" onClick={() => setPlannerStep(1)}>Restart Planner</button>
                <a href="#shop" className="btn btn-secondary">Get the Blend</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default RitualPlanner;
