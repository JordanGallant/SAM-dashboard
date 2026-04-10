"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { mockFundProfile } from "@/lib/mock-data/fund-profile"

export default function FundProfilePage() {
  const fund = mockFundProfile

  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-bold">Fund Profile</h1>

      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Fund Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Fund Name</Label>
            <Input defaultValue={fund.name} />
          </div>
          <div className="space-y-2">
            <Label>Website</Label>
            <Input defaultValue={fund.website} />
          </div>
          <div className="space-y-2">
            <Label>Investment Thesis</Label>
            <Textarea defaultValue={fund.thesis} rows={4} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-sm font-medium">Investment Focus</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label className="text-xs text-muted-foreground">Stage Focus</Label>
            <div className="mt-1 flex flex-wrap gap-1">
              {fund.stageFocus.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Sector Focus</Label>
            <div className="mt-1 flex flex-wrap gap-1">
              {fund.sectorFocus.map((s) => <Badge key={s} variant="secondary">{s}</Badge>)}
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Geography</Label>
            <div className="mt-1 flex flex-wrap gap-1">
              {fund.geoFocus.map((g) => <Badge key={g} variant="secondary">{g}</Badge>)}
            </div>
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Ticket Size</Label>
            <p className="text-sm">EUR {(fund.ticketSizeMin / 1000).toFixed(0)}K – EUR {(fund.ticketSizeMax / 1000000).toFixed(0)}M</p>
          </div>
        </CardContent>
      </Card>

      <Button>Save Changes</Button>
    </div>
  )
}
