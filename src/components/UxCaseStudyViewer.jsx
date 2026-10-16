import React, { useState } from 'react';
import { Palette, ExternalLink, ArrowRight, CheckCircle2, Smartphone, Layers, Eye, Sparkles } from 'lucide-react';
import { playHoverSound, playClickSound } from '../utils/audioEffects';

export default function UxCaseStudyViewer() {
  const [activeStudy, setActiveStudy] = useState('dabbagaram'); // 'dabbagaram' or 'kitchenette'
  const [activeStep, setActiveStep] = useState(0);

  const dabbaSteps = [
    { title: "Discovery & Feed", desc: "Redesigned meal exploration with clear dish photography, pricing and spice level indicators." },
    { title: "Smart Slot Scheduling", desc: "User picks exact pickup window (10m, 20m, 45m) preventing food from going cold on the counter." },
    { title: "Transparent Pricing Cart", desc: "Subtotal, item taxes, packing charge breakdown without hidden surcharges." },
    { title: "Live Status Tracker", desc: "Dynamic tracking badge with real-time states (Cooking -> Ready for Pickup -> Handed Over)." }
  ];

  const kitchenetteSteps = [
    { title: "Live Crowd Indicator", desc: "Real-time crowd meter (Low / Moderate / Busy) guides students when to order." },
    { title: "20% Campus Offer", desc: "One-click voucher auto-applies student discount above threshold orders." },
    { title: "Order Slot Selection", desc: "Timed pickup slot buffer holds food warm for up to 10 minutes after preparation." },
    { title: "1-Tap Feedback Loop", desc: "Quick tags (Tasty, Fast Service, Cold) with serious hygiene escalation reporting." }
  ];

  const currentSteps = activeStudy === 'dabbagaram' ? dabbaSteps : kitchenetteSteps;

  return (
    <section id="ux-studies" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="cyber-pill bg-purple-500/10 text-purple-300 border-purple-500/30 mb-3">
          <Palette className="w-3.5 h-3.5 text-purple-400" />
          <span>PRODUCT DESIGN CASE STUDIES</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          UI/UX & <span className="gradient-text-violet">Design Systems</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-3">
          Human-centered research, information architecture, wireframing, and Figma component libraries engineered for effortless usability.
        </p>
      </div>

      {/* Case Study Switcher */}
      <div className="flex items-center justify-center gap-3 mb-12">
        <button
          onClick={() => {
            playClickSound();
            setActiveStudy('dabbagaram');
            setActiveStep(0);
          }}
          onMouseEnter={playHoverSound}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all ${
            activeStudy === 'dabbagaram'
              ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 shadow-lg shadow-amber-500/25'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          <span>Dabba Garam App Redesign</span>
        </button>

        <button
          onClick={() => {
            playClickSound();
            setActiveStudy('kitchenette');
            setActiveStep(0);
          }}
          onMouseEnter={playHoverSound}
          className={`flex items-center gap-2 px-6 py-3 rounded-full text-xs sm:text-sm font-bold transition-all ${
            activeStudy === 'kitchenette'
              ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-lg shadow-emerald-500/25'
              : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Kitchenette Campus Dining</span>
        </button>
      </div>

      {/* Main Case Study Display */}
      <div className="glass-panel p-6 sm:p-10 border border-white/10 text-left">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Image Mockup Showcase (7 cols) */}
          <div className="lg:col-span-7">
            <div className="relative rounded-2xl overflow-hidden border border-white/15 bg-slate-950 shadow-2xl group">
              <img
                src={activeStudy === 'dabbagaram' ? '/assets/dabbagaram.jpg' : '/assets/kitchenette.jpg'}
                alt={activeStudy === 'dabbagaram' ? 'Dabba Garam Redesign' : 'Kitchenette Flow'}
                className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent pointer-events-none" />

              <div className="absolute top-4 left-4">
                <span className="cyber-pill bg-slate-950/85 backdrop-blur-md text-[10px]">
                  {activeStudy === 'dabbagaram' ? 'FIGMA DESIGN SYSTEM • POPPINS' : 'LOW-FI & MID-FI WIREFRAMES'}
                </span>
              </div>
            </div>

            {/* Design System Swatches (for Dabba Garam) */}
            {activeStudy === 'dabbagaram' && (
              <div className="mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
                <div className="flex items-center gap-3">
                  <span className="text-slate-400">Palette Tokens:</span>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#FF7A00] border border-white/20" title="#FF7A00 Warm Amber" />
                    <span className="w-5 h-5 rounded-full bg-[#00B368] border border-white/20" title="#00B368 Leafy Green" />
                    <span className="w-5 h-5 rounded-full bg-[#202020] border border-white/20" title="#202020 Dark Neutral" />
                    <span className="w-5 h-5 rounded-full bg-[#FAFAFA] border border-white/20" title="#FAFAFA Surface" />
                  </div>
                </div>

                <a
                  href="https://www.figma.com/design/IVT7XLe5dFmxUG9UsXrtzZ/Dabba-midfi?node-id=0-1"
                  target="_blank"
                  rel="noreferrer"
                  onClick={playClickSound}
                  className="inline-flex items-center gap-1.5 text-purple-300 hover:text-white font-semibold transition-colors"
                >
                  <span>Open Figma Workspace</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            )}
          </div>

          {/* Right Column: Case Narrative & Flow Stages (5 cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[11px] font-mono text-purple-400 uppercase tracking-widest">
                  {activeStudy === 'dabbagaram' ? 'CASE STUDY 01' : 'CASE STUDY 02'}
                </span>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                {activeStudy === 'dabbagaram'
                  ? 'Dabba Garam — Meal Ordering Re-architecture'
                  : 'Kitchenette — Campus Food Rush Management'}
              </h3>

              <p className="text-sm text-slate-300 leading-relaxed mb-6">
                {activeStudy === 'dabbagaram'
                  ? 'Redesigning a high-volume takeaway food app to solve menu fatigue, unexpected checkout charges, and uncertain pickup preparation intervals.'
                  : 'Engineered an end-to-end dining workflow connecting student hunger peaks with kitchen capacity using live crowd metrics and scheduled order reservations.'}
              </p>

              {/* Step By Step Flow Selector */}
              <div className="space-y-2.5">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                  User Journey Flow Stages:
                </span>
                {currentSteps.map((step, idx) => (
                  <div
                    key={idx}
                    onClick={() => {
                      playClickSound();
                      setActiveStep(idx);
                    }}
                    onMouseEnter={playHoverSound}
                    className={`p-3 rounded-xl border cursor-pointer transition-all ${
                      activeStep === idx
                        ? 'bg-purple-500/15 border-purple-400/50 shadow-sm shadow-purple-500/20'
                        : 'bg-white/5 border-white/5 hover:border-white/15'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs font-bold text-white mb-1">
                      <span className="flex items-center gap-2">
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono ${
                          activeStep === idx ? 'bg-purple-400 text-slate-950' : 'bg-white/10 text-slate-400'
                        }`}>
                          {idx + 1}
                        </span>
                        <span>{step.title}</span>
                      </span>
                      {activeStep === idx && <Sparkles className="w-3.5 h-3.5 text-purple-400" />}
                    </div>
                    <p className="text-[11px] text-slate-300 pl-6">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Methodology Pill Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span>UX Deliverable: Heuristic Audit</span>
              <span className="text-cyan-400">High-Fidelity Interaction</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
