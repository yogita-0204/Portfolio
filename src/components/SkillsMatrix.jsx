import React, { useState } from 'react';
import { Cpu, Database, Palette, Terminal, Layers, Sparkles, Check } from 'lucide-react';
import { skillsData } from '../data/portfolioData';
import { playHoverSound, playClickSound } from '../utils/audioEffects';

export default function SkillsMatrix() {
  const [activeTab, setActiveTab] = useState(skillsData.categories[0].id);

  const activeCategory = skillsData.categories.find((c) => c.id === activeTab) || skillsData.categories[0];

  const getCategoryIcon = (id) => {
    switch (id) {
      case 'ml-ai':
        return <Cpu className="w-4 h-4" />;
      case 'data-analytics':
        return <Database className="w-4 h-4" />;
      case 'ui-ux':
        return <Palette className="w-4 h-4" />;
      case 'web-backend':
        return <Terminal className="w-4 h-4" />;
      default:
        return <Layers className="w-4 h-4" />;
    }
  };

  return (
    <section id="skills" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="cyber-pill mb-3">
          <Layers className="w-3.5 h-3.5" />
          <span>TECHNICAL ARSENAL</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Skills & <span className="gradient-text-violet">Tech Architecture</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-3">
          A balanced synthesis of mathematical modeling, distributed data tools, and modern design systems.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
        {skillsData.categories.map((category) => {
          const isActive = category.id === activeTab;
          return (
            <button
              key={category.id}
              onClick={() => {
                playClickSound();
                setActiveTab(category.id);
              }}
              onMouseEnter={playHoverSound}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 shadow-lg shadow-cyan-500/25 scale-105'
                  : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {getCategoryIcon(category.id)}
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Active Category Display Box */}
      <div className="glass-panel p-6 sm:p-10 border border-white/10 relative overflow-hidden">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-1/4 right-1/4 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-60" />

        <div className="mb-8 text-left">
          <div className="flex items-center gap-2.5 mb-2">
            <span className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
              {getCategoryIcon(activeCategory.id)}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-white">{activeCategory.name}</h3>
          </div>
          <p className="text-sm text-slate-400">{activeCategory.description}</p>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
          {activeCategory.skills.map((skill, index) => (
            <div
              key={index}
              onMouseEnter={playHoverSound}
              className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-cyan-400/30 transition-all group"
            >
              {/* Header: Skill Name & Percentage */}
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors">
                  {skill.name}
                </span>
                <span className="font-mono text-xs text-cyan-400 font-semibold bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                  {skill.level}%
                </span>
              </div>

              {/* Progress Bar with Gradient Glow */}
              <div className="w-full h-2 rounded-full bg-slate-900 border border-white/10 overflow-hidden mb-3">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500 transition-all duration-1000 ease-out"
                  style={{ width: `${skill.level}%` }}
                />
              </div>

              {/* Concept Tags */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {skill.tags.map((tag, tIdx) => (
                  <span
                    key={tIdx}
                    className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-white/5 text-slate-300 border border-white/5 group-hover:border-cyan-400/20 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Highlights Strip */}
        <div className="mt-10 pt-6 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-mono text-slate-400">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Tested in real-world pipelines with 35+ validation gates</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-cyan-300">Python 3.11+</span>
            <span>•</span>
            <span className="text-violet-300">FastAPI</span>
            <span>•</span>
            <span className="text-emerald-300">Power BI DAX</span>
            <span>•</span>
            <span className="text-pink-300">Figma 2024</span>
          </div>
        </div>
      </div>
    </section>
  );
}
