import { type NextRequest, NextResponse } from "next/server"

interface MeteorWarningRequest {
  userLocation: {
    lat: number
    lng: number
  }
}

interface MeteorWarning {
  isWarning: boolean
  meteorLocation: {
    lat: number
    lng: number
    name: string
  }
  impactTime: string
  userLocation: {
    lat: number
    lng: number
  }
  escapeData: {
    requiredDistance: number
    requiredTime: number
    requiredVelocity: number
    safeDirection: string
    safeZones: Array<{ name: string; distance: number }>
  }
  consequences: {
    impactRadius: number
    devastationLevel: string
    casualties: string
    environmentalDamage: string
    economicImpact: string
  }
}

// Calculate distance between two coordinates using Haversine formula
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLng / 2) * Math.sin(dLng / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// Calculate bearing/direction between two points
function calculateBearing(lat1: number, lng1: number, lat2: number, lng2: number): string {
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const y = Math.sin(dLng) * Math.cos((lat2 * Math.PI) / 180)
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.cos(dLng)
  const bearing = (Math.atan2(y, x) * 180) / Math.PI

  const directions = ["North", "Northeast", "East", "Southeast", "South", "Southwest", "West", "Northwest"]
  const index = Math.round(((bearing + 360) % 360) / 45) % 8
  return directions[index]
}

export async function POST(request: NextRequest) {
  try {
    const body: MeteorWarningRequest = await request.json()
    const { userLocation } = body

    // Simulate meteor detection (in real app, this would come from NASA/ESA data)
    // For demo, we'll create a scenario where there's a 30% chance of a warning
    const hasWarning = Math.random() > 0.3

    if (!hasWarning) {
      return NextResponse.json({
        isWarning: false,
        meteorLocation: { lat: 0, lng: 0, name: "N/A" },
        impactTime: "N/A",
        userLocation,
        escapeData: {
          requiredDistance: 0,
          requiredTime: 0,
          requiredVelocity: 0,
          safeDirection: "N/A",
          safeZones: [],
        },
        consequences: {
          impactRadius: 0,
          devastationLevel: "None",
          casualties: "None",
          environmentalDamage: "None",
          economicImpact: "None",
        },
      })
    }

    // Generate meteor impact location (within 500km of user)
    const impactLat = userLocation.lat + (Math.random() - 0.5) * 5
    const impactLng = userLocation.lng + (Math.random() - 0.5) * 5

    // Calculate distance from user to impact
    const distanceToImpact = calculateDistance(userLocation.lat, userLocation.lng, impactLat, impactLng)

    // Determine impact zone name (simplified)
    const impactZones = [
      "Metropolitan Area",
      "Coastal Region",
      "Mountain Range",
      "Desert Plains",
      "Forest Region",
      "Urban Center",
    ]
    const impactZoneName = impactZones[Math.floor(Math.random() * impactZones.length)]

    // Calculate escape parameters
    const impactRadius = 150 + Math.random() * 100 // 150-250 km
    const requiredDistance = Math.max(impactRadius - distanceToImpact + 50, 50) // Add 50km safety margin
    const requiredTime = Math.ceil(requiredDistance / 80) // Assuming 80 km/h average speed
    const requiredVelocity = Math.ceil(requiredDistance / requiredTime)

    // Calculate safe direction (opposite to impact)
    const escapeDirection = calculateBearing(impactLat, impactLng, userLocation.lat, userLocation.lng)

    // Generate safe zones
    const safeZones = [
      { name: "Emergency Shelter Alpha", distance: Math.ceil(requiredDistance * 0.8) },
      { name: "Evacuation Center Beta", distance: Math.ceil(requiredDistance * 1.1) },
      { name: "Safe Haven Gamma", distance: Math.ceil(requiredDistance * 1.3) },
    ]

    // Calculate impact time (random between 6-48 hours)
    const hoursUntilImpact = 6 + Math.floor(Math.random() * 42)
    const impactDate = new Date(Date.now() + hoursUntilImpact * 60 * 60 * 1000)
    const impactTime = `${hoursUntilImpact} hours (${impactDate.toLocaleString()})`

    // Determine consequences based on impact radius
    const devastationLevels = ["Catastrophic", "Severe", "Major", "Significant"]
    const devastationLevel = devastationLevels[Math.floor(impactRadius / 70)]

    const casualties =
      impactRadius > 200
        ? "500,000 - 2,000,000 estimated"
        : impactRadius > 150
          ? "100,000 - 500,000 estimated"
          : "50,000 - 100,000 estimated"

    const environmentalDamage =
      impactRadius > 200
        ? "Massive atmospheric dust clouds, potential nuclear winter effects, widespread wildfires, and ecosystem collapse within 500km radius."
        : "Significant air pollution, regional climate disruption, extensive habitat destruction, and long-term soil contamination."

    const economicImpact =
      impactRadius > 200
        ? "Global economic disruption estimated at $5-10 trillion. Complete infrastructure destruction in impact zone."
        : "Regional economic losses of $500 billion - $2 trillion. Major infrastructure damage requiring decades of reconstruction."

    const result: MeteorWarning = {
      isWarning: true,
      meteorLocation: {
        lat: impactLat,
        lng: impactLng,
        name: impactZoneName,
      },
      impactTime,
      userLocation,
      escapeData: {
        requiredDistance,
        requiredTime,
        requiredVelocity,
        safeDirection: escapeDirection,
        safeZones,
      },
      consequences: {
        impactRadius: Math.ceil(impactRadius),
        devastationLevel,
        casualties,
        environmentalDamage,
        economicImpact,
      },
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json(result)
  } catch (error) {
    console.error("[v0] Meteor warning error:", error)
    return NextResponse.json({ error: "Failed to process meteor warning" }, { status: 500 })
  }
}
