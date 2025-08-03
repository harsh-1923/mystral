import { useRef, useCallback } from "react";

interface TapPosition {
  x: number;
  y: number;
}

interface UseDoubleTapOptions {
  onDoubleTap?: (position: TapPosition) => void;
  onSingleTap?: (position: TapPosition) => void;
  threshold?: number; // Time threshold for double tap detection (default: 300ms)
  maxDelay?: number; // Maximum delay between taps (default: 300ms)
}

export const useDoubleTap = (
  ref: React.RefObject<HTMLElement | null>,
  options: UseDoubleTapOptions = {}
) => {
  const { onDoubleTap, onSingleTap, threshold = 300, maxDelay = 300 } = options;

  const lastTapTime = useRef<number>(0);
  const tapCount = useRef<number>(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastTapPosition = useRef<TapPosition>({ x: 0, y: 0 });

  const handleTap = useCallback(
    (position: TapPosition) => {
      const now = Date.now();
      const timeSinceLastTap = now - lastTapTime.current;

      // Reset if too much time has passed
      if (timeSinceLastTap > maxDelay) {
        tapCount.current = 0;
      }

      tapCount.current++;
      lastTapTime.current = now;
      lastTapPosition.current = position;

      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Set timeout to determine if this is a single or double tap
      timeoutRef.current = setTimeout(() => {
        if (tapCount.current === 1) {
          // Single tap
          onSingleTap?.(lastTapPosition.current);
        } else if (tapCount.current >= 2) {
          // Double tap
          onDoubleTap?.(lastTapPosition.current);
        }
        tapCount.current = 0;
      }, threshold);
    },
    [onDoubleTap, onSingleTap, threshold, maxDelay]
  );

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      // Prevent default behavior to avoid conflicts
      e.preventDefault();

      const touch = e.touches[0];
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const position: TapPosition = {
        x: touch.clientX - rect.left,
        y: touch.clientY - rect.top,
      };

      handleTap(position);
    },
    [handleTap]
  );

  const handleClick = useCallback(
    (e: MouseEvent) => {
      // Prevent default behavior to avoid conflicts
      e.preventDefault();

      const rect = (e.target as HTMLElement).getBoundingClientRect();
      const position: TapPosition = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      handleTap(position);
    },
    [handleTap]
  );

  // Attach event listeners to the ref element
  const attachListeners = useCallback(() => {
    const element = ref.current;
    if (!element) return;

    // For touch devices
    element.addEventListener("touchstart", handleTouchStart, {
      passive: false,
    });

    // For mouse devices
    element.addEventListener("click", handleClick, { passive: false });

    return () => {
      element.removeEventListener("touchstart", handleTouchStart);
      element.removeEventListener("click", handleClick);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [ref, handleTouchStart, handleClick]);

  // Cleanup function
  const cleanup = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, []);

  return {
    attachListeners,
    cleanup,
  };
};
