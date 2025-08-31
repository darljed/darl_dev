import Link from 'next/link'
import Image from 'next/image'
import { Facebook, Youtube, Linkedin, Github } from 'lucide-react'

export function Footer() {
  return (
    <footer className="bg-muted/30 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Logo and Copyright */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="mb-2">
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
            <p className="text-sm text-muted-foreground">
              © 2025 Darl. All rights reserved.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="flex gap-6">
            <Link 
              href="/privacy" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link 
              href="/terms" 
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              Terms & Conditions
            </Link>
          </div>

          {/* Social Media Icons */}
          <div className="flex gap-4">
            <Link 
              href="https://facebook.com/darljedm" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </Link>
            <Link 
              href="https://youtube.com/@darljedm" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Youtube className="w-5 h-5" />
            </Link>
            <Link 
              href="https://linkedin.com/in/darljedmatundan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
            <Link 
              href="https://github.com/darljed" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Github className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}