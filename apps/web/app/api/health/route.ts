import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  // BUG: This always returns healthy even if database is down
  return NextResponse.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    // BUG: version is hardcoded instead of reading from package.json
    version: "1.0.0"
  });
}
