"use client"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button, buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { DEAL_STAGES, SECTORS, GEOS } from "@/lib/constants"

const steps = ["Fund Details", "Investment Focus", "Portfolio"]

export default function SetupPage() {
  const [step, setStep] = useState(0)

  return (
    <div className="space-y-4">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-medium ${
              i <= step ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {i + 1}
            </div>
            <span className={`text-sm ${i <= step ? "font-medium" : "text-muted-foreground"}`}>{s}</span>
            {i < steps.length - 1 && <div className="h-px w-8 bg-border" />}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{steps[step]}</CardTitle>
          <CardDescription>
            {step === 0 && "Tell us about your fund"}
            {step === 1 && "What do you invest in?"}
            {step === 2 && "Add your current portfolio companies"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {step === 0 && (
            <>
              <div className="space-y-2">
                <Label htmlFor="fund-name">Fund Name</Label>
                <Input id="fund-name" placeholder="e.g. Horizon Ventures" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" placeholder="https://yourfund.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="thesis">Investment Thesis</Label>
                <Textarea id="thesis" placeholder="What do you look for in investments?" rows={4} />
              </div>
            </>
          )}
          {step === 1 && (
            <>
              <div className="space-y-2">
                <Label>Stage Focus</Label>
                <div className="flex flex-wrap gap-3">
                  {DEAL_STAGES.map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm">
                      <Checkbox /> {s}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sector Focus</Label>
                <div className="flex flex-wrap gap-3">
                  {SECTORS.map((s) => (
                    <label key={s} className="flex items-center gap-2 text-sm">
                      <Checkbox /> {s}
                    </label>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Geography Focus</Label>
                <div className="flex flex-wrap gap-3">
                  {GEOS.map((g) => (
                    <label key={g} className="flex items-center gap-2 text-sm">
                      <Checkbox /> {g}
                    </label>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="ticket-min">Min Ticket (EUR)</Label>
                  <Input id="ticket-min" type="number" placeholder="250,000" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ticket-max">Max Ticket (EUR)</Label>
                  <Input id="ticket-max" type="number" placeholder="2,000,000" />
                </div>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <p className="text-sm text-muted-foreground">
                Add portfolio companies to enable conflict checking. You can skip this and add them later.
              </p>
              {[0, 1, 2].map((i) => (
                <Input key={i} placeholder={`Company ${i + 1}`} />
              ))}
              <Button variant="outline" size="sm" className="w-full">+ Add another</Button>
            </>
          )}

          <div className="flex gap-2 pt-2">
            {step > 0 && (
              <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
            )}
            <div className="flex-1" />
            <Link href="/deals" className={buttonVariants({ variant: "ghost" })}>Skip</Link>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep(step + 1)}>Next</Button>
            ) : (
              <Link href="/deals" className={buttonVariants()}>Complete Setup</Link>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
