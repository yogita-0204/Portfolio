import React, { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [trailing, setTrailing] = useState({ x: -100, y: -100 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Only enable on desktop pointer devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let animId;
    let mouseX = -100;
    let mouseY = -100;
    let trailX = -100;
    let trailY = -100;

    const handleMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setPosition({ x: mouseX, y: mouseY });
      if (!isVisible) setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicked(true);
    const handleMouseUp = () => setIsClicked(false);

    const handleMouseOver = (e) => {
      const target = e.target;
      if (
        target.tagName === 'A' ||
        target.tagName === 'BUTTON' ||
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.closest('a') ||
        target.closest('button') ||
        target.classList.contains('cursor-pointer')
      ) {
        setIsHovered(true);
      } else {
        setIsHovered(false);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseover', handleMouseOver);

    // Smooth lerp for trailing ring
    const render = () => {
      trailX += (mouseX - trailX) * 0.2;
      trailY += (mouseY - trailY) * 0.2;
      setTrailing({ x: trailX, y: trailY });
      animId = requestAnimationFrame(render);
    };
    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseover', handleMouseOver);
    };
  }, [isVisible]);

  if (!isVisible) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer Magnetic Ring */}
      <div
        className={`fixed rounded-full border border-cyan-400/60 pointer-events-none transition-transform duration-75 ease-out ${
          isHovered
            ? 'w-12 h-12 -ml-6 -mt-6 bg-cyan-400/15 border-cyan-300 scale-125'
            : isClicked
            ? 'w-8 h-8 -ml-4 -mt-4 bg-cyan-400/30 scale-90'
            : 'w-8 h-8 -ml-4 -mt-4 bg-transparent'
        }`}
        style={{
          transform: `translate3d(${trailing.x}px, ${trailing.y}px, 0)`,
          boxShadow: isHovered ? '0 0 20px rgba(0, 242, 254, 0.4)' : 'none'
        }}
      />

      {/* Inner Glowing Center Dot */}
      <div
        className={`fixed rounded-full bg-cyan-400 pointer-events-none transition-transform duration-75 ${
          isClicked ? 'scale-150 bg-white' : 'scale-100'
        }`}
        style={{
          width: '6px',
          height: '6px',
          marginLeft: '-3px',
          marginTop: '-3px',
          transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
          boxShadow: '0 0 10px #00f2fe'
        }}
      />
    </div>
  );
}
