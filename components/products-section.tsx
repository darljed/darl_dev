import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"

const products = [
  {
    id: "ai-chatbot-platform",
    title: "AI Chatbot Platform",
    description: "Intelligent conversational AI that helps businesses automate customer support and engagement.",
    image: "/products/ai-chat-bot.jpg"
  },
  {
    id: "business-automation-suite",
    title: "Business Automation Suite",
    description: "Complete workflow automation solution for small to medium businesses.",
    image: "/products/business-suite.webp"
  },
  {
    id: "data-analytics-dashboard",
    title: "Data Analytics Dashboard",
    description: "Real-time business intelligence and analytics platform with customizable dashboards.",
    image: "/products/data-analytics.webp"
  }
]

const clients = [
  "Christ-Driven Christian Fellowship Inc.", "CoorDIY", "Bitsly I.T. Solutions"
]

export function ProductsSection() {
  return (
    <section id="products" className="py-20 bg-muted/50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Latest Products</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Innovative solutions designed to transform your business operations
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20 ">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div style={{ backgroundImage: `url(${product.image})` }} className="aspect-video bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 bg-cover bg-no-repeat bg-center"></div>
              <CardHeader>
                <CardTitle>{product.title}</CardTitle>
                <CardDescription>{product.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href={`/products/${product.id}`}>
                  <Button variant="outline" className="w-full">Read More</Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mb-8">
          <h3 className="text-2xl font-semibold mb-8">Trusted by our Partners</h3>
        </div>
        
        <div className="overflow-hidden">
          <div className="flex animate-marquee space-x-12">
            {[...clients, ...clients, ...clients, ...clients].map((client, index) => (
              <div key={index} className="flex-shrink-0 text-lg font-medium text-muted-foreground whitespace-nowrap">
                {client}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}