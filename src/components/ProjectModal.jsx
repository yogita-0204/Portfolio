import React, { useEffect } from 'react';
import { X, ExternalLink, CheckCircle2, Cpu, Database, BarChart3, ArrowRight, Layers, ShieldCheck } from 'lucide-react';
import { GithubIcon } from './Icons';
import { playClickSound, playHoverSound } from '../utils/audioEffects';

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-4xl bg-slate-900 border border-white/15 rounded-3xl overflow-hidden shadow-2xl shadow-cyan-950/50 my-8 text-left"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <span className="cyber-pill text-[11px] py-1">
              {project.categoryLabel}
            </span>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              PROJECT ARCHITECTURE DEEP DIVE
            </span>
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            onMouseEnter={playHoverSound}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 max-h-[75vh] overflow-y-auto space-y-6">
          {/* Main Visual Banner */}
          <div className="relative rounded-2xl overflow-hidden border border-white/10 aspect-video max-h-80 w-full bg-slate-950">
            <img
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-xl sm:text-2xl font-extrabold text-white">
                {project.title}
              </h3>
            </div>
          </div>

          {/* Key Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {project.metrics.map((metric, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-left"
              >
                <div className="text-xs font-mono text-slate-400 mb-1">{metric.label}</div>
                <div className="text-lg sm:text-xl font-bold font-mono gradient-text-cyan">
                  {metric.value}
                </div>
              </div>
            ))}
          </div>

          {/* Problem & Solution Breakdown */}
          {project.deepDive && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20">
                <h4 className="text-xs font-bold font-mono text-red-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-red-400" />
                  The Problem & Bottleneck
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {project.deepDive.problem}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                <h4 className="text-xs font-bold font-mono text-emerald-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Engineering Solution
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {project.deepDive.solution}
                </p>
              </div>
            </div>
          )}

          {/* Architecture Pipeline Flow */}
          {project.deepDive?.architecture && (
            <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/20 font-mono text-xs">
              <div className="text-cyan-300 font-bold mb-1.5 flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>System Architecture Flow</span>
              </div>
              <div className="text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-white/5">
                {project.deepDive.architecture}
              </div>
            </div>
          )}

          {/* Key Deliverables & Highlights */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold text-white uppercase font-mono tracking-wider">
              Technical Deliverables & Impact
            </h4>
            <div className="space-y-2">
              {project.highlights.map((item, idx) => (
                <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-cyan-400 flex-shrink-0 mt-0.5" />
                  <span className="leading-relaxed">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Tech Stack Chips */}
          <div>
            <h4 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider mb-2">
              Tech Stack & Tooling
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {project.techStack.map((tech, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 rounded-md bg-white/5 border border-white/10 text-xs font-mono text-cyan-200"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Modal Footer Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4 border-t border-white/10 bg-slate-950/80">
          <div className="flex items-center gap-3">
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noreferrer"
                onClick={playClickSound}
                className="btn-secondary text-xs py-2 px-4"
              >
                <GithubIcon className="w-3.5 h-3.5" />
                <span>GitHub Repository</span>
              </a>
            )}
            {project.links?.figma && (
              <a
                href={project.links.figma}
                target="_blank"
                rel="noreferrer"
                onClick={playClickSound}
                className="btn-secondary text-xs py-2 px-4"
              >
                <ExternalLink className="w-3.5 h-3.5 text-purple-400" />
                <span>Open in Figma</span>
              </a>
            )}
          </div>

          <button
            onClick={() => {
              playClickSound();
              onClose();
            }}
            className="btn-primary text-xs py-2 px-5"
          >
            Close Overview
          </button>
        </div>
      </div>
    </div>
  );
}
