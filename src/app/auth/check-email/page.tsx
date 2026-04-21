import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { buttonVariants } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { Suspense } from "react"

function CheckEmailContent({ email }: { email: string | null }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Mail className="h-6 w-6 text-primary" />
          </div>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            {email ? (
              <>
                We sent a confirmation link to <span className="font-medium text-foreground">{email}</span>
              </>
            ) : (
              "We sent you a confirmation link"
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-muted-foreground">
            Click the link in the email to verify your account. Then you&apos;ll be redirected to complete your setup.
          </p>
          <div className="rounded-md bg-muted/50 p-3 text-xs text-muted-foreground">
            Didn&apos;t get it? Check your spam folder or try registering again.
          </div>
          <Link href="/login" className={buttonVariants({ variant: "outline", className: "w-full" })}>
            Back to sign in
          </Link>
        </CardContent>
      </Card>
    </div>
  )
}

export default async function CheckEmailPage({
  searchParams,
}: {
  searchParams: Promise<{ email?: string }>
}) {
  const { email } = await searchParams
  return (
    <Suspense>
      <CheckEmailContent email={email ?? null} />
    </Suspense>
  )
}
