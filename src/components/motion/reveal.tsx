"use client"

import { motion, type Variants } from "framer-motion"
import type { ReactNode } from "react"

interface RevealProps {
  children: ReactNode
  delay?: number
  className?: string
  direction?: "up" | "left" | "right" | "none"
  amount?: number
}

export function Reveal({
  children,
  delay = 0,
  className,
  direction = "up",
  amount = 0.2,
}: RevealProps) {
  const offset =
    direction === "up"
      ? { y: 16, x: 0 }
      : direction === "left"
        ? { y: 0, x: -20 }
        : direction === "right"
          ? { y: 0, x: 20 }
          : { y: 0, x: 0 }

  const variants: Variants = {
    hidden: { opacity: 0, ...offset },
    visible: {
      opacity: 1,
      y: 0,
      x: 0,
      transition: { duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={variants}
      className={className}
    >
      {children}
    </motion.div>
  )
}

/**
 * Stagger children: pass each child wrapped in <RevealItem>.
 */
export function RevealGroup({
  children,
  className,
  stagger = 0.06,
  amount = 0.2,
}: {
  children: ReactNode
  className?: string
  stagger?: number
  amount?: number
}) {
  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren: 0.05 },
    },
  }

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount }}
      variants={container}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function RevealItem({ children, className }: { children: ReactNode; className?: string }) {
  const item: Variants = {
    hidden: { opacity: 0, y: 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <motion.div variants={item} className={className}>
      {children}
    </motion.div>
  )
}
