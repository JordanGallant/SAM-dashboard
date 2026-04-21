"use client"

import { motion } from "framer-motion"

export function AnimatedBar({
  percent,
  className,
  delay = 0,
}: {
  percent: number
  className?: string
  delay?: number
}) {
  return (
    <motion.div
      initial={{ width: "0%" }}
      whileInView={{ width: `${percent}%` }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    />
  )
}
