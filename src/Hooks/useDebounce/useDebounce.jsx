import { useEffect, useRef, useState } from 'react';

/**
 * Custom React hook for debouncing actions natively.
 *
 * This hook allows you to execute an action after a specified delay,
 * cancelling any previous pending execution if called again before the delay expires.
 * Useful for search inputs, auto-save, or actions that should not be triggered too frequently.
 *
 * @param {number} delay - Debounce delay in milliseconds. Default is 2000 ms.
 * @returns {{
 *   triggerAction: () => Promise<boolean>
 * }} An object with the `triggerAction` method, which returns a Promise that resolves after the delay.
 *
 * @example
 * const { triggerAction } = useNativeDebounce(500);
 *
 * const handleInput = async () => {
 *   await triggerAction();
 *   // Action after debounce
 * };
 */

export const useNativeDebounce = (delay = 2000) => {
  const timerRef = useRef(null);
  const [isCounting, setIsCounting] = useState(false);

  const triggerAction = () => {
    return new Promise((resolve) => {
      if (isCounting) {
        clearTimeout(timerRef.current);
      }
      setIsCounting(true);
      timerRef.current = setTimeout(() => {
        setIsCounting(false);
        clearTimeout(timerRef.current);
        resolve(true);
      }, delay);
    });
  };

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    return () => {
      clearTimeout(timerRef.current);
    };
  }, []);

  return {
    triggerAction,
  };
};
