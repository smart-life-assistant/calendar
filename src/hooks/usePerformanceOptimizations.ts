"use client";

import { useCallback, useRef, useEffect } from "react";

/**
 * Custom hook for debouncing function calls
 * Helps reduce INP by limiting expensive operations
 */
export function useDebounce<T extends (...args: never[]) => unknown>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  // Update callback ref when callback changes
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callbackRef.current(...args);
      }, delay);
    },
    [delay],
  );
}

/**
 * Custom hook for throttling function calls
 * Ensures function is called at most once per specified interval
 */
export function useThrottle<T extends (...args: never[]) => unknown>(
  callback: T,
  delay: number,
): (...args: Parameters<T>) => void {
  const lastRan = useRef(0); // Initialize with 0 instead of Date.now()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback(
    (...args: Parameters<T>) => {
      const now = Date.now();
      // Initialize lastRan on first call if it's still 0
      if (lastRan.current === 0) {
        lastRan.current = now;
      }
      const timeSinceLastRun = now - lastRan.current;

      if (timeSinceLastRun >= delay) {
        callbackRef.current(...args);
        lastRan.current = now;
      } else {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
          callbackRef.current(...args);
          lastRan.current = Date.now();
        }, delay - timeSinceLastRun);
      }
    },
    [delay],
  );
}

/**
 * Hook to handle click events with requestIdleCallback
 * Improves INP by deferring non-critical work
 */
export function useIdleCallback<T extends (...args: never[]) => unknown>(
  callback: T,
): (...args: Parameters<T>) => void {
  const callbackRef = useRef(callback);

  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  return useCallback((...args: Parameters<T>) => {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(() => {
        callbackRef.current(...args);
      });
    } else {
      // Fallback for browsers that don't support requestIdleCallback
      setTimeout(() => {
        callbackRef.current(...args);
      }, 1);
    }
  }, []);
}

/**
 * Hook for optimized resize handling
 */
export function useOptimizedResize(
  callback: () => void,
  delay: number = 150,
): void {
  const debouncedCallback = useDebounce(callback, delay);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("resize", debouncedCallback, { passive: true });

    return () => {
      window.removeEventListener("resize", debouncedCallback);
    };
  }, [debouncedCallback]);
}

/**
 * Hook for passive event listeners
 * Improves scrolling performance
 */
export function usePassiveScroll(
  callback: (event: Event) => void,
  delay: number = 100,
): void {
  const throttledCallback = useThrottle(callback, delay);

  useEffect(() => {
    if (typeof window === "undefined") return;

    window.addEventListener("scroll", throttledCallback, { passive: true });

    return () => {
      window.removeEventListener("scroll", throttledCallback);
    };
  }, [throttledCallback]);
}
