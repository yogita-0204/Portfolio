import React, { useState, useEffect } from 'react';
import { Volume2, X, Sparkles } from 'lucide-react';
import { setAudioEnabled, toggleAmbientDrone, playSuccessSound } from '../utils/audioEffects';

export default function AudioBanner() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(true);
    }, 1800);
    return () => clearTimeout(timer);
  }, []);

  const handleEnableAudio = () => {
    setAudioEnabled(true);
    toggleAmbientDrone();
    playSuccessSound();
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-in fade-in slide-in-from-bottom-5 duration-500 max-w-sm">
      <div className="p-4 rounded-2xl bg-slate-950/90 backdrop-blur-2xl border border-cyan-400/40 shadow-2xl shadow-cyan-950/60 flex items-center justify-between gap-3 text-left">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
            <Volume2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
              <span>Cyber Soundscape</span>
              <Sparkles className="w-3 h-3 text-cyan-400" />
            </h4>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Enable procedural 3D audio & sci-fi ambient hum?
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 flex-shrink-0">
          <button
            onClick={handleEnableAudio}
            className="px-3 py-1.5 rounded-lg bg-cyan-400 hover:bg-cyan-300 text-slate-950 text-xs font-bold transition-all shadow-md shadow-cyan-500/30"
          >
            Enable
          </button>
          <button
            onClick={() => setShow(false)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
