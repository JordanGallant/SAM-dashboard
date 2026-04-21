"use client"

import { useEffect, useRef, useState } from "react"
import { useInView, useMotionValue, useSpring } from "framer-motion"

interface CountUpProps {
  to: number
  duration?: number
  className?: string
  format?: (n: number) => string
}

export function CountUp({ to, duration = 0.9, className, format }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, amount: 0.5 })
  const [display, setDisplay] = useState<string>(format ? format(0) : "0")
  const motionValue = useMotionValue(0)
  const spring = useSpring(motionValue, { damping: 30, stiffness: 110, duration: duration * 1000 })

  useEffect(() => {
    if (isInView) motionValue.set(to)
  }, [isInView, to, motionValue])

  useEffect(() => {
    return spring.on("change", (latest) => {
      const rounded = Math.round(latest)
      setDisplay(format ? format(rounded) : rounded.toString())
    })
  }, [spring, format])

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  )
}
