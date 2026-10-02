"use client";

import { useEffect } from "react";
import {
  useMotionValue,
  useSpring,
  useTransform,
  motion,
  useReducedMotion,
} from "framer-motion";

interface AnimatedNumberProps {
  value: number;
  /** decimal places */
  decimals?: number;
  className?: string;
  suffix?: string;
  prefix?: string;
}

/** spring count-up that re-animates when `value` changes */
export function AnimatedNumber({
  value,
  decimals = 0,
  className,
  suffix = "",
  prefix = "",
}: AnimatedNumberProps) {
  const reduce = useReducedMotion();
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 90, damping: 20, mass: 0.6 });
  const text = useTransform(spring, (v) => {
    const n = decimals > 0 ? v.toFixed(decimals) : Math.round(v).toString();
    return `${prefix}${formatThousands(n)}${suffix}`;
  });

  useEffect(() => {
    if (reduce) {
      mv.jump(value);
    } else {
      mv.set(value);
    }
  }, [value, mv, reduce]);

  return <motion.span className={className}>{text}</motion.span>;
}

function formatThousands(s: string): string {
  const [int, frac] = s.split(".");
  const withSep = int.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return frac ? `${withSep}.${frac}` : withSep;
}
