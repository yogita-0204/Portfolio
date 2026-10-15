import React from 'react';
import { motion } from 'framer-motion';
import { Award, GraduationCap, Brain, Palette, Sparkles, MapPin, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';
import { personalInfo, educationData, certificationsData } from '../data/portfolioData';
import { playHoverSound, playClickSound } from '../utils/audioEffects';
import SpotlightCard from './SpotlightCard';
import TextScramble from './TextScramble';

export default function About() {
  return (
    <section id="about" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center text-center mb-16"
      >
        <div className="cyber-pill mb-3">
          <Brain className="w-3.5 h-3.5" />
          <span>ABOUT & PHILOSOPHY</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          The <span className="gradient-text-cyan">Dual-Engine</span> Advantage
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-3">
          Why choose between mathematical rigor and world-class product design when you can have both?
        </p>
      </motion.div>

      {/* Main Grid: Portrait + Story */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center mb-20">
        {/* Left Column: Cyber Frame Portrait with Hover Tilt */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 flex justify-center"
        >
          <div className="relative group max-w-sm w-full">
            {/* Glowing Backdrop */}
            <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-violet-500 to-pink-500 rounded-3xl blur-2xl opacity-40 group-hover:opacity-75 transition-opacity duration-500 animate-pulse-glow" />

            {/* Image Container */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl">
              <img
                src={personalInfo.profileImage}
                alt={personalInfo.name}
                className="w-full h-auto object-cover aspect-square group-hover:scale-105 transition-transform duration-700"
              />

              {/* Holographic Overlay Scanline */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent pointer-events-none" />

              {/* Floating Badges on Portrait with subtle physics */}
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-4 left-4"
              >
                <span className="cyber-pill bg-slate-950/85 backdrop-blur-md border-cyan-400/40 text-[11px] shadow-lg">
                  <Sparkles className="w-3 h-3 text-cyan-400" />
                  <span>AI + UX HYBRID</span>
                </span>
              </motion.div>

              <div className="absolute bottom-4 left-4 right-4 bg-slate-950/85 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white text-sm font-bold">{personalInfo.name}</h4>
                    <p className="text-xs text-slate-400 font-mono">B.Tech CSE • LPU (CGPA: 7.63)</p>
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    2026 Batch
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Right Column: Narrative & Pillars */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 flex flex-col gap-6 text-left"
        >
          <SpotlightCard className="p-6 sm:p-8 border-white/10">
            <h3 className="text-xl sm:text-2xl font-bold mb-4 flex items-center gap-2.5">
              <span>Bridging Algorithms to Human Experience</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300">
                <TextScramble text="CORE PHILOSOPHY" autoStart={true} />
              </span>
            </h3>

            <p className="text-slate-300 leading-relaxed text-sm sm:text-base mb-4">
              I am a final-year Computer Science Engineering student at <strong className="text-white">Lovely Professional University</strong> with a unique duality. On one side, I build production-grade <strong className="text-cyan-300">Machine Learning pipelines</strong>, predictive churn models, and Power BI DAX dashboards that parse millions of data points into concrete ROI.
            </p>

            <p className="text-slate-300 leading-relaxed text-sm sm:text-base mb-6">
              On the other side, I am deeply committed to <strong className="text-violet-300">Human-Computer Interaction and UI/UX Architecture</strong>. I believe that even the most mathematically sophisticated algorithm fails if end users cannot understand, trust, and seamlessly act upon its insights. My work merges these domains seamlessly.
            </p>

            {/* Dual Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div
                onMouseEnter={playHoverSound}
                className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/20 hover:border-cyan-400/50 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-400">
                    <Brain className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-cyan-200">Data & ML Engine</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  End-to-end ML pipelines (Random Forest, XGBoost), SHAP explainability, Time Series, PySpark & DAX analytics.
                </p>
              </div>

              <div
                onMouseEnter={playHoverSound}
                className="p-4 rounded-xl bg-violet-950/30 border border-violet-500/20 hover:border-violet-400/50 transition-all hover:-translate-y-1"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-2 rounded-lg bg-violet-500/20 text-violet-400">
                    <Palette className="w-4 h-4" />
                  </div>
                  <h4 className="font-bold text-sm text-violet-200">UX & Product Engine</h4>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Figma design systems, journey mapping, low/hi-fi wireframes, frictionless order flows & modern micro-interactions.
                </p>
              </div>
            </div>
          </SpotlightCard>
        </motion.div>
      </div>

      {/* Education & Certifications Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Education Timeline */}
        <SpotlightCard className="p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Academic Background</h3>
              <p className="text-xs text-slate-400 font-mono">Formal Engineering & Foundations</p>
            </div>
          </div>

          <div className="flex flex-col gap-6 relative before:absolute before:top-2 before:bottom-2 before:left-3.5 before:w-0.5 before:bg-gradient-to-b before:from-cyan-400 before:via-violet-500 before:to-transparent">
            {educationData.map((edu, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.15, duration: 0.5 }}
                className="relative pl-9 flex flex-col gap-1 text-left"
              >
                {/* Node indicator */}
                <div className="absolute left-1.5 top-1.5 w-4 h-4 rounded-full bg-slate-950 border-2 border-cyan-400 flex items-center justify-center">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="text-sm font-bold text-white">{edu.institution}</h4>
                  <span className="text-xs font-mono text-cyan-300 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20 font-bold">
                    {edu.score}
                  </span>
                </div>

                <div className="text-xs text-violet-300 font-medium">{edu.degree}</div>

                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-0.5">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {edu.period}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    {edu.location}
                  </span>
                </div>

                <p className="text-xs text-slate-400 mt-1">{edu.details}</p>
              </motion.div>
            ))}
          </div>
        </SpotlightCard>

        {/* Certifications & Patents Hub */}
        <SpotlightCard className="p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 mb-6 pb-3 border-b border-white/10">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold">Certifications & Honors</h3>
                <p className="text-xs text-slate-400 font-mono">Industry Recognized Credentials</p>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {certificationsData.map((cert, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                  onMouseEnter={playHoverSound}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 hover:border-violet-400/40 transition-all text-left flex flex-col gap-1.5 hover:-translate-y-0.5"
                >
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-sm font-bold text-white flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                      <span>{cert.title}</span>
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400 px-2 py-0.5 rounded bg-white/5">
                      {cert.date}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-violet-300 font-mono">
                    <span>Issued by {cert.issuer}</span>
                    <span>•</span>
                    <span className="text-slate-400">{cert.badge}</span>
                  </div>

                  <p className="text-xs text-slate-400 mt-0.5">{cert.description}</p>
                </motion.div>
              ))}

              {/* Patent Highlight Card */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                onMouseEnter={playHoverSound}
                className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-cyan-500/10 border border-amber-500/30 text-left mt-2 shadow-lg shadow-amber-500/10"
              >
                <div className="flex items-center justify-between">
                  <span className="cyber-pill bg-amber-500/20 text-amber-300 border-amber-500/40 text-[10px]">
                    PATENT CO-INVENTOR
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">May 2025</span>
                </div>
                <h4 className="text-sm font-bold text-white mt-2">
                  Temperature-Sensitive Car Seat Cover with Automated Heating & Cooling
                </h4>
                <p className="text-xs text-slate-300 mt-1">
                  Patented IoT architecture utilizing ESP32 microcontroller with Phase Change Material (PCM) thermal buffering.
                </p>
                <a
                  href="#patent"
                  onClick={playClickSound}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-amber-300 hover:text-white mt-3 group"
                >
                  <span>Explore Patent 3D Diagram</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </a>
              </motion.div>
            </div>
          </div>
        </SpotlightCard>
      </div>
    </section>
  );
}
