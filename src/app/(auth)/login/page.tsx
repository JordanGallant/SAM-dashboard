import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { BarChart3 } from "lucide-react"

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <BarChart3 className="h-5 w-5" />
        </div>
        <CardTitle>Welcome back</CardTitle>
        <CardDescription>Sign in to your SAM account</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="you@fund.com" />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              <Link href="/reset-password" className="text-xs text-muted-foreground hover:underline">Forgot password?</Link>
            </div>
            <Input id="password" type="password" />
          </div>
          <Link href="/deals" className={buttonVariants({ className: "w-full" })}>Sign In</Link>
        </form>
        <p className="mt-4 text-center text-sm text-muted-foreground">
          No account? <Link href="/register" className="font-medium text-foreground hover:underline">Start free trial</Link>
        </p>
      </CardContent>
    </Card>
  )
}
