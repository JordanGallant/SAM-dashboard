import { NextResponse } from "next/server"

// Disabled per pilot feedback (#29). The email-with-file path duplicated the
// in-app download and confused users about what was canonical. Use the
// Download dropdown on the deal page instead.
export async function POST() {
  return NextResponse.json(
    {
      success: false,
      error: "Email delivery is disabled. Download the report from the deal page instead.",
    },
    { status: 410 }
  )
}
