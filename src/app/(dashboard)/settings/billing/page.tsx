import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink } from "lucide-react"

export default function BillingPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-xl font-bold">Billing & Subscription</h1>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            Current Plan
            <Badge className="bg-amber-100 text-amber-700">Professional</Badge>
          </CardTitle>
          <CardDescription>EUR 149/month</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Deals this month</p>
              <p className="font-medium">3 / 25</p>
            </div>
            <div>
              <p className="text-muted-foreground">Next billing date</p>
              <p className="font-medium">May 10, 2026</p>
            </div>
            <div>
              <p className="text-muted-foreground">Users</p>
              <p className="font-medium">1 / 1</p>
            </div>
            <div>
              <p className="text-muted-foreground">Trial status</p>
              <p className="font-medium">Expired</p>
            </div>
          </div>
          <Button variant="outline">
            <ExternalLink className="mr-2 h-4 w-4" />
            Manage Subscription (Stripe)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
