import React, { useEffect, useState, useRef } from 'react';

export default function AnimatedCounter({ value, duration = 1600 }) {
  const [displayValue, setDisplayValue] = useState('0');
  const [hasAnimated, setHasAnimated] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          startCounting();
        }
      },
      { threshold: 0.2 }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated, value]);

  const startCounting = () => {
    // Extract numerical part and prefixes/suffixes
    const str = String(value);
    const match = str.match(/([^\d.]*)([\d.]+)([^\d.]*)/);
    if (!match) {
      setDisplayValue(value);
      return;
    }

    const prefix = match[1] || '';
    const targetNum = parseFloat(match[2]);
    const suffix = match[3] || '';
    const isDecimal = match[2].includes('.');
    const decimals = isDecimal ? match[2].split('.')[1].length : 0;

    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = targetNum * easeProgress;

      setDisplayValue(`${prefix}${current.toFixed(decimals)}${suffix}`);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setDisplayValue(str);
      }
    };

    requestAnimationFrame(animate);
  };

  return <span ref={elementRef}>{displayValue}</span>;
}
