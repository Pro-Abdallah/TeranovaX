import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AboutPage() {
  return (
    <div className="container mx-auto min-h-screen px-4 py-12">
      {/* Hero Section */}
      <div className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold tracking-tight text-white md:text-6xl">About AsteroidStrike</h1>
        <p className="mx-auto max-w-2xl text-balance text-lg leading-relaxed text-gray-300">
          An interactive educational platform exploring asteroid impact predictions through AI-powered machine learning
          models
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="mb-16 grid gap-8 lg:grid-cols-2">
        {/* About the Project */}
        <Card className="border-orange-500/20 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-orange-400">About the Project</CardTitle>
            <CardDescription>Understanding asteroid impacts</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-pretty leading-relaxed text-gray-300">
            <p>
              AsteroidStrike is an educational web application designed to make complex asteroid impact physics
              accessible and engaging. We combine stunning visual animations with AI-powered machine learning models to
              help users understand what happens when asteroids collide with Earth.
            </p>
            <p>
              Asteroid impacts are among the most dramatic events that can affect our planet, capable of causing massive
              destruction and reshaping landscapes. Our platform allows you to explore these phenomena safely, adjusting
              parameters like diameter, velocity, and angular velocity to see how they affect impact outcomes.
            </p>
            <p>
              Whether you're a student, educator, or space enthusiast, AsteroidStrike provides an intuitive interface to
              explore asteroid trajectories and understand the fundamental forces that govern these cosmic threats.
            </p>
          </CardContent>
        </Card>

        {/* The Simulation Model */}
        <Card className="border-red-500/20 bg-white/5 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-red-400">The AI Models</CardTitle>
            <CardDescription>How our machine learning predictions work</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-pretty leading-relaxed text-gray-300">
            <p>
              Our prediction engine uses three trained machine learning models to forecast asteroid impact scenarios.
              The models analyze multiple factors including:
            </p>
            <ul className="list-inside list-disc space-y-2">
              <li>Asteroid diameter and mass</li>
              <li>Entry velocity and trajectory angle</li>
              <li>Angular velocity and rotation</li>
              <li>Impact coordinates (latitude and longitude)</li>
              <li>Predicted blast radius</li>
            </ul>
            <p>
              The AI models use linear regression trained on historical asteroid data to calculate impact location and
              blast radius. Each prediction includes a confidence score to help you understand the reliability of the
              forecast.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* How to Use Section */}
      <div className="mb-16">
        <h2 className="mb-8 text-center text-4xl font-bold tracking-tight text-white">How to Use AsteroidStrike</h2>
        <div className="grid gap-6 md:grid-cols-3">
          <StepCard
            number="1"
            title="Explore the Home Page"
            description="Start by scrolling through the interactive home page to see an asteroid approaching Earth and learn about impact physics through engaging animations."
          />
          <StepCard
            number="2"
            title="Configure Your Simulation"
            description="Navigate to the Simulation page and choose preset asteroids or customize your own. Adjust diameter, velocity, and angular velocity to create unique scenarios."
          />
          <StepCard
            number="3"
            title="Analyze Results"
            description="Run the simulation to receive AI-powered predictions including impact coordinates, blast radius, and confidence scores for each prediction."
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="mb-16">
        <h2 className="mb-8 text-center text-4xl font-bold tracking-tight text-white">Key Features</h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            title="Interactive Animations"
            description="Smooth parallax scrolling and dynamic asteroid movements create an immersive experience"
            gradient="from-orange-500 to-red-600"
          />
          <FeatureCard
            title="AI-Powered Predictions"
            description="Three trained ML models predict impact location and blast radius with confidence scores"
            gradient="from-red-500 to-pink-600"
          />
          <FeatureCard
            title="Real Asteroid Data"
            description="Use historical asteroid data including Tunguska and Chicxulub events"
            gradient="from-amber-500 to-orange-600"
          />
          <FeatureCard
            title="Educational Content"
            description="Learn fascinating facts about asteroid physics and impact scenarios"
            gradient="from-yellow-500 to-red-600"
          />
        </div>
      </div>

      {/* Technology Stack */}
      <Card className="mb-16 border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Technology Stack</CardTitle>
          <CardDescription>Built with modern web technologies</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <TechItem name="Next.js" description="React framework for production" />
            <TechItem name="TypeScript" description="Type-safe development" />
            <TechItem name="Tailwind CSS" description="Utility-first styling" />
            <TechItem name="Machine Learning" description="Linear regression models" />
            <TechItem name="Canvas API" description="Dynamic visualizations" />
            <TechItem name="REST API" description="Backend prediction engine" />
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-red-500/10 to-orange-500/10 p-12 text-center backdrop-blur-sm">
        <h2 className="mb-4 text-3xl font-bold text-white">Ready to Explore?</h2>
        <p className="mb-8 text-balance text-lg text-gray-300">
          Start predicting asteroid impacts and discover the physics of these cosmic threats
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button asChild size="lg" className="bg-orange-500 text-white hover:bg-orange-600 glow-orange">
            <Link href="/simulation">Launch Simulator</Link>
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="border-white/20 bg-transparent text-white hover:bg-white/10"
          >
            <Link href="/">Back to Home</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

function StepCard({ number, title, description }: { number: string; title: string; description: string }) {
  return (
    <div className="relative rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-red-600 text-xl font-bold text-white">
        {number}
      </div>
      <h3 className="mb-3 text-xl font-bold text-white">{title}</h3>
      <p className="text-pretty leading-relaxed text-gray-300">{description}</p>
    </div>
  )
}

function FeatureCard({ title, description, gradient }: { title: string; description: string; gradient: string }) {
  return (
    <div className="group rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/10">
      <div className={`mb-4 h-1 w-12 rounded-full bg-gradient-to-r ${gradient}`} />
      <h3 className="mb-2 text-xl font-bold text-white">{title}</h3>
      <p className="text-pretty leading-relaxed text-gray-300">{description}</p>
    </div>
  )
}

function TechItem({ name, description }: { name: string; description: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/5 p-4">
      <h4 className="mb-1 font-bold text-white">{name}</h4>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
  )
}
