// Optimized Framer Motion configuration for better INP
// Reduce animation complexity and improve responsiveness

// Reduced animation settings for better performance
export const reducedMotionVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.15 }, // Faster transitions
};

// Optimized container animations with reduced stagger
export const optimizedContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.01, // Minimal stagger for better performance
      delayChildren: 0,
    },
  },
};

// Simplified item animations
export const optimizedItemVariants = {
  hidden: { opacity: 0, y: 5 }, // Smaller movement
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "tween", // Tween is faster than spring
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

// Button interaction variants - optimized for INP
export const buttonVariants = {
  whileHover: { scale: 1.02 }, // Reduced scale
  whileTap: { scale: 0.98 },
  transition: { duration: 0.1, ease: "easeInOut" },
};

// Modal animation variants - faster for better perceived performance
export const modalVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.15,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    scale: 0.98,
    transition: {
      duration: 0.1,
      ease: "easeIn",
    },
  },
};

// Background animations - lower priority with will-change
export const backgroundAnimationConfig = {
  animate: {
    scale: [1, 1.1, 1],
    opacity: [0.3, 0.4, 0.3],
  },
  transition: {
    duration: 15, // Slower, less intrusive
    repeat: Infinity,
    ease: "easeInOut",
  },
  style: {
    willChange: "transform, opacity",
  },
};

// Layout animation config for smooth transitions
export const layoutTransitionConfig = {
  type: "tween" as const,
  duration: 0.2,
  ease: "easeInOut",
};

// Prefers reduced motion check
export const shouldReduceMotion = () => {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
};

// Get optimized animation config based on user preference
export const getAnimationConfig = () => {
  const reduceMotion = shouldReduceMotion();

  return {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        duration: reduceMotion ? 0.01 : 0.2,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: reduceMotion ? 0.01 : 0.15,
      },
    },
  };
};

// Optimized scroll animation config
export const scrollAnimationConfig = {
  viewport: {
    once: true, // Only animate once
    margin: "-50px", // Start animation when 50px from viewport
    amount: 0.3, // Trigger when 30% visible
  },
  transition: {
    duration: 0.3,
    ease: "easeOut",
  },
};

// Calendar-specific optimizations
export const calendarDayHoverConfig = {
  scale: 1.02, // Minimal scale
  transition: {
    duration: 0.1,
    ease: "easeOut",
  },
};

export const calendarDayTapConfig = {
  scale: 0.98,
  transition: {
    duration: 0.05,
    ease: "easeIn",
  },
};

// Header animation config - simplified
export const headerAnimationConfig = {
  initial: { opacity: 0, y: -10 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
};

// Default transition config for all motion components
export const defaultTransition = {
  duration: 0.2,
  ease: "easeInOut",
};

// Disable animations on low-end devices
export const disableAnimationsOnLowEnd = () => {
  if (typeof window === "undefined") return false;

  // Check for low-end device indicators
  const isLowEnd =
    (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2) ||
    /Android.*(?:Chrome\/[1-5]\d|Chrome\/60)/.test(navigator.userAgent);

  return isLowEnd;
};
