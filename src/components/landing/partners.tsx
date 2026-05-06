import Image from "next/image"
import { Reveal } from "@/components/motion/reveal"

const partners = [
  {
    name: "Green Whale Smart Capital",
    href: "https://www.green-whale.nl",
    logo: "/partners/green-whale.png",
    // Logo art is white-on-transparent (intended for dark navs), so on this
    // light section we render it inverted via filter for legibility.
    invertOnLight: true,
  },
  {
    name: "Heliphant",
    href: null,
    logo: "/partners/heliphant.png",
    invertOnLight: false,
  },
  {
    name: "Spotlight Invest",
    href: "https://www.spotlightinvest.co",
    logo: "/partners/spotlight-invest.png",
    invertOnLight: false,
  },
]

export function Partners() {
  return (
    <section className="relative py-16 md:py-20 border-t bg-white">
      <div className="mx-auto max-w-6xl px-4">
        <Reveal>
          <p className="text-center text-[11px] font-mono uppercase tracking-[0.2em] text-muted-foreground/80">
            Trusted by European VC funds
          </p>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 items-center gap-y-10 gap-x-12">
          {partners.map((p) => {
            const inner = (
              <div className="flex items-center justify-center h-14 grayscale opacity-70 hover:opacity-100 hover:grayscale-0 transition">
                <Image
                  src={p.logo}
                  alt={p.name}
                  width={180}
                  height={56}
                  className={`max-h-12 w-auto object-contain ${p.invertOnLight ? "invert" : ""}`}
                  unoptimized
                />
              </div>
            )
            return p.href ? (
              <a
                key={p.name}
                href={p.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={p.name}
              >
                {inner}
              </a>
            ) : (
              <div key={p.name} aria-label={p.name}>
                {inner}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
