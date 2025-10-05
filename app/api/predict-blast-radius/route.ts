import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { velocity, diameter } = body

    // Validate inputs
    if (typeof velocity !== "number" || typeof diameter !== "number") {
      return NextResponse.json({ error: "Invalid input parameters" }, { status: 400 })
    }

    // Simulate linear regression prediction for blast radius
    // Blast radius is primarily influenced by velocity and diameter (kinetic energy)
    const blastRadius = 2.5 + velocity * 0.85 + diameter * 0.012 + (Math.random() - 0.5) * 3

    // Ensure positive blast radius
    const normalizedBlastRadius = Math.max(0.1, blastRadius)

    return NextResponse.json({
      blastRadius: Number(normalizedBlastRadius.toFixed(2)),
      confidence: 0.88 + Math.random() * 0.08,
    })
  } catch (error) {
    console.error("[v0] Blast radius prediction error:", error)
    return NextResponse.json({ error: "Prediction failed" }, { status: 500 })
  }
}
