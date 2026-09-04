"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';

const TARGET_VOLUME = 0.18; // 18% ambient volume (within 15–20%)

export default function BrewingGuide() {
  // Brewing Simulator States
  const [isBrewing, setIsBrewing] = useState(false);
  const [timerText, setTimerText] = useState('03:00');
  const [liquidOpacity, setLiquidOpacity] = useState(0.2);
  const [liquidColor, setLiquidColor] = useState('#808080');
  const [liquidHeight, setLiquidHeight] = useState('90');
  const [isSteaming, setIsSteaming] = useState(false);
  const [activeStep, setActiveStep] = useState(1);

  // Audio States & Refs
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const sectionRef = useRef<HTMLElement | null>(null);
  const brewIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const fadeIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Smooth fade-out and stop helper
  const stopAudioWithFade = useCallback(() => {
    if (!audioRef.current || audioRef.current.paused) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    let vol = audioRef.current.volume;
    fadeIntervalRef.current = setInterval(() => {
      if (!audioRef.current) {
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
        return;
      }
      vol -= 0.03;
      if (vol <= 0.01) {
        audioRef.current.volume = 0;
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
        if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      } else {
        audioRef.current.volume = vol;
      }
    }, 100);
  }, []);

  // Single audio instance & section observer setup
  useEffect(() => {
    // Create single persistent audio instance without autoplay
    const audio = new Audio('/audio/brewing-ambient.mpeg');
    audio.loop = true;
    audio.volume = TARGET_VOLUME;
    audio.preload = 'none';
    audioRef.current = audio;

    // IntersectionObserver: stop audio when user scrolls away from Brewing Guide
    const currentSection = sectionRef.current;
    let observer: IntersectionObserver | null = null;

    if (currentSection && typeof window !== 'undefined' && 'IntersectionObserver' in window) {
      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              stopAudioWithFade();
            }
          });
        },
        { threshold: 0.15 }
      );
      observer.observe(currentSection);
    }

    return () => {
      if (observer && currentSection) {
        observer.unobserve(currentSection);
      }
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
      if (brewIntervalRef.current) clearInterval(brewIntervalRef.current);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [stopAudioWithFade]);

  // Audio Play helper
  const playAudio = () => {
    if (!audioRef.current) return;
    if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);

    audioRef.current.volume = isMuted ? 0 : TARGET_VOLUME;
    audioRef.current
      .play()
      .catch((err) => {
        console.warn("Audio playback was prevented by browser policy:", err);
      });
  };

  // Toggle Mute / Unmute
  const toggleMute = () => {
    if (!audioRef.current) return;
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    audioRef.current.muted = nextMuted;
    audioRef.current.volume = nextMuted ? 0 : TARGET_VOLUME;
  };

  const startBrew = () => {
    if (isBrewing) {
      resetBrew();
      return;
    }

    setIsBrewing(true);
    setIsSteaming(true);

    // Start background music loop at 18% volume
    playAudio();

    let totalSeconds = 180;
    const animationSteps = 12;
    let currentStep = 0;

    setLiquidColor('#c5a880');
    setLiquidOpacity(0.2);
    setLiquidHeight('80');
    setActiveStep(1);

    brewIntervalRef.current = setInterval(() => {
      currentStep++;
      totalSeconds -= 180 / animationSteps;

      const min = Math.max(0, Math.floor(totalSeconds / 60));
      const sec = Math.max(0, Math.floor(totalSeconds % 60));
      setTimerText(`${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`);

      const completionRatio = currentStep / animationSteps;
      setLiquidOpacity(0.2 + 0.75 * completionRatio);

      if (completionRatio >= 0.25 && completionRatio < 0.5) {
        setActiveStep(2);
      } else if (completionRatio >= 0.5 && completionRatio < 0.75) {
        setActiveStep(3);
      } else if (completionRatio >= 0.75) {
        setActiveStep(4);
      }

      if (currentStep >= animationSteps) {
        if (brewIntervalRef.current) clearInterval(brewIntervalRef.current);
        setTimerText('00:00');
        setIsSteaming(false);
        // Fade out ambient music as brewing experience concludes
        stopAudioWithFade();
      }
    }, 1000);
  };

  const resetBrew = () => {
    setIsBrewing(false);
    setIsSteaming(false);
    if (brewIntervalRef.current) clearInterval(brewIntervalRef.current);
    setTimerText('03:00');
    setLiquidColor('#808080');
    setLiquidOpacity(0.2);
    setLiquidHeight('90');
    setActiveStep(1);
    // Stop audio with smooth fade out
    stopAudioWithFade();
  };

  const steps = [
    {
      num: "01",
      title: "Heat Water to ~85°C",
      summary: "Bring fresh water to a gentle bubble, not a violent rolling boil. Overly hot water scorches delicate green tea leaves, masking subtle citrus and floral notes."
    },
    {
      num: "02",
      title: "Measure 1 Teaspoon (~2g)",
      summary: "Place one level teaspoon of whole-cut Kindleaf herbal blend into your cup or infuser basket. Notice the fragrant aroma of dried tulsi and lemongrass."
    },
    {
      num: "03",
      title: "Steep Covered for 3–5 Minutes",
      summary: "Pour hot water over the botanicals and cover immediately with a lid or saucer to trap the beneficial aromatic essential oils as leaves expand."
    },
    {
      num: "04",
      title: "Inhale the Steam & Sip Mindfully",
      summary: "Strain the leaves. Inhale the warm, uplifting citrus and ginger steam. Take your first sip and enjoy a moment of mindful pause."
    }
  ];

  return (
    <section id="brewing" ref={sectionRef} className="py-24 bg-[#0c1912] relative">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-gold text-xs font-semibold uppercase tracking-widest block mb-3">
            The Art of Tea
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-[#F8F6F2] mb-4">
            How to Brew the Perfect Cup
          </h2>
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
            A mindful brew unlocks the full botanical synergy of Green Tea, Tulsi, Lemongrass, and Ginger. Follow four simple steps for clean, aromatic flavour.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Interactive Simulation Cup */}
          <div className="lg:col-span-5 flex flex-col items-center glass-panel rounded-3xl p-8 border border-white/10 shadow-2xl">
            <span className="text-gold text-[11px] font-bold uppercase tracking-widest mb-6 block">
              Interactive Brew Simulation
            </span>

            <div className="relative w-44 h-48 mb-6 flex items-center justify-center">
              {/* Animated Steam Lines */}
              <div className="absolute -top-7 left-12 flex gap-4 pointer-events-none">
                <span 
                  className={`w-1 h-8 bg-white/30 rounded-full steam-line ${isSteaming ? 'block' : 'hidden'}`} 
                  style={{ animationDelay: '0.1s' }} 
                />
                <span 
                  className={`w-1 h-12 bg-white/35 rounded-full steam-line ${isSteaming ? 'block' : 'hidden'}`} 
                  style={{ animationDelay: '0.5s' }} 
                />
                <span 
                  className={`w-1 h-8 bg-white/30 rounded-full steam-line ${isSteaming ? 'block' : 'hidden'}`} 
                  style={{ animationDelay: '0.3s' }} 
                />
              </div>

              {/* Ceramic Mug SVG */}
              <svg viewBox="0 0 100 120" className="w-full h-full drop-shadow-2xl">
                {/* Mug Handle */}
                <path 
                  d="M 68,45 C 86,45 86,85 68,85" 
                  stroke="#c5a880" 
                  strokeWidth="8" 
                  fill="none" 
                  strokeLinecap="round"
                />
                {/* Mug Body */}
                <path 
                  d="M 20,30 L 20,95 C 20,105 32,112 50,112 C 68,112 80,105 80,95 L 80,30 Z" 
                  fill="#1b4332"
                />
                {/* Liquid fill */}
                <path 
                  d={`M 23,${liquidHeight} C 35,${liquidHeight} 45,${liquidHeight} 77,${liquidHeight} L 77,95 C 77,101 68,107 50,107 C 32,107 23,101 23,95 Z`} 
                  fill={liquidColor} 
                  opacity={liquidOpacity} 
                  style={{ transition: 'all 1s ease' }}
                />
                {/* Rim */}
                <ellipse cx="50" cy="30" rx="30" ry="8" fill="#1b4332" stroke="#c5a880" strokeWidth="2" />
                {/* Liquid surface */}
                <ellipse 
                  cx="50" 
                  cy={liquidHeight} 
                  rx="27" 
                  ry="6" 
                  fill={liquidColor === '#808080' ? '#666666' : '#b8986c'} 
                  opacity={liquidOpacity} 
                  style={{ transition: 'all 1s ease' }}
                />
              </svg>
            </div>

            {/* Timer display & Controls */}
            <div className="text-center space-y-4 w-full">
              <div className="font-mono text-3xl text-gold font-bold tracking-wider">
                {timerText}
              </div>
              <p className="text-slate-400 text-xs">
                {isBrewing ? 'Steeping in progress: inhale the gentle herbal aroma...' : 'Tap below to begin a mindful 3-minute steep.'}
              </p>

              {/* Main Action Button */}
              <div className="flex flex-col items-center gap-3 justify-center">
                <button 
                  onClick={startBrew}
                  className={`px-7 py-3 rounded-full font-bold text-xs shadow-md transition-all cursor-pointer flex items-center gap-2 ${
                    isBrewing 
                      ? 'bg-[#163322] border border-white/10 text-gold hover:bg-[#1b4332]' 
                      : 'bg-gold text-[#0c1912] hover:bg-gold-hover'
                  }`}
                >
                  {isBrewing ? <RotateCcw size={14} /> : <Play size={14} />}
                  <span>{isBrewing ? 'Reset Brewing' : 'Begin Brewing'}</span>
                </button>

                {/* Subtle Ambient Sound & Mute Toggle */}
                {isBrewing && (
                  <button
                    type="button"
                    onClick={toggleMute}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium text-gold/80 hover:text-gold bg-white/5 hover:bg-white/10 border border-white/10 transition-colors cursor-pointer"
                    title={isMuted ? "Unmute background ambient music" : "Mute background ambient music"}
                  >
                    {isMuted ? <VolumeX size={13} /> : <Volume2 size={13} />}
                    <span>{isMuted ? "Sound Muted" : "Ambient Ritual Sound (18%)"}</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 4 Step Brewing Flow */}
          <div className="lg:col-span-7 space-y-6">
            {steps.map((step, idx) => {
              const isCurrent = activeStep === idx + 1;
              return (
                <div 
                  key={step.num}
                  className={`flex gap-5 border-l-2 pl-6 transition-all duration-300 ${
                    isCurrent 
                      ? 'border-gold opacity-100 translate-x-1' 
                      : 'border-white/10 opacity-60'
                  }`}
                >
                  <div className="text-2xl font-serif text-gold font-bold shrink-0">
                    {step.num}
                  </div>
                  <div>
                    <h4 className="text-base sm:text-lg font-serif font-bold text-[#F8F6F2] mb-1.5 flex items-center gap-2">
                      <span>{step.title}</span>
                      {isCurrent && (
                        <span className="text-[10px] bg-gold/20 text-gold px-2 py-0.5 rounded-full font-sans font-semibold">
                          Active Step
                        </span>
                      )}
                    </h4>
                    <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                      {step.summary}
                    </p>
                  </div>
                </div>
              );
            })}

            {/* Brewing Tips Callout */}
            <div className="mt-8 p-5 rounded-2xl bg-[#163322]/25 border border-white/10 flex items-start gap-4">
              <span className="text-2xl shrink-0">💡</span>
              <p className="text-xs text-slate-300 leading-relaxed">
                <strong className="text-gold block mb-0.5">Golden Rule of Herbal Green Tea:</strong>
                Never leave whole green tea leaves steeping indefinitely in the cup. Straining after 3–5 minutes prevents bitterness and keeps every refill fragrant.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
