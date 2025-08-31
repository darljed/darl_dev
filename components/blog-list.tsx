"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Edit, Trash2, Eye } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"
import { canDeleteBlog, canPublishBlog } from "@/lib/permissions"
import { getBlogName, getBlogNamePlural } from "@/lib/blog-config"
import { toast } from "sonner"

interface BlogListProps {
  blogs: any[]
  loading: boolean
  onEdit: (blog: any) => void
  onRefresh: () => void
  userRole: string
}

export function BlogList({ blogs, loading, onEdit, onRefresh, userRole }: BlogListProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const handleDelete = async (id: string) => {

    try {
      const res = await fetch(`/api/blogs/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        onRefresh()
        toast.success(`${getBlogName()} deleted successfully`)
      } else {
        toast.error(`Failed to delete ${getBlogName().toLowerCase()}`)
      }
    } catch (error) {
      console.error("Failed to delete blog:", error)
      toast.error(`Failed to delete ${getBlogName().toLowerCase()}`)
    }
  }

  const togglePublish = async (blog: any) => {
    try {
      const res = await fetch(`/api/blogs/${blog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...blog,
          published: !blog.published,
        }),
      })

      if (res.ok) {
        onRefresh()
        toast.success(`${getBlogName()} ${!blog.published ? 'published' : 'unpublished'} successfully`)
      } else {
        toast.error(`Failed to ${!blog.published ? 'publish' : 'unpublish'} ${getBlogName().toLowerCase()}`)
      }
    } catch (error) {
      console.error("Failed to update blog:", error)
      toast.error(`Failed to ${!blog.published ? 'publish' : 'unpublish'} ${getBlogName().toLowerCase()}`)
    }
  }

  if (loading) {
    return <div>Loading {getBlogNamePlural().toLowerCase()}...</div>
  }

  if (blogs.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">No {getBlogNamePlural().toLowerCase()} found. Create your first {getBlogName().toLowerCase()}!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="grid gap-6">
      {blogs.map((blog, index) => (
        <motion.div
          key={blog.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <CardTitle className="flex items-center gap-2">
                    {blog.title}
                    <span className={`px-2 py-1 text-xs rounded ${
                      blog.published 
                        ? "bg-green-100 text-green-800" 
                        : "bg-gray-100 text-gray-800"
                    }`}>
                      {blog.published ? "Published" : "Draft"}
                    </span>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                    {blog.excerpt}
                  </p>
                  {blog.tags && (
                    <div className="flex gap-1 mt-2">
                      {blog.tags.split(",").map((tag: string, i: number) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded"
                        >
                          {tag.trim()}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                {blog.bannerImage && (
                  <Image
                    src={blog.bannerImage}
                    alt={blog.title}
                    width={100}
                    height={60}
                    className="rounded object-cover ml-4"
                  />
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onEdit(blog)}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                {canPublishBlog(userRole) && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => togglePublish(blog)}
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    {blog.published ? "Unpublish" : "Publish"}
                  </Button>
                )}
                {canDeleteBlog(userRole) && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete {getBlogName()}</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete this {getBlogName().toLowerCase()}? This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(blog.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}