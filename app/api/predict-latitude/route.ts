import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { diameter, velocity, angularVelocity, longitude } = body

    // Validate inputs
    if (
      typeof diameter !== "number" ||
      typeof velocity !== "number" ||
      typeof angularVelocity !== "number" ||
      typeof longitude !== "number"
    ) {
      return NextResponse.json({ error: "Invalid input parameters" }, { status: 400 })
    }

    // Simulate linear regression prediction for latitude
    const latitude =
      8.3 + diameter * 0.0006 + velocity * 1.8 + angularVelocity * 0.38 + longitude * 0.12 + (Math.random() - 0.5) * 8

    // Normalize latitude to -90 to 90 range
    const normalizedLatitude = Math.max(-90, Math.min(90, latitude))

    return NextResponse.json({
      latitude: Number(normalizedLatitude.toFixed(4)),
      confidence: 0.82 + Math.random() * 0.12,
    })
  } catch (error) {
    console.error("[v0] Latitude prediction error:", error)
    return NextResponse.json({ error: "Prediction failed" }, { status: 500 })
  }
}
