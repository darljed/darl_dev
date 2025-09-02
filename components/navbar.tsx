"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "./ui/button"
import { ThemeToggle } from "./theme-toggle"
import { motion } from "framer-motion"
import { canAccessAdmin } from "../lib/permissions"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const isAdminPanel = pathname?.startsWith('/admin')
  const [showMobileMenu, setShowMobileMenu] = useState(false)

  const handleNavigation = (sectionId: string) => {
    if (pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    } else {
      router.push(`/#${sectionId}`)
    }
  }

  return (
    <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 relative">
      <div className={`flex h-16 items-center justify-between ${isAdminPanel ? 'px-6' : 'container'}`}>
        <div className="flex items-center gap-4">
          {isAdminPanel && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => (window as any).toggleAdminSidebar?.()}
            >
              <Menu className="h-4 w-4" />
            </Button>
          )}
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
        </div>
        
        <div className="flex items-center gap-4">
          {!isAdminPanel && (
            <>
              <div className="hidden md:flex space-x-8">
                <button onClick={() => handleNavigation("hero")} className="hover:text-primary transition-colors">Home</button>
                <button onClick={() => handleNavigation("services")} className="hover:text-primary transition-colors">Services</button>
                <button onClick={() => handleNavigation("products")} className="hover:text-primary transition-colors">Products</button>
                <Link href="/blogs" className="hover:text-primary transition-colors">Blogs</Link>
                <button onClick={() => handleNavigation("contact")} className="hover:text-primary transition-colors">Contact</button>
              </div>
              <ThemeToggle />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="md:hidden"
              >
                {showMobileMenu ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
              </Button>
            </>
          )}
        </div>
      </div>
      
      {/* Mobile Menu */}
      <div className={`md:hidden border-t bg-background shadow-lg transition-all duration-300 ease-in-out overflow-hidden ${showMobileMenu ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="container py-4 space-y-2">
          <button onClick={() => { handleNavigation("hero"); setShowMobileMenu(false) }} className="block w-full text-left py-2 hover:text-primary transition-colors">Home</button>
          <button onClick={() => { handleNavigation("services"); setShowMobileMenu(false) }} className="block w-full text-left py-2 hover:text-primary transition-colors">Services</button>
          <button onClick={() => { handleNavigation("products"); setShowMobileMenu(false) }} className="block w-full text-left py-2 hover:text-primary transition-colors">Products</button>
          <Link href="/blogs" onClick={() => setShowMobileMenu(false)} className="block w-full text-left py-2 hover:text-primary transition-colors">Blogs</Link>
          <button onClick={() => { handleNavigation("contact"); setShowMobileMenu(false) }} className="block w-full text-left py-2 hover:text-primary transition-colors">Contact</button>
        </div>
      </div>
    </nav>
  )
}