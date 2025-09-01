"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, FolderOpen, Rocket } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import useEmblaCarousel from "embla-carousel-react"
import Autoplay from "embla-carousel-autoplay"

interface Blog {
  id: string
  title: string
  excerpt: string
  bannerImage?: string
  createdAt: string
}

export function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "start" },
    [Autoplay({ delay: 4000, stopOnInteraction: true })]
  )

  useEffect(() => {
    fetchBlogs()
  }, [])

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs/public")
      if (res.ok) {
        const data = await res.json()
        setBlogs(data.slice(0, 6))
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error)
      toast.error("Failed to load blogs")
    } finally {
      setLoading(false)
    }
  }

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  if (loading) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center py-8">Loading blogs...</div>
        </div>
      </section>
    )
  }

  if (blogs.length === 0) {
    return (
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Latest Blogs</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Stay updated with our latest insights and articles
            </p>
          </div>
          <div className="text-center py-8 border rounded-md max-w-2xl m-auto">
            <p className="text-muted-foreground text-center flex justify-center gap-4">
              <FolderOpen /> No blogs available yet.
            </p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="blogs" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Latest Blogs</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with our latest insights and articles
          </p>
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-end mb-4">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={scrollPrev} type="button" aria-label="Previous blogs">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={scrollNext} type="button" aria-label="Next blogs">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="overflow-hidden" ref={emblaRef}>
            <div className="flex">
              {blogs.map((blog) => (
                <div key={blog.id} className="flex-[0_0_100%] md:flex-[0_0_50%] lg:flex-[0_0_33.333%] pl-4">
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full mr-4">
                    {blog.bannerImage && (
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={blog.bannerImage}
                          alt={blog.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground line-clamp-3 mb-4">
                        {blog.excerpt || "No excerpt available"}
                      </p>
                      <div className="flex justify-between items-center">
                        <p className="text-sm text-muted-foreground">
                          {new Date(blog.createdAt).toLocaleDateString()}
                        </p>
                        <Button asChild variant="outline" size="sm">
                          <Link href={`/content/${blog.id}`}>Read More</Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}