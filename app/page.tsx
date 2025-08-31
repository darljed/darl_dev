import { HeroSection } from '@/components/hero-section'
import { ServicesSection } from '@/components/services-section'
import { ProductsSection } from '@/components/products-section'
import { BlogSection } from '@/components/blog-section'
import { ContactSection } from '@/components/contact-section'

export default function Home() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ProductsSection />
      <BlogSection />
      <ContactSection />
    </>
  )
}