import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Menu, X, Sparkles, Terminal, FileText, ArrowRight, Mail } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import { personalInfo } from '../data/portfolioData';
import { setAudioEnabled, getAudioState, toggleAmbientDrone, playClickSound, playHoverSound } from '../utils/audioEffects';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundToggle = () => {
    const newState = !soundOn;
    setSoundOn(newState);
    setAudioEnabled(newState);
    if (newState) {
      toggleAmbientDrone();
      playClickSound();
    }
  };

  const navLinks = [
    { name: 'About', href: '#about' },
    { name: 'Skills', href: '#skills' },
    { name: 'Projects', href: '#projects' },
    { name: 'ML Lab', href: '#lab', badge: 'Live' },
    { name: 'IoT Patent', href: '#patent' },
    { name: 'UX Studies', href: '#ux-studies' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-8 py-3 transition-all duration-300">
      <div
        className={`max-w-7xl mx-auto flex items-center justify-between px-4 sm:px-6 py-2.5 rounded-full transition-all duration-300 ${
          isScrolled
            ? 'bg-slate-950/85 backdrop-blur-xl border border-white/10 shadow-2xl shadow-cyan-950/40'
            : 'bg-slate-900/40 backdrop-blur-md border border-white/5'
        }`}
      >
        {/* Brand / Logo */}
        <a
          href="#hero"
          onClick={playClickSound}
          onMouseEnter={playHoverSound}
          className="flex items-center gap-3 group text-decoration-none"
        >
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-400 via-violet-500 to-pink-500 p-[1.5px] transition-transform duration-300 group-hover:scale-105">
            <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center font-bold text-xs tracking-wider text-cyan-300 font-mono">
              YY
            </div>
          </div>
          <div className="flex flex-col text-left">
            <span className="text-sm font-bold tracking-tight text-white group-hover:text-cyan-300 transition-colors">
              {personalInfo.name}
            </span>
            <span className="text-[10px] text-slate-400 font-mono tracking-wider flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
              DATA & UX ENGINE
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={playClickSound}
              onMouseEnter={playHoverSound}
              className="px-3.5 py-1.5 rounded-full text-xs font-medium text-slate-300 hover:text-white hover:bg-white/5 transition-all relative group"
            >
              <span>{link.name}</span>
              {link.badge && (
                <span className="ml-1.5 px-1.5 py-0.2 rounded-full text-[9px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {link.badge}
                </span>
              )}
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-violet-400 rounded-full group-hover:w-4 transition-all duration-300" />
            </a>
          ))}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Sound FX Toggle Button */}
          <button
            onClick={handleSoundToggle}
            onMouseEnter={playHoverSound}
            title={soundOn ? 'Sound is ON (Click to mute)' : 'Sound is MUTED (Click to enable audio effects)'}
            className={`p-2 rounded-full border transition-all ${
              soundOn
                ? 'bg-cyan-500/15 border-cyan-400/40 text-cyan-300 shadow-sm shadow-cyan-400/20'
                : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:border-white/20'
            }`}
          >
            {soundOn ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Social Quick Links */}
          <a
            href={personalInfo.github}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:border-white/25 transition-all hidden sm:flex"
            title="GitHub"
          >
            <GithubIcon className="w-4 h-4" />
          </a>

          <a
            href={personalInfo.linkedin}
            target="_blank"
            rel="noreferrer"
            onMouseEnter={playHoverSound}
            onClick={playClickSound}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-400 hover:text-cyan-300 hover:border-cyan-400/30 transition-all hidden sm:flex"
            title="LinkedIn"
          >
            <LinkedinIcon className="w-4 h-4" />
          </a>

          {/* CTA: Let's Connect */}
          <a
            href="#contact"
            onClick={playClickSound}
            onMouseEnter={playHoverSound}
            className="hidden sm:inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-cyan-400 to-blue-500 text-slate-950 hover:brightness-110 shadow-md shadow-cyan-500/25 transition-all"
          >
            <span>Let's Connect</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => {
              playClickSound();
              setMobileMenuOpen(!mobileMenuOpen);
            }}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-slate-200 lg:hidden"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-2 max-w-7xl mx-auto bg-slate-950/95 backdrop-blur-2xl border border-white/15 rounded-2xl p-5 shadow-2xl animate-in fade-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => {
                  playClickSound();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center justify-between px-4 py-2.5 rounded-xl text-sm font-medium text-slate-200 hover:bg-white/10 hover:text-cyan-300 transition-colors"
              >
                <span>{link.name}</span>
                {link.badge && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                    {link.badge}
                  </span>
                )}
              </a>
            ))}
          </nav>
          <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
            <div className="flex gap-3">
              <a href={personalInfo.github} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-white">
                <GithubIcon className="w-5 h-5" />
              </a>
              <a href={personalInfo.linkedin} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-cyan-300">
                <LinkedinIcon className="w-5 h-5" />
              </a>
              <a href={`mailto:${personalInfo.email}`} className="text-slate-400 hover:text-emerald-300">
                <Mail className="w-5 h-5" />
              </a>
            </div>
            <a
              href="#contact"
              onClick={() => {
                playClickSound();
                setMobileMenuOpen(false);
              }}
              className="px-4 py-1.5 rounded-full text-xs font-semibold bg-cyan-400 text-slate-950"
            >
              Get In Touch
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
