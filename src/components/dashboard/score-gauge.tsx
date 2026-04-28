"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

/**
 * Circular score gauge (0-100). Amber fill, stone track.
 * Shows the score in large mono type in the center.
 * Animates on mount.
 */
export function ScoreGauge({ score, size = 140 }: { score: number; size?: number }) {
  const [animated, setAnimated] = useState(false)
  const strokeWidth = 10
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const pct = Math.max(0, Math.min(100, score)) / 100
  const dash = circumference * pct

  // Traffic-light status (not brand): >=70 emerald, 40-69 amber, <40 red
  const color =
    score >= 70 ? "#059669" : score >= 40 ? "#D97706" : "#DC2626"

  useEffect(() => {
    const t = setTimeout(() => setAnimated(true), 50)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#E7E5E4"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={color}
          strokeWidth={strokeWidth}
          fill="none"
          strokeLinecap="round"
          initial={{ strokeDasharray: `0 ${circumference}` }}
          animate={{ strokeDasharray: animated ? `${dash} ${circumference}` : `0 ${circumference}` }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center leading-none">
        <motion.span
          key={score}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="text-4xl font-mono font-bold tabular-nums"
          style={{ color }}
        >
          {score}
        </motion.span>
        <span className="mt-1 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          / 100
        </span>
      </div>
    </div>
  )
}
