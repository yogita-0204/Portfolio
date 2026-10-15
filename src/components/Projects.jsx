import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight, ExternalLink, Eye, Terminal, Layers } from 'lucide-react';
import { GithubIcon } from './Icons';
import { projectsData } from '../data/portfolioData';
import ProjectModal from './ProjectModal';
import { playHoverSound, playClickSound } from '../utils/audioEffects';
import TextScramble from './TextScramble';

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedProject, setSelectedProject] = useState(null);

  const filters = [
    { id: 'all', label: 'All Innovations' },
    { id: 'ai-ml', label: 'AI & Machine Learning' },
    { id: 'analytics', label: 'Data Analytics & BI' },
    { id: 'ui-ux', label: 'UI/UX & Product Design' },
    { id: 'iot-hardware', label: 'IoT Hardware' },
    { id: 'full-stack', label: 'Full-Stack Systems' }
  ];

  const filteredProjects = activeFilter === 'all'
    ? projectsData
    : projectsData.filter((p) => p.category === activeFilter);

  // 3D Tilt Card effect handler with holographic glare
  const handleMouseMove = (e, cardId) => {
    const card = document.getElementById(`project-card-${cardId}`);
    const glare = document.getElementById(`glare-${cardId}`);
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -9;
    const rotateY = ((x - centerX) / centerX) * 9;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.025, 1.025, 1.025)`;
    if (glare) {
      glare.style.opacity = '1';
      glare.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(0, 242, 254, 0.22), transparent 60%)`;
    }
  };

  const handleMouseLeave = (cardId) => {
    const card = document.getElementById(`project-card-${cardId}`);
    const glare = document.getElementById(`glare-${cardId}`);
    if (!card) return;
    card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
    if (glare) {
      glare.style.opacity = '0';
    }
  };

  return (
    <section id="projects" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Section Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center text-center mb-16"
      >
        <div className="cyber-pill mb-3">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>PORTFOLIO SHOWCASE</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Featured <span className="gradient-text-cyan">Innovations & Systems</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-3">
          Explore production-grade ML pipelines, executive analytics cockpits, patented IoT hardware, and Figma design systems.
        </p>
      </motion.div>

      {/* Filter Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-wrap items-center justify-center gap-2 mb-14"
      >
        {filters.map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              playClickSound();
              setActiveFilter(tab.id);
            }}
            onMouseEnter={playHoverSound}
            className={`relative px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all ${
              activeFilter === tab.id
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/30 scale-105'
                : 'bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </motion.div>

      {/* 3D Projects Grid with Framer Motion AnimatePresence layout */}
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              key={project.id}
              id={`project-card-${project.id}`}
              onMouseMove={(e) => handleMouseMove(e, project.id)}
              onMouseLeave={() => handleMouseLeave(project.id)}
              onMouseEnter={playHoverSound}
              className="perspective-container relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/65 backdrop-blur-xl flex flex-col justify-between transition-transform duration-150 ease-out text-left group hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-950/50"
            >
              {/* Dynamic Holographic Glare Layer */}
              <div
                id={`glare-${project.id}`}
                className="pointer-events-none absolute inset-0 z-20 opacity-0 transition-opacity duration-300"
              />

              <div className="relative z-10">
                {/* Project Image Banner */}
                <div className="relative aspect-video overflow-hidden bg-slate-950">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Gradient Shadow Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent" />

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <span className="cyber-pill bg-slate-950/90 backdrop-blur-md text-[10px] py-0.5 border-cyan-400/30">
                      {project.categoryLabel}
                    </span>
                  </div>

                  {/* Main Metric Pill */}
                  {project.metrics[0] && (
                    <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-2.5 py-1 rounded-lg border border-cyan-400/30 font-mono text-[11px] text-cyan-300 flex items-center gap-1.5 shadow-lg">
                      <span className="text-slate-400">{project.metrics[0].label}:</span>
                      <span className="font-bold text-white">{project.metrics[0].value}</span>
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 sm:p-6">
                  <h3 className="text-lg font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                    {project.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4 line-clamp-3">
                    {project.summary}
                  </p>

                  {/* Tech Stack Chips */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {project.techStack.slice(0, 4).map((tech, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/5 text-slate-300 group-hover:border-cyan-400/20 transition-colors"
                      >
                        {tech}
                      </span>
                    ))}
                    {project.techStack.length > 4 && (
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 text-slate-400">
                        +{project.techStack.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="relative z-10 p-5 sm:p-6 pt-0 border-t border-white/5 flex items-center justify-between gap-2 mt-auto">
                <button
                  onClick={() => {
                    playClickSound();
                    setSelectedProject(project);
                  }}
                  onMouseEnter={playHoverSound}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-white transition-colors group-hover:translate-x-1 duration-200"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Deep Dive</span>
                </button>

                <div className="flex items-center gap-2">
                  {project.links?.live && (
                    <a
                      href={project.links.live}
                      onClick={playClickSound}
                      className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500 hover:text-slate-950 transition-all text-xs"
                      title={project.links.demoLabel || 'Demo'}
                    >
                      <Terminal className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.links?.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noreferrer"
                      onClick={playClickSound}
                      className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-white hover:bg-white/10 transition-all"
                      title="GitHub"
                    >
                      <GithubIcon className="w-3.5 h-3.5" />
                    </a>
                  )}
                  {project.links?.figma && (
                    <a
                      href={project.links.figma}
                      target="_blank"
                      rel="noreferrer"
                      onClick={playClickSound}
                      className="p-1.5 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-300 hover:bg-purple-500 hover:text-white transition-all text-xs"
                      title="Figma Link"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Selected Project Architecture Modal */}
      {selectedProject && (
        <ProjectModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}
    </section>
  );
}
