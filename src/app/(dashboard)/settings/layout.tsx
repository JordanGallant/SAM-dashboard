"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ArrowLeft, Building2, CreditCard, ShieldCheck } from "lucide-react"

const tabs = [
  { href: "/settings/fund-profile", label: "Fund Profile", icon: Building2 },
  { href: "/settings/billing", label: "Billing", icon: CreditCard },
  { href: "/settings/security", label: "Security", icon: ShieldCheck },
]

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/deals"
          className="inline-flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Dealroom
        </Link>
        <p className="mt-2 text-[10px] font-mono uppercase tracking-widest text-primary">Account</p>
        <h1 className="mt-1 text-2xl font-bold font-heading">Settings</h1>
      </div>
      <nav className="border-b -mx-4 md:-mx-6 px-4 md:px-6">
        <ul className="flex items-center gap-1 overflow-x-auto">
          {tabs.map((t) => {
            const active = pathname === t.href || pathname.startsWith(t.href + "/")
            const Icon = t.icon
            return (
              <li key={t.href}>
                <Link
                  href={t.href}
                  className={`flex items-center gap-2 px-3 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors whitespace-nowrap ${
                    active
                      ? "border-primary text-foreground"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-muted"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  {t.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      <div>{children}</div>
    </div>
  )
}
