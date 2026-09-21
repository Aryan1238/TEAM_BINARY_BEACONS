import { useState, useEffect, useRef } from 'react';

/**
 * Smooth requestAnimationFrame count-up hook
 * @param {number} targetValue - Destination number to count up/down to
 * @param {number} duration - Animation duration in milliseconds (default 800ms)
 * @returns {number} Animated current value
 */
export function useCountUp(targetValue = 0, duration = 800) {
  const [displayValue, setDisplayValue] = useState(targetValue);
  const startValueRef = useRef(targetValue);
  const startTimeRef = useRef(null);
  const frameRef = useRef(null);

  useEffect(() => {
    const startVal = displayValue;
    const endVal = Number(targetValue) || 0;
    if (startVal === endVal) return;

    startValueRef.current = startVal;
    startTimeRef.current = null;

    const easeOutQuad = (t) => t * (2 - t);

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOutQuad(progress);

      const current = Math.round(startVal + (endVal - startVal) * easedProgress);
      setDisplayValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [targetValue, duration]);

  return displayValue;
}
