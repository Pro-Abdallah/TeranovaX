"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import Image from "next/image"

interface ImpactResult {
  impactLocation: {
    latitude: number
    longitude: number
  }
  blastRadius: number
  impactSeverity: string
  analysis: string
  confidence: {
    latitude: number
    longitude: number
    blastRadius: number
  }
  trajectory: Array<{ x: number; y: number; z: number; time: number }>
}

const presetAsteroids = {
  small: { name: "Small Asteroid", diameter: 20, velocity: 15, angularVelocity: 2 },
  medium: { name: "Medium Asteroid", diameter: 50, velocity: 20, angularVelocity: 5 },
  large: { name: "Large Asteroid", diameter: 100, velocity: 25, angularVelocity: 8 },
  tunguska: { name: "Tunguska-class", diameter: 60, velocity: 27, angularVelocity: 4 },
  chicxulub: { name: "Chicxulub-class", diameter: 10000, velocity: 20, angularVelocity: 1 },
  apophis: { name: "Apophis-class", diameter: 370, velocity: 30.7, angularVelocity: 6 },
}

export default function SimulationPage() {
  const [asteroid, setAsteroid] = useState({
    name: "Medium Asteroid",
    diameter: 50,
    velocity: 20,
    angularVelocity: 5,
  })

  const [result, setResult] = useState<ImpactResult | null>(null)
  const [loading, setLoading] = useState(false)

  const handlePresetChange = (presetKey: string) => {
    const preset = presetAsteroids[presetKey as keyof typeof presetAsteroids]
    setAsteroid(preset)
  }

  const handleSimulate = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/simulate-impact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          diameter: asteroid.diameter,
          velocity: asteroid.velocity,
          angularVelocity: asteroid.angularVelocity,
        }),
      })

      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("[v0] Simulation failed:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto min-h-screen px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-white md:text-6xl">Asteroid Impact Simulator</h1>
        <p className="text-balance text-lg text-gray-300">
          Configure asteroid parameters and predict impact location and blast radius using AI
        </p>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Configuration Panel */}
        <div className="space-y-6">
          <Card className="border-orange-500/20 bg-white/5 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-orange-400">Asteroid Parameters</CardTitle>
              <CardDescription>Configure the incoming asteroid properties</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="preset">Preset Asteroid</Label>
                <select
                  id="preset"
                  className="w-full rounded-md border border-white/30 bg-white/10 px-3 py-2 text-white backdrop-blur-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-400/50"
                  onChange={(e) => handlePresetChange(e.target.value)}
                  defaultValue="medium"
                >
                  <option value="small" className="bg-gray-900 text-white">
                    Small Asteroid (20m)
                  </option>
                  <option value="medium" className="bg-gray-900 text-white">
                    Medium Asteroid (50m)
                  </option>
                  <option value="large" className="bg-gray-900 text-white">
                    Large Asteroid (100m)
                  </option>
                  <option value="tunguska" className="bg-gray-900 text-white">
                    Tunguska-class (60m)
                  </option>
                  <option value="apophis" className="bg-gray-900 text-white">
                    Apophis-class (370m)
                  </option>
                  <option value="chicxulub" className="bg-gray-900 text-white">
                    Chicxulub-class (10km) - Extinction Event
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={asteroid.name}
                  onChange={(e) => setAsteroid({ ...asteroid, name: e.target.value })}
                  className="text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="diameter">Diameter (meters)</Label>
                <Input
                  id="diameter"
                  type="number"
                  value={asteroid.diameter}
                  onChange={(e) => setAsteroid({ ...asteroid, diameter: Number.parseFloat(e.target.value) })}
                />
                <p className="text-xs text-gray-400">Typical range: 10m - 10,000m</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="velocity">Velocity (km/s)</Label>
                <Input
                  id="velocity"
                  type="number"
                  step="0.1"
                  value={asteroid.velocity}
                  onChange={(e) => setAsteroid({ ...asteroid, velocity: Number.parseFloat(e.target.value) })}
                />
                <p className="text-xs text-gray-400">Typical range: 11 - 72 km/s</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="angular-velocity">Angular Velocity (degrees/s)</Label>
                <Input
                  id="angular-velocity"
                  type="number"
                  step="0.1"
                  value={asteroid.angularVelocity}
                  onChange={(e) => setAsteroid({ ...asteroid, angularVelocity: Number.parseFloat(e.target.value) })}
                />
                <p className="text-xs text-gray-400">Rotation speed of the asteroid</p>
              </div>
            </CardContent>
          </Card>

          <Button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full bg-red-500 hover:bg-red-600 glow-red"
            size="lg"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Simulating Impact...
              </>
            ) : (
              "Run Impact Simulation"
            )}
          </Button>
        </div>

        {/* Results Panel */}
        <div className="space-y-6">
          {loading && (
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="flex min-h-96 items-center justify-center p-12">
                <div className="text-center">
                  <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-orange-400" />
                  <p className="text-lg text-gray-300">Processing impact simulation...</p>
                  <p className="text-sm text-gray-400 mt-2">Running AI prediction models...</p>
                </div>
              </CardContent>
            </Card>
          )}

          {result && !loading && (
            <>
              <Card className="border-red-500/30 bg-red-500/10 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-red-400">Impact Predicted!</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-white/5 p-4">
                      <p className="text-sm text-gray-400">Impact Latitude</p>
                      <p className="text-2xl font-bold text-white">{result.impactLocation.latitude.toFixed(4)}°</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Confidence: {(result.confidence.latitude * 100).toFixed(1)}%
                      </p>
                    </div>
                    <div className="rounded-lg bg-white/5 p-4">
                      <p className="text-sm text-gray-400">Impact Longitude</p>
                      <p className="text-2xl font-bold text-white">{result.impactLocation.longitude.toFixed(4)}°</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Confidence: {(result.confidence.longitude * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>

                  <div className="rounded-lg bg-white/5 p-4">
                    <p className="text-sm text-gray-400">Blast Radius</p>
                    <p className="text-3xl font-bold text-orange-400">{result.blastRadius} km</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Confidence: {(result.confidence.blastRadius * 100).toFixed(1)}%
                    </p>
                  </div>

                  <div className="rounded-lg bg-white/5 p-4">
                    <p className="text-sm text-gray-400">Impact Severity</p>
                    <p className="text-xl font-bold text-white capitalize">{result.impactSeverity}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Trajectory Visualization */}
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>Impact Visualization</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImpactVisualization result={result} asteroid={asteroid} />
                </CardContent>
              </Card>

              {/* Analysis */}
              <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle>AI Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-pretty leading-relaxed text-gray-300">{result.analysis}</p>
                </CardContent>
              </Card>
            </>
          )}

          {!result && !loading && (
            <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
              <CardContent className="flex min-h-96 items-center justify-center p-12">
                <div className="text-center">
                  <div className="mx-auto mb-4 h-24 w-24 rounded-full bg-gradient-to-br from-orange-400 to-red-600 opacity-50 blur-xl" />
                  <p className="text-lg text-gray-300">Configure asteroid and run simulation</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}

function ImpactVisualization({
  result,
  asteroid,
}: {
  result: ImpactResult
  asteroid: { name: string; diameter: number }
}) {
  const getAsteroidImage = () => {
    if (asteroid.diameter < 40) return "/small-smooth-asteroid.jpg"
    if (asteroid.diameter < 80) return "/medium-asteroid-space-rock.jpg"
    if (asteroid.diameter < 200) return "/large-jagged-asteroid-craters.jpg"
    return "/massive-heavily-cratered-asteroid.jpg"
  }

  return (
    <div className="relative h-80 w-full overflow-hidden rounded-lg bg-black">
      <div className="absolute inset-0 flex items-center justify-center">
        <Image
          src="/planet-earth-from-space-realistic.jpg"
          alt="Earth"
          width={256}
          height={256}
          className="h-64 w-64 rounded-full object-cover"
        />
      </div>

      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 500 300">
        {/* Grid */}
        <defs>
          <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
            <path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(255,255,256,0.05)" strokeWidth="1" />
          </pattern>
          <radialGradient id="asteroidGradient">
            <stop offset="0%" stopColor="#78716c" />
            <stop offset="100%" stopColor="#44403c" />
          </radialGradient>
          <radialGradient id="impactGradient">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#dc2626" />
          </radialGradient>
        </defs>
        <rect width="500" height="300" fill="url(#grid)" />

        {/* Asteroid trajectory */}
        <path
          d="M 50 50 Q 150 80, 250 150"
          fill="none"
          stroke="rgba(251, 146, 60, 0.8)"
          strokeWidth="3"
          strokeDasharray="5,5"
        />

        <image href={getAsteroidImage()} x="32" y="32" width="36" height="36" className="drop-shadow-lg" />
        <text x="50" y="30" textAnchor="middle" fill="white" fontSize="10" className="drop-shadow-md">
          {asteroid.name}
        </text>

        {/* Impact point on Earth */}
        <circle cx="250" cy="150" r="8" fill="#ef4444" className="animate-pulse" />
        <circle cx="250" cy="150" r="20" fill="url(#impactGradient)" opacity="0.4" className="animate-pulse" />
        <circle
          cx="250"
          cy="150"
          r={Math.min(result.blastRadius * 0.5, 80)}
          fill="rgba(239, 68, 68, 0.15)"
          stroke="#ef4444"
          strokeWidth="2"
          strokeDasharray="3,3"
          className="animate-pulse"
        />

        {/* Impact label */}
        <text
          x="250"
          y="125"
          textAnchor="middle"
          fill="#ef4444"
          fontSize="12"
          fontWeight="bold"
          className="drop-shadow-md"
        >
          Impact Zone
        </text>
        <text x="250" y="180" textAnchor="middle" fill="white" fontSize="10" className="drop-shadow-md">
          {result.impactLocation.latitude.toFixed(2)}°, {result.impactLocation.longitude.toFixed(2)}°
        </text>

        {/* Blast radius label */}
        <text
          x="400"
          y="150"
          textAnchor="middle"
          fill="#f97316"
          fontSize="11"
          fontWeight="bold"
          className="drop-shadow-md"
        >
          Blast: {result.blastRadius}km
        </text>

        {/* Earth label */}
        <text
          x="250"
          y="290"
          textAnchor="middle"
          fill="white"
          fontSize="14"
          fontWeight="bold"
          className="drop-shadow-md"
        >
          Earth
        </text>
      </svg>
    </div>
  )
}
