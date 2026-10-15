import React, { useState, useEffect, useRef } from 'react';

const GLYPHS = '01#_<>*/+∆~XYZQWERTY';

export default function TextScramble({
  text,
  className = "",
  triggerOnHover = true,
  autoStart = true
}) {
  const [displayText, setDisplayText] = useState(text);
  const frameRef = useRef(0);
  const isScramblingRef = useRef(false);

  const scramble = () => {
    if (isScramblingRef.current) return;
    isScramblingRef.current = true;
    let iteration = 0;
    const maxIterations = text.length * 2;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration / 2) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join('')
      );

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
        isScramblingRef.current = false;
      }
      iteration += 1;
    }, 25);
  };

  useEffect(() => {
    if (autoStart) {
      scramble();
    }
  }, [text]);

  return (
    <span
      className={className}
      onMouseEnter={() => {
        if (triggerOnHover) scramble();
      }}
    >
      {displayText}
    </span>
  );
}
