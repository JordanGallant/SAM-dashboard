"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (!localStorage.getItem("sam-cookie-choice")) {
      setVisible(true)
    }
  }, [])

  function choose(value: "all" | "essential") {
    localStorage.setItem("sam-cookie-choice", value)
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-md z-50 rounded-lg border bg-background shadow-xl p-4">
      <p className="text-sm text-muted-foreground">
        We use essential cookies to operate this site. No advertising, no tracking.
      </p>
      <div className="mt-3 flex gap-2">
        <Button size="sm" onClick={() => choose("all")}>Accept</Button>
        <Button size="sm" variant="outline" onClick={() => choose("essential")}>Only essential</Button>
      </div>
    </div>
  )
}
