import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { AIChatbotSection } from '@/components/products/ai-chatbot-section'
import { BusinessAutomationSection } from '@/components/products/business-automation-section'
import { DataAnalyticsSection } from '@/components/products/data-analytics-section'

const blogPosts = {
  "ai-chatbot-platform": {
    title: "AI Chatbot Platform",
    publishedAt: "2024-01-15"
  },
  "business-automation-suite": {
    title: "Business Automation Suite",
    publishedAt: "2024-01-10"
  },
  "data-analytics-dashboard": {
    title: "Data Analytics Dashboard",
    publishedAt: "2024-01-05"
  }
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug as keyof typeof blogPosts]
  
  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-20">
        <Link href="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </Link>
        
        <article className="max-w-4xl mx-auto">
          <header className="mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>
            <p className="text-muted-foreground">Published on {new Date(post.publishedAt).toLocaleDateString()}</p>
          </header>
          
          <div className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-lg mb-8"></div>
          
          {params.slug === 'ai-chatbot-platform' && <AIChatbotSection />}
          {params.slug === 'business-automation-suite' && <BusinessAutomationSection />}
          {params.slug === 'data-analytics-dashboard' && <DataAnalyticsSection />}
        </article>
      </div>
    </div>
  )
}

export function generateStaticParams() {
  return Object.keys(blogPosts).map((slug) => ({
    slug,
  }))
}