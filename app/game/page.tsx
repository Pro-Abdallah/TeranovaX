"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Play, RotateCcw, Pause } from "lucide-react"

interface GameObject {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
}

interface Asteroid extends GameObject {
  rotation: number
  rotationSpeed: number
}

interface Bullet extends GameObject {
  life: number
}

interface Ship extends GameObject {
  angle: number
  thrust: boolean
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  color: string
}

export default function AsteroidGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [gameState, setGameState] = useState<"menu" | "playing" | "paused" | "gameOver">("menu")
  const [score, setScore] = useState(0)
  const [highScore, setHighScore] = useState(0)
  const [level, setLevel] = useState(1)

  const gameStateRef = useRef({
    ship: null as Ship | null,
    asteroids: [] as Asteroid[],
    bullets: [] as Bullet[],
    particles: [] as Particle[],
    keys: {} as Record<string, boolean>,
    score: 0,
    level: 1,
    lives: 3,
  })

  const spawnAsteroids = useCallback((count: number, canvas: HTMLCanvasElement) => {
    const asteroids: Asteroid[] = []
    for (let i = 0; i < count; i++) {
      const side = Math.floor(Math.random() * 4)
      let x, y

      switch (side) {
        case 0: // top
          x = Math.random() * canvas.width
          y = -50
          break
        case 1: // right
          x = canvas.width + 50
          y = Math.random() * canvas.height
          break
        case 2: // bottom
          x = Math.random() * canvas.width
          y = canvas.height + 50
          break
        default: // left
          x = -50
          y = Math.random() * canvas.height
      }

      const angle = Math.random() * Math.PI * 2
      const speed = 1 + Math.random() * 2

      asteroids.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: 30 + Math.random() * 20,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
      })
    }
    return asteroids
  }, [])

  const createParticles = useCallback((x: number, y: number, count: number, color: string) => {
    const particles: Particle[] = []
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2
      const speed = 1 + Math.random() * 3
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1,
        color,
      })
    }
    return particles
  }, [])

  const startGame = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    gameStateRef.current = {
      ship: {
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: 0,
        vy: 0,
        angle: -Math.PI / 2,
        radius: 15,
        thrust: false,
      },
      asteroids: spawnAsteroids(3, canvas),
      bullets: [],
      particles: [],
      keys: {},
      score: 0,
      level: 1,
      lives: 3,
    }

    setScore(0)
    setLevel(1)
    setGameState("playing")
  }, [spawnAsteroids])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameState === "playing") {
        gameStateRef.current.keys[e.key] = true

        if (e.key === " " && gameStateRef.current.ship) {
          e.preventDefault()
          const ship = gameStateRef.current.ship
          gameStateRef.current.bullets.push({
            x: ship.x + Math.cos(ship.angle) * 20,
            y: ship.y + Math.sin(ship.angle) * 20,
            vx: Math.cos(ship.angle) * 8 + ship.vx,
            vy: Math.sin(ship.angle) * 8 + ship.vy,
            radius: 3,
            life: 60,
          })
        }
      }

      if (e.key === "Escape") {
        setGameState((prev) => (prev === "playing" ? "paused" : prev === "paused" ? "playing" : prev))
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      gameStateRef.current.keys[e.key] = false
    }

    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)

    let animationId: number

    const gameLoop = () => {
      if (!ctx || !canvas || gameState !== "playing") {
        animationId = requestAnimationFrame(gameLoop)
        return
      }

      const state = gameStateRef.current
      const { ship, asteroids, bullets, particles, keys } = state

      // Clear canvas
      ctx.fillStyle = "rgba(9, 10, 15, 0.2)"
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      // Update ship
      if (ship) {
        if (keys["ArrowLeft"]) ship.angle -= 0.08
        if (keys["ArrowRight"]) ship.angle += 0.08

        ship.thrust = keys["ArrowUp"] || false

        if (ship.thrust) {
          ship.vx += Math.cos(ship.angle) * 0.15
          ship.vy += Math.sin(ship.angle) * 0.15

          // Thrust particles
          if (Math.random() > 0.5) {
            particles.push(
              ...createParticles(ship.x - Math.cos(ship.angle) * 15, ship.y - Math.sin(ship.angle) * 15, 2, "#f97316"),
            )
          }
        }

        // Friction
        ship.vx *= 0.99
        ship.vy *= 0.99

        ship.x += ship.vx
        ship.y += ship.vy

        // Wrap around screen
        if (ship.x < 0) ship.x = canvas.width
        if (ship.x > canvas.width) ship.x = 0
        if (ship.y < 0) ship.y = canvas.height
        if (ship.y > canvas.height) ship.y = 0

        // Draw ship
        ctx.save()
        ctx.translate(ship.x, ship.y)
        ctx.rotate(ship.angle)
        ctx.strokeStyle = "#06b6d4"
        ctx.fillStyle = "rgba(6, 182, 212, 0.2)"
        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(20, 0)
        ctx.lineTo(-15, -12)
        ctx.lineTo(-10, 0)
        ctx.lineTo(-15, 12)
        ctx.closePath()
        ctx.fill()
        ctx.stroke()

        if (ship.thrust) {
          ctx.fillStyle = "#f97316"
          ctx.beginPath()
          ctx.moveTo(-10, -5)
          ctx.lineTo(-20, 0)
          ctx.lineTo(-10, 5)
          ctx.closePath()
          ctx.fill()
        }

        ctx.restore()
      }

      // Update and draw asteroids
      asteroids.forEach((asteroid, i) => {
        asteroid.x += asteroid.vx
        asteroid.y += asteroid.vy
        asteroid.rotation += asteroid.rotationSpeed

        if (asteroid.x < -100) asteroid.x = canvas.width + 100
        if (asteroid.x > canvas.width + 100) asteroid.x = -100
        if (asteroid.y < -100) asteroid.y = canvas.height + 100
        if (asteroid.y > canvas.height + 100) asteroid.y = -100

        ctx.save()
        ctx.translate(asteroid.x, asteroid.y)
        ctx.rotate(asteroid.rotation)
        ctx.strokeStyle = "#ef4444"
        ctx.fillStyle = "rgba(239, 68, 68, 0.1)"
        ctx.lineWidth = 2
        ctx.beginPath()
        for (let j = 0; j < 8; j++) {
          const angle = (j / 8) * Math.PI * 2
          const r = asteroid.radius * (0.8 + Math.random() * 0.4)
          const x = Math.cos(angle) * r
          const y = Math.sin(angle) * r
          if (j === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.closePath()
        ctx.fill()
        ctx.stroke()
        ctx.restore()

        // Collision with ship
        if (ship) {
          const dx = ship.x - asteroid.x
          const dy = ship.y - asteroid.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < ship.radius + asteroid.radius) {
            particles.push(...createParticles(ship.x, ship.y, 30, "#06b6d4"))
            state.lives--

            if (state.lives <= 0) {
              setGameState("gameOver")
              if (state.score > highScore) {
                setHighScore(state.score)
              }
            } else {
              ship.x = canvas.width / 2
              ship.y = canvas.height / 2
              ship.vx = 0
              ship.vy = 0
            }
          }
        }
      })

      // Update and draw bullets
      bullets.forEach((bullet, i) => {
        bullet.x += bullet.vx
        bullet.y += bullet.vy
        bullet.life--

        if (bullet.life <= 0 || bullet.x < 0 || bullet.x > canvas.width || bullet.y < 0 || bullet.y > canvas.height) {
          bullets.splice(i, 1)
          return
        }

        ctx.fillStyle = "#06b6d4"
        ctx.shadowBlur = 10
        ctx.shadowColor = "#06b6d4"
        ctx.beginPath()
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2)
        ctx.fill()
        ctx.shadowBlur = 0

        // Check collision with asteroids
        asteroids.forEach((asteroid, j) => {
          const dx = bullet.x - asteroid.x
          const dy = bullet.y - asteroid.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < bullet.radius + asteroid.radius) {
            bullets.splice(i, 1)
            asteroids.splice(j, 1)
            particles.push(...createParticles(asteroid.x, asteroid.y, 20, "#ef4444"))

            state.score += 100
            setScore(state.score)

            // Split asteroid
            if (asteroid.radius > 20) {
              for (let k = 0; k < 2; k++) {
                const angle = Math.random() * Math.PI * 2
                const speed = 1.5 + Math.random() * 2
                asteroids.push({
                  x: asteroid.x,
                  y: asteroid.y,
                  vx: Math.cos(angle) * speed,
                  vy: Math.sin(angle) * speed,
                  radius: asteroid.radius * 0.6,
                  rotation: Math.random() * Math.PI * 2,
                  rotationSpeed: (Math.random() - 0.5) * 0.08,
                })
              }
            }
          }
        })
      })

      // Update and draw particles
      particles.forEach((particle, i) => {
        particle.x += particle.vx
        particle.y += particle.vy
        particle.life -= 0.02
        particle.vx *= 0.98
        particle.vy *= 0.98

        if (particle.life <= 0) {
          particles.splice(i, 1)
          return
        }

        ctx.fillStyle = particle.color
        ctx.globalAlpha = particle.life
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2)
        ctx.fill()
        ctx.globalAlpha = 1
      })

      // Level up
      if (asteroids.length === 0) {
        state.level++
        setLevel(state.level)
        asteroids.push(...spawnAsteroids(3 + state.level, canvas))
      }

      animationId = requestAnimationFrame(gameLoop)
    }

    gameLoop()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
      cancelAnimationFrame(animationId)
    }
  }, [gameState, highScore, spawnAsteroids, createParticles])

  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto max-w-7xl px-4 py-8 flex-1 flex flex-col">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <Button asChild variant="outline" className="border-white/20 text-white hover:bg-white/10 bg-transparent">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Link>
          </Button>

          <div className="flex gap-6 font-mono text-sm">
            <div className="text-white">
              <span className="text-gray-400">Score:</span> <span className="text-cyan-400 font-bold">{score}</span>
            </div>
            <div className="text-white">
              <span className="text-gray-400">Level:</span> <span className="text-orange-400 font-bold">{level}</span>
            </div>
            <div className="text-white">
              <span className="text-gray-400">Lives:</span>{" "}
              <span className="text-red-400 font-bold">{gameStateRef.current.lives}</span>
            </div>
            <div className="text-white">
              <span className="text-gray-400">High:</span>{" "}
              <span className="text-purple-400 font-bold">{highScore}</span>
            </div>
          </div>
        </div>

        {/* Game Canvas */}
        <Card className="relative flex-1 overflow-hidden border-white/20 bg-black/40 backdrop-blur-sm">
          <canvas ref={canvasRef} className="h-full w-full" style={{ minHeight: "500px" }} />

          {/* Overlays */}
          {gameState === "menu" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="text-center space-y-6">
                <h1 className="text-6xl font-bold text-white mb-2">
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                    ASTEROID
                  </span>
                </h1>
                <p className="text-gray-300 text-lg max-w-md mx-auto leading-relaxed">
                  Destroy asteroids and survive as long as you can. Use arrow keys to move and spacebar to shoot.
                </p>
                <div className="space-y-3">
                  <Button onClick={startGame} size="lg" className="bg-cyan-500 text-white hover:bg-cyan-600 glow-cyan">
                    <Play className="mr-2 h-5 w-5" />
                    Start Game
                  </Button>
                  <div className="text-sm text-gray-400 space-y-1 font-mono">
                    <div>↑ Thrust</div>
                    <div>← → Rotate</div>
                    <div>SPACE Shoot</div>
                    <div>ESC Pause</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {gameState === "paused" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="text-center space-y-6">
                <h2 className="text-4xl font-bold text-white">PAUSED</h2>
                <Button
                  onClick={() => setGameState("playing")}
                  size="lg"
                  className="bg-cyan-500 text-white hover:bg-cyan-600"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Resume
                </Button>
              </div>
            </div>
          )}

          {gameState === "gameOver" && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-sm">
              <div className="text-center space-y-6">
                <h2 className="text-5xl font-bold text-red-400 mb-4">GAME OVER</h2>
                <div className="space-y-2 font-mono">
                  <p className="text-2xl text-white">
                    Final Score: <span className="text-cyan-400 font-bold">{score}</span>
                  </p>
                  <p className="text-xl text-gray-300">
                    Level Reached: <span className="text-orange-400 font-bold">{level}</span>
                  </p>
                  {score === highScore && score > 0 && (
                    <p className="text-lg text-purple-400 font-bold">🎉 New High Score!</p>
                  )}
                </div>
                <Button onClick={startGame} size="lg" className="bg-cyan-500 text-white hover:bg-cyan-600 glow-cyan">
                  <RotateCcw className="mr-2 h-5 w-5" />
                  Play Again
                </Button>
              </div>
            </div>
          )}

          {gameState === "playing" && (
            <div className="absolute top-4 right-4">
              <Button
                onClick={() => setGameState("paused")}
                size="sm"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Pause className="h-4 w-4" />
              </Button>
            </div>
          )}
        </Card>

        {/* Instructions */}
        <div className="mt-6 grid gap-4 md:grid-cols-4 text-center font-mono text-sm">
          <Card className="border-white/20 bg-black/40 p-4">
            <div className="text-cyan-400 font-bold mb-1">MOVEMENT</div>
            <div className="text-gray-300">Arrow keys to navigate</div>
          </Card>
          <Card className="border-white/20 bg-black/40 p-4">
            <div className="text-orange-400 font-bold mb-1">SHOOT</div>
            <div className="text-gray-300">Spacebar to fire</div>
          </Card>
          <Card className="border-white/20 bg-black/40 p-4">
            <div className="text-red-400 font-bold mb-1">SURVIVE</div>
            <div className="text-gray-300">Avoid asteroid collisions</div>
          </Card>
          <Card className="border-white/20 bg-black/40 p-4">
            <div className="text-purple-400 font-bold mb-1">SCORE</div>
            <div className="text-gray-300">Destroy asteroids for points</div>
          </Card>
        </div>
      </div>
    </div>
  )
}
