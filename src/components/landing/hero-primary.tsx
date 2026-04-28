"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
}
const item = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } },
}

const HERO_LAPTOP_IMAGE = "/design/hero-img.png"

export function HeroPrimary() {
  const router = useRouter()
  const [email, setEmail] = useState("")

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const q = email.trim() ? `?email=${encodeURIComponent(email.trim())}` : ""
    router.push(`/register${q}`)
  }

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#050B15] via-[#0A1A14] to-[#0F3D2E] text-white">
      {/* Ambient glow */}
      <div className="absolute -top-48 -right-48 h-[36rem] w-[36rem] rounded-full bg-primary/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/3 -left-40 h-96 w-96 rounded-full bg-[#D4FF6B]/08 blur-3xl pointer-events-none" />

      <div className="relative mx-auto max-w-6xl px-4 pt-14 md:pt-20 pb-20 md:pb-24">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={container}
          className="grid lg:grid-cols-[1fr_1.1fr] gap-10 lg:gap-14 items-center"
        >
          {/* LEFT — copy + email form */}
          <div>
            <motion.h1
              variants={item}
              className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-[-0.03em] font-heading leading-[0.98] text-white"
            >
              Time is money.
              <br />
              <span className="bg-gradient-to-r from-[#D4FF6B] via-[#C8F25F] to-[#7FD9AA] bg-clip-text text-transparent">
                Save both.
              </span>
            </motion.h1>

            <motion.p variants={item} className="mt-6 text-base md:text-lg text-white/65 max-w-md leading-relaxed">
              Structured investment memos, scored across five domains — IC-ready in twelve minutes.
            </motion.p>

            {/* Inline email form */}
            <motion.form
              variants={item}
              onSubmit={onSubmit}
              className="mt-8 flex flex-col sm:flex-row items-stretch gap-2 rounded-2xl bg-white/[0.04] backdrop-blur border border-white/10 p-1.5 max-w-lg focus-within:border-[#D4FF6B]/40 focus-within:bg-white/[0.06] transition-all"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="What's your work email?"
                className="flex-1 bg-transparent text-white placeholder:text-white/40 px-4 py-3 text-sm outline-none"
              />
              <button
                type="submit"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-[#D4FF6B] hover:bg-[#E0FF80] text-[#050B15] px-5 py-3 text-sm font-semibold shadow-lg shadow-[#D4FF6B]/20 hover:shadow-xl hover:shadow-[#D4FF6B]/30 transition-all"
              >
                Get started for free
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </motion.form>

            <motion.div variants={item} className="mt-5">
              <Link
                href="/sample"
                className="group inline-flex items-center gap-1.5 text-sm font-semibold text-white/70 hover:text-white transition-colors"
              >
                Explore a sample memo
                <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </div>

          {/* RIGHT — monitor mockup (transparent PNG, no background) */}
          <motion.div variants={item} className="relative">
            <div className="relative aspect-[4/3] flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={HERO_LAPTOP_IMAGE}
                alt="Sam dashboard on a monitor"
                className="relative w-full h-full object-contain"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
