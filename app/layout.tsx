import type React from "react"
import type { Metadata } from "next"
import { Inter, Space_Mono } from "next/font/google"
import "./globals.css"
import { Navbar } from "@/components/navbar"
import { Starfield } from "@/components/starfield"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
})

const spaceMono = Space_Mono({
  variable: "--font-space-mono",
  subsets: ["latin"],
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "AsteroidStrike - AI-Powered Impact Prediction Simulator",
  description:
    "Predict asteroid impact locations and blast radius using machine learning models trained on real asteroid data",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceMono.variable}`}>
      <body className="antialiased">
        <Starfield />
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  )
}
