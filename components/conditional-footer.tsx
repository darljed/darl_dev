"use client"

import { usePathname } from "next/navigation"
import { Footer } from "./footer"

export function ConditionalFooter() {
  const pathname = usePathname()
  const isAdminPanel = pathname?.startsWith('/admin')
  
  if (isAdminPanel) {
    return null
  }
  
  return <Footer />
}