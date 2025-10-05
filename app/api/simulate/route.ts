import { type NextRequest, NextResponse } from "next/server"

interface SimulationRequest {
  planetA: {
    name: string
    mass: number
    velocity: number
    distance: number
  }
  planetB: {
    name: string
    mass: number
    velocity: number
    distance: number
  }
}

interface SimulationResult {
  willCollide: boolean
  timeUntilCollision: number | null
  collisionProbability: number
  trajectory: {
    planetA: { x: number; y: number }[]
    planetB: { x: number; y: number }[]
  }
  analysis: string
}

export async function POST(request: NextRequest) {
  try {
    const body: SimulationRequest = await request.json()
    const { planetA, planetB } = body

    // Mock AI simulation logic
    const relativeVelocity = Math.abs(planetA.velocity - planetB.velocity)
    const distanceBetween = Math.abs(planetA.distance - planetB.distance)
    const combinedMass = planetA.mass + planetB.mass

    // Calculate collision probability (mock formula)
    const collisionProbability = Math.min(100, (combinedMass / 1000) * (relativeVelocity / distanceBetween) * 100)

    const willCollide = collisionProbability > 50

    // Calculate time until collision (in Earth years)
    const timeUntilCollision = willCollide ? (distanceBetween / relativeVelocity) * 365 : null

    // Generate trajectory points for visualization
    const trajectory = {
      planetA: Array.from({ length: 50 }, (_, i) => ({
        x: planetA.distance + i * relativeVelocity * 0.1,
        y: Math.sin(i * 0.2) * 50,
      })),
      planetB: Array.from({ length: 50 }, (_, i) => ({
        x: planetB.distance - i * relativeVelocity * 0.1,
        y: Math.cos(i * 0.2) * 50,
      })),
    }

    // Generate analysis text
    const analysis = willCollide
      ? `Based on current trajectories, ${planetA.name} and ${planetB.name} are on a collision course. The estimated time until impact is approximately ${timeUntilCollision?.toFixed(2)} Earth years. The collision probability is ${collisionProbability.toFixed(1)}% due to their relative velocities and gravitational interactions.`
      : `${planetA.name} and ${planetB.name} will maintain safe orbital distances. Their current trajectories show a collision probability of only ${collisionProbability.toFixed(1)}%, indicating stable orbits with minimal gravitational interference.`

    const result: SimulationResult = {
      willCollide,
      timeUntilCollision,
      collisionProbability,
      trajectory,
      analysis,
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1500))

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Simulation error:", error)
    return NextResponse.json({ error: "Failed to process simulation" }, { status: 500 })
  }
}
