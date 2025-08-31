"use client"

import { Button } from "@/components/ui/button"

export function HeroSection() {
  const scrollToContact = () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative">
      <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{backgroundImage: 'url(/banner.jpg)', filter: 'blur(2px)'}}></div>
      <div className="absolute inset-0 bg-black/60 dark:bg-black/70"></div>
      <div className="container mx-auto px-4 text-center relative z-10">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 bg-clip-text text-transparent">
          Your shortcut to smart solutions
        </h1>
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto drop-shadow-md">
          Helping small businesses and professionals thrive with automation, AI, and modern web solutions.
        </p>
        <Button onClick={scrollToContact} size="lg" className="text-lg px-8 py-6">
          Inquire Now
        </Button>
      </div>
    </section>
  )
}