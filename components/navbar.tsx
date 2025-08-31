"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "./theme-toggle"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleNavigation = (sectionId: string) => {
    if (pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    } else {
      router.push(`/#${sectionId}`)
    }
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-background/90 backdrop-blur-md border-b transition-all duration-300">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="h-8">
          <Image 
            src={`/light/logo-long-light.png`}
            alt="DarlDev" 
            width={120} 
            height={32}
            className="h-8 w-auto dark:hidden"
          />
          <Image 
            src={`/dark/logo-long-dark.png`}
            alt="DarlDev" 
            width={120} 
            height={32}
            className="h-8 w-auto hidden dark:block"
          />
        </Link>
        <div className="hidden md:flex space-x-8">
          <button onClick={() => handleNavigation("hero")} className="hover:text-primary transition-colors">Home</button>
          <button onClick={() => handleNavigation("services")} className="hover:text-primary transition-colors">Services</button>
          <button onClick={() => handleNavigation("products")} className="hover:text-primary transition-colors">Products</button>
          <button onClick={() => handleNavigation("contact")} className="hover:text-primary transition-colors">Contact</button>
        </div>
        <ThemeToggle />
      </div>
    </nav>
  )
}