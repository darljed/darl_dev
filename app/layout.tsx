import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { SessionProvider } from '@/components/session-provider'
import { Navbar } from '@/components/navbar'
import { Footer } from '@/components/footer'
import { Toaster } from 'sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: "Darl | Your Shortcut to Smart Solutions",
  description:
    "Darl helps small businesses and professionals embrace digital transformation with web development, automation, AI integration, and data analytics. Start your digital journey today.",
  keywords: [
    "digital transformation",
    "small business automation",
    "AI integration",
    "business automation",
    "web development for SMB",
    "Splunk solutions",
    "data analytics",
    "Next.js web development",
    "automation for small businesses"
  ],
  openGraph: {
    title: "Darl | Your Shortcut to Smart Solutions",
    description:
      "Helping small businesses and professionals thrive with automation, AI, and modern web solutions. Get started with Darl today.",
    url: "https://darl.dev",
    siteName: "Darl",
    images: [
      {
        url: "https://darl.dev/og-image.png",
        width: 1200,
        height: 630,
        alt: "Darl - Your Shortcut to Smart Solutions",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Darl | Your Shortcut to Smart Solutions",
    description:
      "Empowering small businesses with automation, AI, and modern web solutions. Start your journey with Darl today.",
    images: ["https://darl.dev/og-image.png"],
  },
  alternates: {
    canonical: "https://darl.dev",
  },
  icons: {
    icon: "/favicon.ico",
  },
  themeColor: "#0f172a",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <SessionProvider>
            <div className="min-h-screen flex flex-col">
              <Navbar />
              <main className="flex-1 mt-10">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster richColors position="top-right" />
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}