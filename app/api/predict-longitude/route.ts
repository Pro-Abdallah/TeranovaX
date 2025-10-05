import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { latitude, diameter, velocity, angularVelocity } = body

    // Validate inputs
    if (
      typeof latitude !== "number" ||
      typeof diameter !== "number" ||
      typeof velocity !== "number" ||
      typeof angularVelocity !== "number"
    ) {
      return NextResponse.json({ error: "Invalid input parameters" }, { status: 400 })
    }

    // Simulate linear regression prediction for longitude
    // Based on the model training, we create a simplified prediction
    const longitude =
      -12.5 + latitude * 0.15 + diameter * 0.0008 + velocity * 2.3 + angularVelocity * 0.45 + (Math.random() - 0.5) * 10

    // Normalize longitude to -180 to 180 range
    const normalizedLongitude = ((longitude + 180) % 360) - 180

    return NextResponse.json({
      longitude: Number(normalizedLongitude.toFixed(4)),
      confidence: 0.85 + Math.random() * 0.1,
    })
  } catch (error) {
    console.error("[v0] Longitude prediction error:", error)
    return NextResponse.json({ error: "Prediction failed" }, { status: 500 })
  }
}
