import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Zap, Globe, Bot, BarChart3, MessageCircle } from "lucide-react"

const services = [
  {
    icon: Zap,
    title: "Automation",
    description: "Streamline your business processes with intelligent automation solutions that save time and reduce errors."
  },
  {
    icon: Globe,
    title: "Website Building",
    description: "Modern, responsive websites built with the latest technologies to help your business stand out online."
  },
  {
    icon: Bot,
    title: "AI Integrations",
    description: "Leverage artificial intelligence to enhance your business operations and customer experiences."
  },
  {
    icon: BarChart3,
    title: "Data Analytics",
    description: "Transform your data into actionable insights with advanced analytics and monitoring solutions."
  },
  {
    icon: Zap,
    title: "Splunk Integrations and Development",
    description: "Custom Splunk solutions, app development, and enterprise integrations to maximize your data platform investment."
  },
  {
    icon: MessageCircle,
    title: "Consultation",
    description: "Expert guidance to help you make informed decisions about your technology strategy and implementation."
  }
]

export function ServicesSection() {
  return (
    <section id="services" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Our Services</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Comprehensive solutions to help your business grow and succeed in the digital age
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 group">
              <CardHeader>
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <service.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">{service.description}</CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}