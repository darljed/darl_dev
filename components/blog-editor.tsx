"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Label } from "./ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { RichTextEditor } from "./rich-text-editor"
import { ImageUpload } from "./image-upload"
import { Save, X } from "lucide-react"
import { getBlogName } from "../lib/blog-config"
import { toast } from "sonner"

interface BlogEditorProps {
  blog?: any
  onSave: () => void
  onCancel: () => void
}

export function BlogEditor({ blog, onSave, onCancel }: BlogEditorProps) {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [excerpt, setExcerpt] = useState("")
  const [tags, setTags] = useState("")
  const [bannerImage, setBannerImage] = useState("")
  const [published, setPublished] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (blog) {
      setTitle(blog.title || "")
      setContent(blog.content || "")
      setExcerpt(blog.excerpt || "")
      setTags(blog.tags || "")
      setBannerImage(blog.bannerImage || "")
      setPublished(blog.published || false)
    }
  }, [blog])

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const method = blog ? "PUT" : "POST"
      const url = blog ? `/api/blogs/${blog.id}` : "/api/blogs"

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          content,
          excerpt,
          tags,
          bannerImage,
          published,
        }),
      })

      if (res.ok) {
        onSave()
      } else {
        toast.error(`Failed to save ${getBlogName().toLowerCase()}`)
      }
    } catch (error) {
      console.error(`Failed to save ${getBlogName().toLowerCase()}:`, error)
      toast.error(`Failed to save ${getBlogName().toLowerCase()}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">
          {blog ? `Edit ${getBlogName()}` : `Create New ${getBlogName()}`}
        </h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <X className="mr-2 h-4 w-4" />
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{getBlogName()} Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={`Enter ${getBlogName().toLowerCase()} title`}
            />
          </div>

          <div>
            <Label htmlFor="excerpt">Excerpt</Label>
            <Input
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder={`Brief description of the ${getBlogName().toLowerCase()}`}
            />
          </div>

          <div>
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Comma-separated tags"
            />
          </div>

          <div>
            <Label>Banner Image</Label>
            <ImageUpload
              value={bannerImage}
              onChange={setBannerImage}
            />
          </div>

          <div>
            <Label htmlFor="content">Content</Label>
            <RichTextEditor
              content={content}
              onChange={setContent}
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              id="published"
              type="checkbox"
              checked={published}
              onChange={(e) => setPublished(e.target.checked)}
            />
            <Label htmlFor="published">Publish immediately</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}