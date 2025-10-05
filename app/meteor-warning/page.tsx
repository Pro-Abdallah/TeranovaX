"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, MapPin, AlertTriangle, Navigation, Clock, Gauge, Skull } from "lucide-react"

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

export default function MeteorWarningPage() {
  const [loading, setLoading] = useState(false)
  const [locationLoading, setLocationLoading] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [warning, setWarning] = useState<MeteorWarning | null>(null)

  const getUserLocation = () => {
    setLocationLoading(true)
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
          setLocationLoading(false)
        },
        (error) => {
          console.error("[v0] Location error:", error)
          // Use default location if permission denied
          setUserLocation({ lat: 40.7128, lng: -74.006 }) // New York
          setLocationLoading(false)
        },
      )
    } else {
      setUserLocation({ lat: 40.7128, lng: -74.006 })
      setLocationLoading(false)
    }
  }

  const checkMeteorWarning = async () => {
    if (!userLocation) return

    setLoading(true)
    try {
      const response = await fetch("/api/meteor-warning", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userLocation }),
      })

      const data = await response.json()
      setWarning(data)
    } catch (error) {
      console.error("[v0] Meteor warning check failed:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getUserLocation()
  }, [])

  return (
    <div className="container mx-auto min-h-screen px-4 py-12">
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-white md:text-6xl">Meteor Warning System</h1>
        <p className="text-balance text-lg text-gray-300">
          Real-time meteor impact detection and personalized escape planning
        </p>
      </div>

      {/* Location Status */}
      <Card className="mb-8 border-cyan-500/20 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white text-white text-white">
            <MapPin className="h-5 w-5 text-cyan-400" />
            Your Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          {locationLoading ? (
            <div className="flex items-center gap-2 text-gray-300">
              <Loader2 className="h-4 w-4 animate-spin" />
              Getting your location...
            </div>
          ) : userLocation ? (
            <div className="space-y-2">
              <p className="text-gray-300">
                Latitude: {userLocation.lat.toFixed(4)}, Longitude: {userLocation.lng.toFixed(4)}
              </p>
              <Button onClick={checkMeteorWarning} disabled={loading} className="bg-cyan-500 hover:bg-cyan-600">
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Checking...
                  </>
                ) : (
                  "Check for Meteor Threats"
                )}
              </Button>
            </div>
          ) : (
            <Button onClick={getUserLocation}>Enable Location Access</Button>
          )}
        </CardContent>
      </Card>

      {/* Warning Alert */}
      {warning && (
        <>
          <Alert
            className={`mb-8 ${
              warning.isWarning
                ? "border-red-500/50 bg-red-500/10 text-red-400"
                : "border-green-500/50 bg-green-500/10 text-green-400"
            }`}
          >
            <AlertTriangle className="h-5 w-5" />
            <AlertTitle className="text-xl font-bold">
              {warning.isWarning ? "METEOR IMPACT WARNING!" : "No Immediate Threats Detected"}
            </AlertTitle>
            <AlertDescription className="text-base">
              {warning.isWarning
                ? `A meteor is projected to impact near ${warning.meteorLocation.name}. Immediate action required!`
                : "Your location is currently safe from meteor impacts. Continue monitoring for updates."}
            </AlertDescription>
          </Alert>

          {warning.isWarning && (
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Meteor Impact Information */}
              <Card className="border-red-500/20 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-400">
                    <AlertTriangle className="h-5 w-5" />
                    Impact Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <span className="text-sm text-gray-400">Impact Location</span>
                      <span className="text-right font-bold text-white">{warning.meteorLocation.name}</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-sm text-gray-400">Coordinates</span>
                      <span className="text-right font-mono text-sm text-white">
                        {warning.meteorLocation.lat.toFixed(4)}, {warning.meteorLocation.lng.toFixed(4)}
                      </span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-sm text-gray-400">Estimated Impact Time</span>
                      <span className="text-right font-bold text-red-400">{warning.impactTime}</span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span className="text-sm text-gray-400">Impact Radius</span>
                      <span className="text-right font-bold text-white">{warning.consequences.impactRadius} km</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Escape Parameters */}
              <Card className="border-orange-500/20 bg-white/5 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-orange-400">
                    <Navigation className="h-5 w-5" />
                    Escape Parameters
                  </CardTitle>
                  <CardDescription>Personalized escape plan for your location</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="rounded-lg bg-orange-500/10 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Navigation className="h-4 w-4 text-orange-400" />
                      <span className="text-sm font-medium text-gray-300">Required Distance</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{warning.escapeData.requiredDistance} km</p>
                    <p className="mt-1 text-xs text-gray-400">Minimum safe distance from impact zone</p>
                  </div>

                  <div className="rounded-lg bg-cyan-500/10 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Clock className="h-4 w-4 text-cyan-400" />
                      <span className="text-sm font-medium text-gray-300">Required Time</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{warning.escapeData.requiredTime} hours</p>
                    <p className="mt-1 text-xs text-gray-400">Time needed to reach safety</p>
                  </div>

                  <div className="rounded-lg bg-purple-500/10 p-4">
                    <div className="mb-2 flex items-center gap-2">
                      <Gauge className="h-4 w-4 text-purple-400" />
                      <span className="text-sm font-medium text-gray-300">Required Velocity</span>
                    </div>
                    <p className="text-2xl font-bold text-white">{warning.escapeData.requiredVelocity} km/h</p>
                    <p className="mt-1 text-xs text-gray-400">Average speed needed (by car)</p>
                  </div>

                  <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-4">
                    <p className="text-sm font-medium text-gray-300">Recommended Direction</p>
                    <p className="text-xl font-bold text-green-400">{warning.escapeData.safeDirection}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Escape Map */}
              <Card className="border-cyan-500/20 bg-white/5 backdrop-blur-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-cyan-400">
                    <MapPin className="h-5 w-5" />
                    Escape Route Map
                  </CardTitle>
                  <CardDescription>Your location and nearest safe zones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="relative h-96 w-full overflow-hidden rounded-lg bg-gradient-to-br from-slate-900 to-slate-800">
                    <svg className="h-full w-full" viewBox="0 0 800 400">
                      {/* Grid background */}
                      <defs>
                        <pattern id="escape-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                          <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                        </pattern>
                        <radialGradient id="impact-gradient">
                          <stop offset="0%" stopColor="#ef4444" stopOpacity="0.8" />
                          <stop offset="50%" stopColor="#dc2626" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#991b1b" stopOpacity="0.1" />
                        </radialGradient>
                      </defs>
                      <rect width="800" height="400" fill="url(#escape-grid)" />

                      {/* Impact zone (center) */}
                      <circle cx="400" cy="200" r="80" fill="url(#impact-gradient)" className="animate-pulse" />
                      <circle
                        cx="400"
                        cy="200"
                        r="60"
                        fill="none"
                        stroke="#ef4444"
                        strokeWidth="2"
                        strokeDasharray="5,5"
                      />
                      <circle cx="400" cy="200" r="40" fill="none" stroke="#dc2626" strokeWidth="2" />
                      <circle cx="400" cy="200" r="8" fill="#ef4444" />
                      <text x="400" y="280" textAnchor="middle" fill="#ef4444" fontSize="14" fontWeight="bold">
                        IMPACT ZONE
                      </text>
                      <text x="400" y="295" textAnchor="middle" fill="#ef4444" fontSize="10">
                        {warning.meteorLocation.name}
                      </text>

                      {/* Your location */}
                      <circle cx="300" cy="150" r="12" fill="#06b6d4" className="animate-pulse" />
                      <circle cx="300" cy="150" r="6" fill="#fff" />
                      <text x="300" y="135" textAnchor="middle" fill="#06b6d4" fontSize="12" fontWeight="bold">
                        YOU
                      </text>

                      {/* Escape arrow */}
                      <defs>
                        <marker id="arrowhead" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
                          <polygon points="0 0, 10 3, 0 6" fill="#10b981" />
                        </marker>
                      </defs>
                      <path
                        d="M 300 150 Q 200 100, 100 80"
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="3"
                        markerEnd="url(#arrowhead)"
                        strokeDasharray="10,5"
                      />

                      {/* Safe zones */}
                      {warning.escapeData.safeZones.map((zone, i) => {
                        const positions = [
                          { x: 100, y: 80 },
                          { x: 150, y: 320 },
                          { x: 650, y: 100 },
                        ]
                        const pos = positions[i] || positions[0]
                        return (
                          <g key={i}>
                            <circle cx={pos.x} cy={pos.y} r="30" fill="rgba(16, 185, 129, 0.2)" />
                            <circle cx={pos.x} cy={pos.y} r="6" fill="#10b981" />
                            <text
                              x={pos.x}
                              y={pos.y - 40}
                              textAnchor="middle"
                              fill="#10b981"
                              fontSize="11"
                              fontWeight="bold"
                            >
                              {zone.name}
                            </text>
                            <text x={pos.x} y={pos.y - 28} textAnchor="middle" fill="#6ee7b7" fontSize="9">
                              {zone.distance} km away
                            </text>
                          </g>
                        )
                      })}

                      {/* Distance indicator */}
                      <line
                        x1="300"
                        y1="150"
                        x2="400"
                        y2="200"
                        stroke="rgba(255,255,255,0.3)"
                        strokeWidth="1"
                        strokeDasharray="2,2"
                      />
                      <text x="350" y="170" fill="#fff" fontSize="10">
                        {warning.escapeData.requiredDistance} km
                      </text>
                    </svg>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-4">
                    {warning.escapeData.safeZones.map((zone, i) => (
                      <div key={i} className="rounded-lg border border-green-500/30 bg-green-500/10 p-3">
                        <p className="text-sm font-medium text-green-400">{zone.name}</p>
                        <p className="text-xs text-gray-400">{zone.distance} km away</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Consequences */}
              <Card className="border-red-500/20 bg-white/5 backdrop-blur-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-red-400">
                    <Skull className="h-5 w-5" />
                    Impact Consequences
                  </CardTitle>
                  <CardDescription>Projected effects of the meteor impact on Earth</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-4">
                      <p className="mb-2 text-sm font-medium text-gray-300">Devastation Level</p>
                      <p className="text-xl font-bold text-red-400">{warning.consequences.devastationLevel}</p>
                    </div>

                    <div className="rounded-lg border border-orange-500/30 bg-orange-500/10 p-4">
                      <p className="mb-2 text-sm font-medium text-gray-300">Estimated Casualties</p>
                      <p className="text-xl font-bold text-orange-400">{warning.consequences.casualties}</p>
                    </div>

                    <div className="rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
                      <p className="mb-2 text-sm font-medium text-gray-300">Environmental Damage</p>
                      <p className="text-pretty text-sm leading-relaxed text-gray-300">
                        {warning.consequences.environmentalDamage}
                      </p>
                    </div>

                    <div className="rounded-lg border border-purple-500/30 bg-purple-500/10 p-4">
                      <p className="mb-2 text-sm font-medium text-gray-300">Economic Impact</p>
                      <p className="text-pretty text-sm leading-relaxed text-gray-300">
                        {warning.consequences.economicImpact}
                      </p>
                    </div>
                  </div>

                  <Alert className="border-red-500/50 bg-red-500/10">
                    <AlertTriangle className="h-4 w-4 text-red-400" />
                    <AlertTitle className="text-red-400">Emergency Action Required</AlertTitle>
                    <AlertDescription className="text-gray-300">
                      Follow your personalized escape plan immediately. Head {warning.escapeData.safeDirection} at{" "}
                      {warning.escapeData.requiredVelocity} km/h to reach safety within{" "}
                      {warning.escapeData.requiredTime} hours.
                    </AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  )
}
