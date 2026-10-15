import React from 'react';
import { motion } from 'framer-motion';
import { ArrowDown, Sparkles, Terminal, Cpu } from 'lucide-react';
import { personalInfo } from '../data/portfolioData';
import { playHoverSound, playClickSound } from '../utils/audioEffects';
import SpotlightCard from './SpotlightCard';
import AnimatedCounter from './AnimatedCounter';
import TextScramble from './TextScramble';

export default function Hero3D() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center overflow-hidden pt-28 pb-16 px-4 md:px-8">
      {/* Atmosphere radial glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[550px] h-[550px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-violet-600/15 rounded-full blur-[140px] pointer-events-none" />

      {/* Main Content with Framer Motion Stagger */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-5xl mx-auto w-full text-center flex flex-col items-center"
      >
        {/* Status Pill */}
        <motion.div variants={itemVariants} className="mb-6">
          <div className="cyber-pill px-4 py-1.5 shadow-lg shadow-cyan-500/20">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
            <span className="font-mono text-xs">
              <TextScramble text={personalInfo.status} autoStart={true} />
            </span>
            <span className="text-slate-500">•</span>
            <span className="text-violet-400 font-mono text-xs">LPU '26 CSE</span>
          </div>
        </motion.div>

        {/* Hero Main Headline */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.08] mb-6 max-w-4xl"
        >
          <span className="block text-slate-100">ENGINEERING DATA</span>
          <span className="block gradient-text-violet">
            <TextScramble text="INTELLIGENCE." autoStart={true} />
          </span>
          <span className="block text-2xl sm:text-3xl md:text-4xl font-semibold text-slate-300 mt-2">
            CRAFTING <span className="gradient-text-cyan">INTUITIVE REALITIES.</span>
          </span>
        </motion.h1>

        {/* Hero Narrative Subtitle */}
        <motion.p
          variants={itemVariants}
          className="text-slate-300 text-base sm:text-lg md:text-xl max-w-3xl mb-10 leading-relaxed font-light"
        >
          Hi, I'm <strong className="text-cyan-300 font-semibold">{personalInfo.name}</strong> — a hybrid{' '}
          <span className="text-white font-medium underline decoration-cyan-400 decoration-2 underline-offset-4">Data Scientist</span> &{' '}
          <span className="text-white font-medium underline decoration-violet-400 decoration-2 underline-offset-4">UI/UX Product Architect</span>.
          I translate raw datasets into measurable revenue with ML pipelines, Power BI DAX intelligence, and patented IoT hardware.
        </motion.p>

        {/* Action Button Group */}
        <motion.div variants={itemVariants} className="flex flex-wrap items-center justify-center gap-4 mb-16">
          <motion.a
            href="#projects"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={playClickSound}
            onMouseEnter={playHoverSound}
            className="btn-primary"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore 3D Work</span>
          </motion.a>

          <motion.a
            href="#lab"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={playClickSound}
            onMouseEnter={playHoverSound}
            className="btn-secondary group"
          >
            <Terminal className="w-4 h-4 text-cyan-400 group-hover:rotate-12 transition-transform" />
            <span>Launch Live ML Lab</span>
          </motion.a>

          <motion.a
            href="#patent"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={playClickSound}
            onMouseEnter={playHoverSound}
            className="btn-secondary group"
          >
            <Cpu className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" />
            <span>IoT Patent (ESP32)</span>
          </motion.a>
        </motion.div>

        {/* Live HUD Metric Cards with Spotlight & Animated Counters */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl">
          {personalInfo.stats.map((stat, idx) => (
            <SpotlightCard
              key={idx}
              className="p-5 text-left border-white/10 hover:border-cyan-400/50"
              onMouseEnter={playHoverSound}
            >
              <div className="text-2xl sm:text-3xl font-extrabold gradient-text-cyan font-mono mb-1">
                <AnimatedCounter value={stat.value} duration={1800} />
              </div>
              <div className="text-xs sm:text-sm font-semibold text-slate-200">
                {stat.label}
              </div>
              <div className="text-[11px] text-slate-400 mt-1 font-mono">
                {stat.highlight}
              </div>
            </SpotlightCard>
          ))}
        </motion.div>

        {/* Animated Scroll Down Indicator */}
        <motion.div
          variants={itemVariants}
          className="mt-14 flex flex-col items-center gap-2 opacity-60 hover:opacity-100 transition-opacity"
        >
          <span className="text-[11px] tracking-widest uppercase font-mono text-cyan-400">Scroll to Explore</span>
          <ArrowDown className="w-4 h-4 text-cyan-400 animate-bounce" />
        </motion.div>
      </motion.div>
    </section>
  );
}
