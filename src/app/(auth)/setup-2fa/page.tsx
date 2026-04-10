import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export default function Setup2FAPage() {
  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle>Set Up Two-Factor Authentication</CardTitle>
        <CardDescription>Scan the QR code with Google Authenticator or Authy</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="mx-auto flex h-48 w-48 items-center justify-center rounded-lg border bg-muted text-sm text-muted-foreground">
          QR Code Placeholder
        </div>
        <Separator />
        <div className="space-y-2">
          <Label htmlFor="code">Enter 6-digit code</Label>
          <Input id="code" placeholder="000000" maxLength={6} className="text-center font-mono text-lg tracking-widest" />
        </div>
        <div className="flex gap-2">
          <Link href="/deals" className={buttonVariants({ variant: "outline", className: "flex-1" })}>Skip for now</Link>
          <Link href="/deals" className={buttonVariants({ className: "flex-1" })}>Verify & Enable</Link>
        </div>
      </CardContent>
    </Card>
  )
}
