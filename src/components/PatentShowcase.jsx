import React, { useState } from 'react';
import { Award, Cpu, Thermometer, Wifi, ShieldAlert, Sparkles, Sliders, CheckCircle2 } from 'lucide-react';
import { playHoverSound, playClickSound } from '../utils/audioEffects';

export default function PatentShowcase() {
  const [ambientTemp, setAmbientTemp] = useState(38); // °C (Cabin temperature)
  const [activeLayer, setActiveLayer] = useState(2); // 0 to 4

  const layers = [
    {
      id: 0,
      title: "Top Perforated Breathable Fabric",
      subtitle: "Integrated with micro-temperature sensor arrays (0.1°C resolution)",
      desc: "High-grade automotive perforated leatherette allowing frictionless heat transfer while maintaining ergonomics."
    },
    {
      id: 1,
      title: "Conductive Heat-Spreading Mesh",
      subtitle: "Uniform thermal distribution across seat surface",
      desc: "Prevents localized thermal hot spots or cold zones, dispersing Peltier energy evenly across driver contact areas."
    },
    {
      id: 2,
      title: "PCM Phase Change Material Honeycomb",
      subtitle: "Passive thermal stabilization & latency buffer",
      desc: "Stores latent heat passively when cabin temperature spikes above 28°C, drastically reducing power draw on the vehicle battery."
    },
    {
      id: 3,
      title: "Thermoelectric Peltier Modules",
      subtitle: "Solid-state active heating and cooling tiles",
      desc: "Fast-acting semiconductor elements driven by pulse-width modulation (PWM) to heat or chill the seat surface within seconds."
    },
    {
      id: 4,
      title: "ESP32 IoT Telemetry & Control Unit",
      subtitle: "Dual-core microcontroller with Bluetooth & Wi-Fi",
      desc: "Processes multi-point sensor readings, runs automated PID thermal regulation loops, and communicates with smartphone companion app."
    }
  ];

  // Calculate dynamic seat response temperature
  const targetTemp = 22; // Target comfort temp in °C
  const isCooling = ambientTemp > 24;
  const isHeating = ambientTemp < 20;
  const regulatedTemp = isCooling
    ? (22 + (ambientTemp - 22) * 0.12).toFixed(1)
    : isHeating
    ? (22 - (22 - ambientTemp) * 0.15).toFixed(1)
    : 22.0;

  return (
    <section id="patent" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-16">
        <div className="cyber-pill bg-amber-500/10 text-amber-300 border-amber-500/30 mb-3">
          <Award className="w-3.5 h-3.5 text-amber-400" />
          <span>GRANTED HARDWARE PATENT</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Smart IoT <span className="gradient-text-gold">Thermal Regulation</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-3">
          Co-invented patented hardware marrying Phase Change Materials (PCM) with ESP32 microcontroller automation for next-gen vehicle comfort.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Left Column: Patent Schematic Visual + Layer Selector (7 cols) */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 border border-white/10 flex flex-col justify-between">
          <div>
            {/* Patent Header */}
            <div className="flex flex-wrap items-center justify-between pb-4 mb-6 border-b border-white/10 gap-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400">
                  PATENT NO. US/IN GRANTED • CO-INVENTED (MAY 2025)
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                  Automated Temperature-Sensitive Car Seat Cover
                </h3>
              </div>
              <span className="cyber-pill text-[10px] bg-slate-950 text-cyan-300 border-cyan-400/30">
                ESP32 + PCM
              </span>
            </div>

            {/* Patent Blueprint Image */}
            <div className="relative rounded-2xl overflow-hidden border border-white/10 mb-6 bg-slate-950 group">
              <img
                src="/assets/patent-iot.jpg"
                alt="Patent Schematic Architecture"
                className="w-full aspect-video object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-mono text-cyan-300 bg-slate-950/80 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                <span>Figure 1: Exploded Multi-Layer Cross-Section</span>
                <span className="text-slate-400">ESP-WROOM-32E Core</span>
              </div>
            </div>

            {/* Layer Selection Chips */}
            <div className="space-y-2">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
                Interactive Layer Architecture (Click to Inspect)
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {layers.map((layer) => (
                  <button
                    key={layer.id}
                    onClick={() => {
                      playClickSound();
                      setActiveLayer(layer.id);
                    }}
                    onMouseEnter={playHoverSound}
                    className={`p-3 rounded-xl text-left border transition-all ${
                      activeLayer === layer.id
                        ? 'bg-amber-500/15 border-amber-400/50 shadow-md shadow-amber-500/20'
                        : 'bg-white/5 border-white/5 hover:border-white/20'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-mono font-bold ${
                        activeLayer === layer.id ? 'bg-amber-400 text-slate-950' : 'bg-white/10 text-slate-300'
                      }`}>
                        {layer.id + 1}
                      </span>
                      <span className="text-xs font-bold text-white line-clamp-1">{layer.title}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Active Layer Details Box */}
          <div className="mt-6 p-4 rounded-xl bg-slate-950/80 border border-amber-500/30 text-xs">
            <div className="flex items-center gap-2 text-amber-300 font-bold mb-1 font-mono">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Layer {activeLayer + 1}: {layers[activeLayer].title}</span>
            </div>
            <p className="text-slate-300 leading-relaxed">{layers[activeLayer].desc}</p>
          </div>
        </div>

        {/* Right Column: Real-time Thermodynamics Simulation (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="glass-panel p-6 sm:p-8 border border-white/10 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 mb-6 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-base text-white">Thermodynamics Lab</h3>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1.5 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  PID ACTIVE
                </span>
              </div>

              {/* Cabin Temperature Slider */}
              <div className="mb-8">
                <div className="flex items-center justify-between text-xs font-mono mb-2">
                  <span className="text-slate-300">Ambient Cabin Environment</span>
                  <span className={`text-sm font-bold font-mono ${ambientTemp > 30 ? 'text-rose-400' : ambientTemp < 15 ? 'text-cyan-400' : 'text-emerald-400'}`}>
                    {ambientTemp}°C {ambientTemp > 30 ? '🔥 Heatwave' : ambientTemp < 15 ? '❄️ Freezing' : 'Comfortable'}
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="48"
                  value={ambientTemp}
                  onChange={(e) => setAmbientTemp(Number(e.target.value))}
                  className="w-full accent-amber-400 cursor-pointer h-2 bg-slate-900 rounded-lg"
                />
                <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                  <span>5°C (Winter Freeze)</span>
                  <span>25°C (Room Temp)</span>
                  <span>48°C (Extreme Summer)</span>
                </div>
              </div>

              {/* Dynamic Readout Meters */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-4 rounded-xl bg-slate-950/70 border border-white/10">
                  <span className="text-[10px] font-mono text-slate-400 block mb-1">UNREGULATED CABIN</span>
                  <div className={`text-2xl sm:text-3xl font-extrabold font-mono ${ambientTemp > 30 ? 'text-rose-400' : 'text-cyan-400'}`}>
                    {ambientTemp}°C
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">External ambient</span>
                </div>

                <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-500/30">
                  <span className="text-[10px] font-mono text-emerald-400 block mb-1">REGULATED DRIVER SEAT</span>
                  <div className="text-2xl sm:text-3xl font-extrabold font-mono text-emerald-300">
                    {regulatedTemp}°C
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">Target: 22°C Comfort</span>
                </div>
              </div>

              {/* Subsystem Status Alert */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono space-y-2">
                <div className="flex items-center justify-between text-slate-300">
                  <span>Peltier Actuator Mode:</span>
                  <span className={`font-bold ${isCooling ? 'text-cyan-400' : isHeating ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {isCooling ? 'ACTIVE COOLING (PWM 82%)' : isHeating ? 'ACTIVE HEATING (PWM 75%)' : 'IDLE / BALANCED'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>PCM Buffer Absorption:</span>
                  <span className="text-amber-300 font-bold">
                    {ambientTemp > 28 ? 'LATENT HEAT STORING' : 'READY / DISSIPATED'}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-300">
                  <span>ESP32 Telemetry:</span>
                  <span className="text-cyan-300 flex items-center gap-1">
                    <Wifi className="w-3 h-3 text-cyan-400" />
                    BLE 5.0 Connected
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-white/10 text-[11px] font-mono text-slate-400 flex items-center justify-between">
              <span>Co-Inventor: Yogita Yadav</span>
              <span className="text-amber-400">Hardware Intellectual Property</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
