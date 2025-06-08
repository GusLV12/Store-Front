import { useEffect, useRef, useState } from 'react';

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
