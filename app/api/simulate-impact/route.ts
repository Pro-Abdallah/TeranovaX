import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { diameter, velocity, angularVelocity } = body

    // Validate inputs
    if (typeof diameter !== "number" || typeof velocity !== "number" || typeof angularVelocity !== "number") {
      return NextResponse.json({ error: "Invalid input parameters" }, { status: 400 })
    }

    // Call all three prediction models
    const [longitudeRes, latitudeRes, blastRadiusRes] = await Promise.all([
      fetch(`${request.url.replace("/simulate-impact", "/predict-longitude")}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: 0, // Initial guess
          diameter,
          velocity,
          angularVelocity,
        }),
      }),
      fetch(`${request.url.replace("/simulate-impact", "/predict-latitude")}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diameter,
          velocity,
          angularVelocity,
          longitude: 0, // Initial guess
        }),
      }),
      fetch(`${request.url.replace("/simulate-impact", "/predict-blast-radius")}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          velocity,
          diameter,
        }),
      }),
    ])

    const longitude = await longitudeRes.json()
    const latitude = await latitudeRes.json()
    const blastRadius = await blastRadiusRes.json()

    // Refine predictions with actual values
    const refinedLongitudeRes = await fetch(`${request.url.replace("/simulate-impact", "/predict-longitude")}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        latitude: latitude.latitude,
        diameter,
        velocity,
        angularVelocity,
      }),
    })

    const refinedLatitudeRes = await fetch(`${request.url.replace("/simulate-impact", "/predict-latitude")}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        diameter,
        velocity,
        angularVelocity,
        longitude: longitude.longitude,
      }),
    })

    const refinedLongitude = await refinedLongitudeRes.json()
    const refinedLatitude = await refinedLatitudeRes.json()

    // Calculate impact severity
    const kineticEnergy = 0.5 * (diameter / 1000) ** 3 * velocity ** 2 // Simplified
    const impactSeverity = kineticEnergy > 1000 ? "catastrophic" : kineticEnergy > 100 ? "severe" : "moderate"

    // Generate analysis
    const analysis = `Based on the asteroid's parameters, our AI models predict an impact at coordinates ${refinedLatitude.latitude.toFixed(2)}°N, ${refinedLongitude.longitude.toFixed(2)}°E. The asteroid, measuring ${diameter}m in diameter and traveling at ${velocity} km/s, would create a blast radius of approximately ${blastRadius.blastRadius} km. This represents a ${impactSeverity} impact event. The angular velocity of ${angularVelocity}°/s suggests ${angularVelocity > 5 ? "significant rotational energy" : "minimal rotation"}, which affects the impact dynamics.`

    return NextResponse.json({
      impactLocation: {
        latitude: refinedLatitude.latitude,
        longitude: refinedLongitude.longitude,
      },
      blastRadius: blastRadius.blastRadius,
      impactSeverity,
      analysis,
      confidence: {
        latitude: refinedLatitude.confidence,
        longitude: refinedLongitude.confidence,
        blastRadius: blastRadius.confidence,
      },
      trajectory: generateTrajectory(diameter, velocity, angularVelocity),
    })
  } catch (error) {
    console.error("[v0] Impact simulation error:", error)
    return NextResponse.json({ error: "Simulation failed" }, { status: 500 })
  }
}

function generateTrajectory(diameter: number, velocity: number, angularVelocity: number) {
  const points = []
  const steps = 50

  for (let i = 0; i < steps; i++) {
    const t = i / steps
    const x = t * 500
    const y = -100 * Math.sin(t * Math.PI) + (Math.random() - 0.5) * 10
    const z = t * 200 - 100

    points.push({ x, y, z, time: t })
  }

  return points
}
