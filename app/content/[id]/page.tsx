"use client"

import { notFound } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/ui/card"
import { Button } from "../../../components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import MarkdownPreview from "@uiw/react-markdown-preview"

interface BlogPageProps {
  params: Promise<{ id: string }>
}

export default function BlogPage({ params }: BlogPageProps) {
  const [blog, setBlog] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [id, setId] = useState<string>('')

  useEffect(() => {
    params.then(({ id }) => {
      setId(id)
      fetchBlog(id)
    })
  }, [params])

  const fetchBlog = async (blogId: string) => {
    try {
      const res = await fetch(`/api/blogs/public/${blogId}`)
      if (res.ok) {
        const data = await res.json()
        setBlog(data)
      } else {
        notFound()
      }
    } catch (error) {
      console.error('Failed to fetch blog:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="container py-16"><div className="text-center">Loading...</div></div>
  }

  if (!blog) {
    notFound()
  }



  return (
    <div className="container py-16">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="ghost" className="mb-6">
          <Link href="/blogs">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Blogs
          </Link>
        </Button>
        
        <Card>
          {blog.bannerImage && (
            <div className="aspect-video overflow-hidden rounded-t-lg">
              <img
                src={blog.bannerImage}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <CardHeader>
            <CardTitle className="text-3xl">{blog.title}</CardTitle>
            <div className="flex items-center gap-4 text-muted-foreground">
              <span>By {blog.author.name}</span>
              <span>•</span>
              <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
            </div>
          </CardHeader>
          
          <CardContent>
            <MarkdownPreview 
              source={blog.content}
              style={{ backgroundColor: 'transparent' }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}