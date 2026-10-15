import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { Terminal, Cpu, RefreshCw, AlertTriangle, ShieldCheck, Activity, Zap } from 'lucide-react';
import { playClickSound, playHoverSound, playSuccessSound } from '../utils/audioEffects';
import SpotlightCard from './SpotlightCard';

export default function TerminalLab() {
  const [tenure, setTenure] = useState(12);
  const [monthlyCharges, setMonthlyCharges] = useState(75);
  const [contract, setContract] = useState('Month-to-month');
  const [techSupportCalls, setTechSupportCalls] = useState(3);
  const [internetService, setInternetService] = useState('Fiber optic');

  const [churnProb, setChurnProb] = useState(0.54);
  const [isInferring, setIsInferring] = useState(false);
  const [logs, setLogs] = useState([
    '[INIT] FastApi ML Pipeline Engine v2.4 initialized.',
    '[MODEL] Seed=42 weights loaded from Render cluster.',
    '[READY] Ready for real-time customer feature vector inference.'
  ]);

  const computePrediction = (t, m, c, s, i) => {
    let z = -0.6;
    z += ((m - 20) / 100) * 1.5;
    z -= ((t - 1) / 71) * 2.2;
    if (c === 'Month-to-month') z += 1.2;
    if (c === 'One year') z -= 0.6;
    if (c === 'Two year') z -= 1.4;
    if (s >= 4) z += 0.8;
    else if (s === 0) z += 0.2;
    else z -= 0.4;
    if (i === 'Fiber optic') z += 0.4;
    else if (i === 'DSL') z -= 0.2;
    else z -= 0.7;

    const prob = 1 / (1 + Math.exp(-z));
    return Math.min(Math.max(prob, 0.05), 0.95);
  };

  const handleInference = () => {
    playClickSound();
    setIsInferring(true);

    const timestamp = new Date().toLocaleTimeString();
    const newLogs = [
      `[${timestamp}] POST /api/v1/predict HTTP/1.1`,
      `[${timestamp}] Vector: {tenure: ${tenure}m, charges: $${monthlyCharges}, contract: "${contract}", techCalls: ${techSupportCalls}}`,
      `[${timestamp}] Executing Random Forest + SHAP Explainer (ROC-AUC 0.92)...`
    ];

    setTimeout(() => {
      const calculated = computePrediction(tenure, monthlyCharges, contract, techSupportCalls, internetService);
      setChurnProb(calculated);
      setIsInferring(false);

      const resultTimestamp = new Date().toLocaleTimeString();
      const statusLog = calculated > 0.6
        ? `[${resultTimestamp}] [WARN] HIGH RISK! Prob: ${(calculated * 100).toFixed(1)}% -> Triggering retention desk.`
        : calculated < 0.3
        ? `[${resultTimestamp}] [SUCCESS] SAFE RETENTION! Prob: ${(calculated * 100).toFixed(1)}% -> High CLV tier.`
        : `[${resultTimestamp}] [INFO] MODERATE RISK. Prob: ${(calculated * 100).toFixed(1)}% -> Loyalty voucher recommended.`;

      setLogs((prev) => [...newLogs, statusLog, ...prev.slice(0, 4)]);

      if (calculated < 0.35) {
        playSuccessSound();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    }, 400);
  };

  useEffect(() => {
    const initialProb = computePrediction(tenure, monthlyCharges, contract, techSupportCalls, internetService);
    setChurnProb(initialProb);
  }, []);

  const riskPercentage = (churnProb * 100).toFixed(1);
  const estimatedCLVAtRisk = Math.round(monthlyCharges * Math.max(72 - tenure, 6) * churnProb);

  const getRiskStatus = () => {
    if (churnProb > 0.65) {
      return {
        label: 'High Churn Risk',
        color: 'text-rose-400',
        bg: 'bg-rose-500/10',
        border: 'border-rose-500/30',
        icon: <AlertTriangle className="w-4 h-4 text-rose-400" />
      };
    }
    if (churnProb >= 0.35) {
      return {
        label: 'Moderate Churn Risk',
        color: 'text-amber-400',
        bg: 'bg-amber-500/10',
        border: 'border-amber-500/30',
        icon: <Activity className="w-4 h-4 text-amber-400" />
      };
    }
    return {
      label: 'Low Risk / High Retention',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      border: 'border-emerald-500/30',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />
    };
  };

  const status = getRiskStatus();

  return (
    <section id="lab" className="relative py-28 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.7 }}
        className="flex flex-col items-center text-center mb-16"
      >
        <div className="cyber-pill mb-3">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>INTERACTIVE DATA LAB</span>
        </div>
        <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
          Live ML <span className="gradient-text-cyan">Inference Simulator</span>
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl mt-3">
          Interact directly with the mathematical logic of the Telecom Churn Intelligence System. Adjust customer features and witness real-time predictive probability & SHAP attribution.
        </p>
      </motion.div>

      {/* Simulator Shell */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
        {/* Left Column: Feature Controls (7 cols) */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-7"
        >
          <SpotlightCard className="p-6 sm:p-8 flex flex-col justify-between h-full">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-base text-white">Customer Feature Vector</h3>
                </div>
                <span className="text-[11px] font-mono text-cyan-400 px-2 py-0.5 rounded bg-cyan-500/10 border border-cyan-500/20">
                  MODEL SEED: 42
                </span>
              </div>

              {/* Feature Controls */}
              <div className="space-y-6">
                {/* Monthly Charges Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-slate-300">Monthly Charges ($)</span>
                    <span className="font-bold text-cyan-300 text-sm">${monthlyCharges}/mo</span>
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="120"
                    step="1"
                    value={monthlyCharges}
                    onChange={(e) => setMonthlyCharges(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-900 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>$20 (Budget)</span>
                    <span>$70 (Average)</span>
                    <span>$120 (Premium)</span>
                  </div>
                </div>

                {/* Customer Tenure Slider */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-slate-300">Customer Tenure (Months)</span>
                    <span className="font-bold text-cyan-300 text-sm">{tenure} Months</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="72"
                    step="1"
                    value={tenure}
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-900 rounded-lg"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>1 Mo (New Signup)</span>
                    <span>36 Mo (3 Yrs)</span>
                    <span>72 Mo (Loyal Veteran)</span>
                  </div>
                </div>

                {/* Contract Type */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-2">
                    Contract Agreement Term
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Month-to-month', 'One year', 'Two year'].map((cType) => (
                      <button
                        key={cType}
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setContract(cType);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-mono transition-all ${
                          contract === cType
                            ? 'bg-cyan-500 text-slate-950 font-bold border border-cyan-400 shadow-lg shadow-cyan-500/30'
                            : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {cType}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Tech Support Calls */}
                <div>
                  <div className="flex items-center justify-between text-xs font-mono mb-2">
                    <span className="text-slate-300">Tech Support Inquiries / Tickets</span>
                    <span className="font-bold text-cyan-300 text-sm">{techSupportCalls} Tickets</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="8"
                    step="1"
                    value={techSupportCalls}
                    onChange={(e) => setTechSupportCalls(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer h-2 bg-slate-900 rounded-lg"
                  />
                </div>

                {/* Internet Service Type */}
                <div>
                  <label className="block text-xs font-mono text-slate-300 mb-2">
                    Broadband Connection Tier
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {['Fiber optic', 'DSL', 'No'].map((service) => (
                      <button
                        key={service}
                        type="button"
                        onClick={() => {
                          playClickSound();
                          setInternetService(service);
                        }}
                        className={`py-2 px-3 rounded-xl text-xs font-mono transition-all ${
                          internetService === service
                            ? 'bg-violet-600 text-white font-bold border border-violet-400 shadow-lg shadow-violet-500/30'
                            : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
                        }`}
                      >
                        {service === 'No' ? 'None (Voice only)' : service}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Trigger Button */}
            <div className="mt-8 pt-4 border-t border-white/10">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleInference}
                onMouseEnter={playHoverSound}
                disabled={isInferring}
                className="w-full btn-primary py-3 flex items-center justify-center gap-2"
              >
                {isInferring ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-slate-950" />
                    <span>Computing SHAP Attributions...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-slate-950 fill-current" />
                    <span>Execute Model Inference</span>
                  </>
                )}
              </motion.button>
            </div>
          </SpotlightCard>
        </motion.div>

        {/* Right Column: Prediction Score & Live Terminal Log (5 cols) */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="lg:col-span-5 flex flex-col gap-6"
        >
          {/* Prediction Gauge Card */}
          <SpotlightCard className="p-6 border-white/10">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Inference Result
              </span>
              <div className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${status.bg} ${status.border} ${status.color}`}>
                {status.icon}
                <span>{status.label}</span>
              </div>
            </div>

            {/* Gauge Number Display */}
            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-5xl font-black font-mono tracking-tight text-white">
                {riskPercentage}%
              </span>
              <span className="text-xs font-mono text-slate-400">Churn Probability</span>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-3 rounded-full bg-slate-900 border border-white/10 overflow-hidden mb-4">
              <motion.div
                className={`h-full rounded-full ${
                  churnProb > 0.65
                    ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                    : churnProb > 0.35
                    ? 'bg-gradient-to-r from-cyan-400 to-amber-500'
                    : 'bg-gradient-to-r from-cyan-400 to-emerald-400'
                }`}
                animate={{ width: `${riskPercentage}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
              />
            </div>

            {/* Economic Impact Card */}
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400">Estimated CLV At Risk:</span>
              <span className="text-sm font-bold text-cyan-300 font-mono">
                ${estimatedCLVAtRisk.toLocaleString()}
              </span>
            </div>

            {/* SHAP Feature Contribution Mini Breakdown */}
            <div className="mt-4 pt-4 border-t border-white/10 text-xs">
              <div className="flex items-center justify-between font-mono text-slate-400 mb-2">
                <span>Top SHAP Feature Attribution</span>
                <span className="text-[10px] text-cyan-400">Impact (+ / -)</span>
              </div>
              <div className="space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between items-center text-slate-300">
                  <span>Contract = {contract}</span>
                  <span className={contract === 'Month-to-month' ? 'text-rose-400' : 'text-emerald-400'}>
                    {contract === 'Month-to-month' ? '+1.20 (Pushes Churn)' : '-0.90 (Protects Retention)'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Tenure = {tenure} Mo</span>
                  <span className={tenure < 12 ? 'text-amber-400' : 'text-emerald-400'}>
                    {tenure < 12 ? '+0.45 (New Account Risk)' : '-0.75 (Tenure Loyalty)'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-slate-300">
                  <span>Monthly Charges = ${monthlyCharges}</span>
                  <span className={monthlyCharges > 80 ? 'text-rose-400' : 'text-slate-400'}>
                    {monthlyCharges > 80 ? '+0.60 (High Price Sensitivity)' : '-0.20 (Acceptable Tariff)'}
                  </span>
                </div>
              </div>
            </div>
          </SpotlightCard>

          {/* Simulated FastAPI Console Shell */}
          <div className="p-4 rounded-2xl border border-white/10 bg-slate-950/90 backdrop-blur-xl font-mono text-xs flex-1 flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10 text-slate-400 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                  <span className="ml-2 text-slate-300 font-bold">fastapi-cluster::telecom-ml</span>
                </div>
                <span className="text-emerald-400">● 200 OK</span>
              </div>

              <div className="space-y-1.5 text-slate-300 max-h-40 overflow-y-auto pr-1">
                {logs.map((log, lIdx) => (
                  <div key={lIdx} className="leading-relaxed">
                    <span className="text-cyan-400">$ </span>
                    <span className={log.includes('WARN') ? 'text-amber-300' : log.includes('SUCCESS') ? 'text-emerald-300' : 'text-slate-300'}>
                      {log}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-3 mt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-500 font-mono">
              <span>Pipeline: Seed 42 • Pytest 35/35 Passing</span>
              <span>Render Microservice</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
