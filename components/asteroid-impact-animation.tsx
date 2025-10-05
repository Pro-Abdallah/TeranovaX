"use client"
import Image from "next/image"
import { useEffect, useState } from "react"

export function AsteroidImpactAnimationComponent({ scrollProgress }: { scrollProgress: number }) {
  const [hasImpacted, setHasImpacted] = useState(false)
  const [showExplosion, setShowExplosion] = useState(false)

  const impactPoint = 0.85
  const isImpacting = scrollProgress >= impactPoint

  useEffect(() => {
    if (isImpacting && !hasImpacted) {
      setHasImpacted(true)
      setShowExplosion(true)
      setTimeout(() => setShowExplosion(false), 2000)
    }
  }, [isImpacting, hasImpacted])

  const asteroidProgress = Math.min(scrollProgress / impactPoint, 1)
  const asteroidX = 85 - asteroidProgress * 30
  const asteroidY = -10 + asteroidProgress * 55
  const asteroidScale = 0.4 + asteroidProgress * 0.4

  return (
    <div className="relative w-full h-[600px] flex items-center justify-center overflow-hidden">
      {/* Earth */}
      <div className="relative w-[300px] h-[300px] rounded-full overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.8)]">
        <Image src="/earth-realistic.jpg" alt="Earth" fill className="object-cover" priority />

        {showExplosion && (
          <div
            className="absolute"
            style={{
              left: "55%",
              top: "45%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className="w-16 h-16 rounded-full"
              style={{
                background: "radial-gradient(circle, rgba(255,100,0,1) 0%, rgba(200,50,0,0.8) 30%, transparent 60%)",
                animation: "craterGlow 2s ease-out forwards",
              }}
            />
          </div>
        )}
      </div>

      {/* Asteroid approaching */}
      {!isImpacting && (
        <div
          className="absolute pointer-events-none transition-all duration-75 ease-linear"
          style={{
            left: `${asteroidX}%`,
            top: `${asteroidY}%`,
            transform: `translate(-50%, -50%) scale(${asteroidScale}) rotate(${asteroidProgress * 20}deg)`,
          }}
        >
          <div className="relative w-32 h-32">
            <Image
              src="/asteroid-new-1.png"
              alt="Asteroid"
              fill
              className="object-contain"
              style={{
                filter: "drop-shadow(0 0 25px rgba(255,100,0,0.7))",
              }}
            />
          </div>
        </div>
      )}

      {showExplosion && (
        <div
          className="absolute pointer-events-none"
          style={{
            left: "55%",
            top: "45%",
            transform: "translate(-50%, -50%)",
          }}
        >
          {/* Initial impact flash */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full"
            style={{
              background: "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,200,0.9) 20%, transparent 50%)",
              animation: "impactFlash 0.2s ease-out forwards",
            }}
          />

          {/* Hot core */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.9) 0%, rgba(255,220,100,0.8) 25%, rgba(255,150,50,0.6) 50%, transparent 70%)",
              animation: "hotCore 0.8s ease-out forwards",
              animationDelay: "0.1s",
            }}
          />

          {/* Orange fireball */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(255,150,0,0.9) 0%, rgba(255,100,0,0.7) 35%, rgba(220,60,0,0.5) 60%, transparent 80%)",
              animation: "fireballLayer 1.2s ease-out forwards",
              animationDelay: "0.15s",
            }}
          />

          {/* Dark smoke */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(200,50,0,0.6) 0%, rgba(150,30,0,0.4) 40%, rgba(80,20,0,0.2) 70%, transparent 90%)",
              animation: "smokeLayer 1.5s ease-out forwards",
              animationDelay: "0.2s",
            }}
          />

          {/* Shockwaves */}
          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-orange-300/80"
            style={{
              animation: "atmosphericShock 1.3s ease-out forwards",
              animationDelay: "0.1s",
            }}
          />

          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-full border-2 border-red-400/60"
            style={{
              animation: "atmosphericShock 1.5s ease-out forwards",
              animationDelay: "0.3s",
            }}
          />

          {/* Debris particles */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute left-1/2 top-1/2 w-2 h-2 bg-orange-400 rounded-full"
              style={{
                animation: `debris${i % 4} 1.2s ease-out forwards`,
                animationDelay: "0.15s",
              }}
            />
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes impactFlash {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.5);
            opacity: 0;
          }
        }

        @keyframes hotCore {
          0% {
            transform: translate(-50%, -50%) scale(0.2);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2);
            opacity: 0;
          }
        }

        @keyframes fireballLayer {
          0% {
            transform: translate(-50%, -50%) scale(0.3);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(2.8);
            opacity: 0;
          }
        }

        @keyframes smokeLayer {
          0% {
            transform: translate(-50%, -50%) scale(0.4);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(3.5);
            opacity: 0;
          }
        }

        @keyframes atmosphericShock {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
            border-width: 3px;
          }
          100% {
            transform: translate(-50%, -50%) scale(4);
            opacity: 0;
            border-width: 1px;
          }
        }

        @keyframes craterGlow {
          0% {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 1;
          }
          50% {
            transform: translate(-50%, -50%) scale(1.2);
            opacity: 0.8;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.5);
            opacity: 0;
          }
        }

        @keyframes debris0 {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(60px, -40px) scale(0.3);
            opacity: 0;
          }
        }

        @keyframes debris1 {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(-50px, -50px) scale(0.3);
            opacity: 0;
          }
        }

        @keyframes debris2 {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(70px, 30px) scale(0.3);
            opacity: 0;
          }
        }

        @keyframes debris3 {
          0% {
            transform: translate(-50%, -50%) translate(0, 0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) translate(-60px, 40px) scale(0.3);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
