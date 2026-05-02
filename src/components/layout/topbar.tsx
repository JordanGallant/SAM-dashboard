"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Settings, LogOut, Building2 } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/client"
import { useFundProfile } from "@/hooks/use-fund-profile"

export function Topbar({ showSidebarTrigger = true }: { showSidebarTrigger?: boolean }) {
  const router = useRouter()
  const { fund } = useFundProfile()

  async function handleLogout() {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="flex h-14 items-center gap-3 border-b border-[#0F3D2E]/10 bg-white/90 backdrop-blur px-4 sticky top-0 z-30">
      {showSidebarTrigger && (
        <>
          <SidebarTrigger className="text-[#0F3D2E] hover:bg-[#F4FAF6]" />
          <span className="h-5 w-px bg-[#0F3D2E]/10" aria-hidden />
        </>
      )}

      {/* Fund identity chip */}
      <Link
        href="/deals"
        className="flex items-center gap-2 rounded-full border border-[#0F3D2E]/10 bg-white px-3 py-1 hover:border-[#0F3D2E]/25 hover:bg-[#F4FAF6] transition-colors"
        aria-label="Back to dealroom"
      >
        <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-[#0F3D2E] to-[#00A86B]">
          <Building2 className="h-3 w-3 text-[#D4FF6B]" />
        </div>
        <span className="text-[11px] font-mono font-semibold uppercase tracking-widest text-[#0A2E22]">
          {fund?.name ?? "Your Fund"}
        </span>
      </Link>

      <div className="ml-auto flex items-center gap-1">
        <Link
          href="/settings"
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#0F3D2E]/70 hover:bg-[#F4FAF6] hover:text-[#0F3D2E] transition-colors"
          aria-label="Settings"
        >
          <Settings className="h-4 w-4" />
        </Link>
        <button
          onClick={handleLogout}
          className="flex h-8 w-8 items-center justify-center rounded-full text-[#0F3D2E]/70 hover:bg-red-50 hover:text-red-600 transition-colors"
          aria-label="Log out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>
    </header>
  )
}
