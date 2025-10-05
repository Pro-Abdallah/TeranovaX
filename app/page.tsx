"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { AsteroidImpactAnimationComponent } from "@/components/asteroid-impact-animation"
import { FactCardComponent } from "@/components/fact-card"

export default function HomePage() {
  const [scrollY, setScrollY] = useState(0)
  const [scrollProgress, setScrollProgress] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)
  const impactSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)

      if (impactSectionRef.current) {
        const sectionTop = impactSectionRef.current.offsetTop
        const sectionHeight = impactSectionRef.current.offsetHeight
        const windowHeight = window.innerHeight

        const scrollStart = sectionTop - windowHeight
        const scrollRange = sectionHeight + windowHeight * 2
        const rawProgress = (window.scrollY - scrollStart) / scrollRange
        const progress = Math.max(0, Math.min(1, rawProgress))

        setScrollProgress(progress)
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const parallaxOffset = scrollY * 0.5

  return (
    <div className="min-h-screen">
      {/* Hero Section with Floating Asteroids */}
      <section ref={heroRef} className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
        <div
          className="absolute left-[10%] top-[20%] h-32 w-32 transition-transform duration-300 hover:scale-110"
          style={{
            transform: `translateY(${parallaxOffset * 0.3}px) rotate(${scrollY * 0.2}deg)`,
            filter: "drop-shadow(0 0 25px rgba(251, 146, 60, 0.5))",
          }}
        >
          <Image
            src="/asteroid-new-1.png"
            alt="Asteroid"
            width={128}
            height={128}
            className="h-full w-full object-contain"
          />
        </div>
        <div
          className="absolute right-[15%] top-[30%] h-28 w-28 transition-transform duration-300 hover:scale-110"
          style={{
            transform: `translateY(${parallaxOffset * 0.5}px) rotate(${-scrollY * 0.25}deg)`,
            filter: "drop-shadow(0 0 20px rgba(251, 146, 60, 0.5))",
          }}
        >
          <Image
            src="/asteroid-new-2.png"
            alt="Asteroid"
            width={112}
            height={112}
            className="h-full w-full object-contain"
          />
        </div>
        <div
          className="absolute bottom-[20%] left-[20%] h-24 w-24 transition-transform duration-300 hover:scale-110"
          style={{
            transform: `translateY(${parallaxOffset * 0.4}px) rotate(${scrollY * 0.18}deg)`,
            filter: "drop-shadow(0 0 18px rgba(251, 146, 60, 0.5))",
          }}
        >
          <Image
            src="/asteroid-new-3.png"
            alt="Asteroid"
            width={96}
            height={96}
            className="h-full w-full object-contain"
          />
        </div>
        <div
          className="absolute bottom-[30%] right-[10%] h-36 w-36 transition-transform duration-300 hover:scale-110"
          style={{
            transform: `translateY(${parallaxOffset * 0.6}px) rotate(${scrollY * 0.15}deg)`,
            filter: "drop-shadow(0 0 22px rgba(251, 146, 60, 0.5))",
          }}
        >
          <Image
            src="/asteroid-new-4.png"
            alt="Asteroid"
            width={144}
            height={144}
            className="h-full w-full object-contain"
          />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-4xl text-center">
          <h1 className="mb-6 text-6xl font-bold leading-tight tracking-tight text-white md:text-7xl lg:text-8xl">
            What Happens When{" "}
            <span className="bg-gradient-to-r from-orange-400 via-red-400 to-yellow-400 bg-clip-text text-transparent">
              Asteroids Strike Earth?
            </span>
          </h1>
          <p className="mb-8 text-balance text-lg leading-relaxed text-gray-300 md:text-xl">
            Explore the devastating power of asteroid impacts. Predict impact locations, blast radius, and consequences
            through our AI-powered simulation models.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button asChild size="lg" className="bg-orange-500 text-white hover:bg-orange-600 glow-orange">
              <Link href="/simulation">Start Simulation</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 bg-transparent"
            >
              <Link href="#impact-section">Learn More</Link>
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="flex flex-col items-center gap-2">
            <span className="text-sm text-gray-400">Scroll to explore</span>
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section id="impact-section" ref={impactSectionRef} className="relative h-[350vh]">
        <div className="sticky top-0 flex h-screen items-center justify-center overflow-hidden px-4">
          <div
            className="absolute left-[10%] top-[15%] h-28 w-28 opacity-20 transition-transform duration-300"
            style={{
              transform: `translateY(${scrollY * 0.15}px) rotate(${scrollY * 0.05}deg)`,
            }}
          >
            <Image
              src="/planet-saturn-with-rings-space.jpg"
              alt="Saturn"
              width={112}
              height={112}
              className="h-full w-full rounded-full object-cover"
            />
          </div>
          <div
            className="absolute right-[12%] top-[10%] h-24 w-24 opacity-25 transition-transform duration-300"
            style={{
              transform: `translateY(${scrollY * 0.12}px) rotate(${-scrollY * 0.06}deg)`,
            }}
          >
            <Image
              src="/planet-venus-orange-atmosphere.jpg"
              alt="Venus"
              width={96}
              height={96}
              className="h-full w-full rounded-full object-cover"
            />
          </div>

          <div className="container mx-auto max-w-6xl">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {/* Animation Side */}
              <div className="relative flex items-center justify-center">
                <AsteroidImpactAnimationComponent scrollProgress={scrollProgress} />
              </div>

              {/* Content Side */}
              <div className="flex flex-col justify-center">
                <h2 className="mb-6 text-4xl font-bold leading-tight tracking-tight text-white md:text-5xl">
                  The Asteroid Threat
                </h2>
                <div className="space-y-4 text-pretty leading-relaxed text-gray-300">
                  <p>
                    When an asteroid collides with Earth, the result is one of the most catastrophic events imaginable.
                    The immense kinetic energy creates devastating shockwaves, extreme heat, and widespread destruction.
                  </p>
                  <p>
                    Our AI models analyze asteroid parameters including diameter, velocity, and angular velocity to
                    predict the exact impact location (latitude and longitude) and the resulting blast radius. These
                    predictions help us understand the potential consequences of near-Earth objects.
                  </p>
                  <p>
                    The simulation uses machine learning trained on historical asteroid data to provide accurate
                    predictions of impact dynamics, helping scientists and researchers prepare for potential threats.
                  </p>
                </div>
                <div className="mt-8">
                  <Button asChild size="lg" className="bg-red-500 text-white hover:bg-red-600 glow-red">
                    <Link href="/simulation">Try the Simulator</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fun Facts Section */}
      <section className="relative px-4 py-20">
        <div className="container mx-auto max-w-6xl">
          <h2 className="mb-12 text-center text-4xl font-bold tracking-tight text-white md:text-5xl">
            Asteroid Impact Facts
          </h2>
          <div className="grid gap-6 md:grid-cols-3">
            <FactCardComponent
              title="Chicxulub Impact"
              description="66 million years ago, a 10-15km asteroid struck Earth near Mexico, releasing energy equivalent to 10 billion atomic bombs and causing the extinction of 75% of all species including dinosaurs."
              icon="🦖"
            />
            <FactCardComponent
              title="Jupiter's Shield"
              description="Jupiter acts as Earth's protector, with its massive gravity attracting asteroids. In 1994, Comet Shoemaker-Levy 9 broke into 21 pieces and crashed into Jupiter, creating Earth-sized impact scars."
              icon="🪐"
            />
            <FactCardComponent
              title="Mars Crater Record"
              description="Mars has over 43,000 impact craters larger than 5km. The Hellas Basin, created by an ancient asteroid impact, is 2,300km wide and 9km deep - one of the largest impact craters in our solar system."
              icon="🔴"
            />
          </div>
        </div>
      </section>
    </div>
  )
}
