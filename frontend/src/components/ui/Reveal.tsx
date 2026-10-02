"use client";

import {
  motion,
  useReducedMotion,
  type HTMLMotionProps,
  type Variants,
} from "framer-motion";
import { cn } from "./cn";

const EASE = [0.22, 1, 0.36, 1] as const;

interface RevealProps extends HTMLMotionProps<"div"> {
  /** stagger children that are also motion elements */
  stagger?: boolean;
  delay?: number;
}

/** fade-up on scroll into view, once. Respects reduced motion. */
export function Reveal({
  stagger = false,
  delay = 0,
  className,
  children,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <div className={className}>{children as React.ReactNode}</div>;
  }

  const variants: Variants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: stagger
        ? { staggerChildren: 0.08, delayChildren: delay }
        : { duration: 0.5, ease: EASE, delay },
    },
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={variants}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export const revealChild: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE } },
};

export function RevealItem({
  className,
  children,
  ...rest
}: HTMLMotionProps<"div">) {
  const reduce = useReducedMotion();
  if (reduce) {
    return <div className={className}>{children as React.ReactNode}</div>;
  }
  return (
    <motion.div variants={revealChild} className={cn(className)} {...rest}>
      {children}
    </motion.div>
  );
}
