import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

export default function SpotlightCard({
  children,
  className = "",
  spotlightColor = "rgba(0, 242, 254, 0.18)",
  borderColor = "rgba(0, 242, 254, 0.4)",
  onClick,
  onMouseEnter,
  onMouseLeave
}) {
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0);

  const handleMouseMove = (e) => {
    if (!divRef.current) return;
    const rect = divRef.current.getBoundingClientRect();
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const handleFocus = () => {
    setOpacity(1);
  };

  const handleBlur = () => {
    setOpacity(0);
  };

  const handleMouseEnter = (e) => {
    setOpacity(1);
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = (e) => {
    setOpacity(0);
    if (onMouseLeave) onMouseLeave(e);
  };

  return (
    <motion.div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-slate-900/60 backdrop-blur-xl transition-all duration-300 hover:border-cyan-400/50 hover:shadow-2xl hover:shadow-cyan-950/40 ${className}`}
    >
      {/* Dynamic Cursor Spotlight Layer */}
      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity,
          background: `radial-gradient(500px circle at ${position.x}px ${position.y}px, ${spotlightColor}, transparent 50%)`,
        }}
      />
      {/* Border Follow Light */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl border transition-opacity duration-300"
        style={{
          opacity,
          borderColor: borderColor,
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
