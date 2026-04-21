"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"
import { DEAL_STAGES } from "@/lib/constants"
import { createDeal } from "@/app/actions/deals"
import type { DealStage } from "@/lib/types/deal"

interface DealCreateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated?: (dealId: string) => void
}

export function DealCreateDialog({ open, onOpenChange, onCreated }: DealCreateDialogProps) {
  const [companyName, setCompanyName] = useState("")
  const [stage, setStage] = useState<DealStage>("Seed")
  const [source, setSource] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!companyName.trim()) return
    setLoading(true)
    setError("")

    const result = await createDeal({ companyName, stage, source })

    if (result.error) {
      setError(result.error)
      setLoading(false)
      return
    }

    // Reset form
    setCompanyName("")
    setSource("")
    setStage("Seed")
    setLoading(false)

    if (result.deal && onCreated) {
      onCreated(result.deal.id)
    } else {
      onOpenChange(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Deal</DialogTitle>
          <p className="text-sm text-muted-foreground">
            After creating, you&apos;ll upload the pitch deck and run analysis.
          </p>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && <div className="rounded-md bg-red-50 p-3 text-sm text-red-700">{error}</div>}
          <div className="space-y-2">
            <Label htmlFor="company">Company Name</Label>
            <Input id="company" placeholder="e.g. Acme Corp" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required autoFocus />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stage">Investment Stage</Label>
            <Select value={stage} onValueChange={(v) => setStage(v as DealStage)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DEAL_STAGES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="source">Source / Referral (optional)</Label>
            <Input id="source" placeholder="e.g. Partner referral, conference" value={source} onChange={(e) => setSource(e.target.value)} />
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Deal
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
