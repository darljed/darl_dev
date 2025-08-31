"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Link from "next/link"
import { toast } from "sonner"

interface Blog {
  id: string
  title: string
  excerpt: string
  bannerImage?: string
  createdAt: string
}

export function BlogSection() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

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

  const nextSlide = () => {
    setCurrentIndex((prev) => {
      const next = prev + 3
      return next >= blogs.length ? 0 : next
    })
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => {
      const next = prev - 3
      return next < 0 ? Math.max(0, blogs.length - 3) : next
    })
  }

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
          <div className="text-center py-8">
            <p className="text-muted-foreground">No blogs available yet.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">Latest Blogs</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with our latest insights and articles
          </p>
        </div>
        
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-2">
              <Button variant="outline" size="icon" onClick={prevSlide}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={nextSlide}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentIndex}
                initial={{ opacity: 0, x: 300 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -300 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                {blogs.slice(currentIndex, currentIndex + 3).concat(
                  currentIndex + 3 > blogs.length ? blogs.slice(0, (currentIndex + 3) % blogs.length) : []
                ).map((blog) => (
                  <Card key={blog.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300 h-full">
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
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
          
          <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: Math.ceil(blogs.length / 3) }).map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index * 3)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  Math.floor(currentIndex / 3) === index
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}