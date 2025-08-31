"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BlogEditor } from "@/components/blog-editor"
import { BlogList } from "@/components/blog-list"
import { Plus, Search } from "lucide-react"
import { toast } from "sonner"


import { getBlogName, getBlogNamePlural } from "@/lib/blog-config"

export function BlogManager() {
  const { data: session } = useSession()
  const [mounted, setMounted] = useState(false)
  const [showEditor, setShowEditor] = useState(false)
  const [editingBlog, setEditingBlog] = useState(null)
  const [blogs, setBlogs] = useState([])
  const [filteredBlogs, setFilteredBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [tagFilter, setTagFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [blogsPerPage, setBlogsPerPage] = useState(5)
  const [paginatedBlogs, setPaginatedBlogs] = useState([])

  useEffect(() => {
    setMounted(true)
    fetchBlogs()
  }, [])

  useEffect(() => {
    filterBlogs()
  }, [blogs, search, tagFilter, statusFilter])

  useEffect(() => {
    paginateBlogs()
  }, [filteredBlogs, currentPage, blogsPerPage])

  const paginateBlogs = () => {
    const startIndex = (currentPage - 1) * blogsPerPage
    const endIndex = startIndex + blogsPerPage
    setPaginatedBlogs(filteredBlogs.slice(startIndex, endIndex))
  }

  const filterBlogs = () => {
    let filtered = blogs.filter((blog: any) => {
      const searchLower = search.toLowerCase()
      const matchesSearch = !search || 
        blog.title.toLowerCase().includes(searchLower) ||
        blog.content.toLowerCase().includes(searchLower)
      const matchesTag = !tagFilter || blog.tags?.toLowerCase().includes(tagFilter.toLowerCase())
      const matchesStatus = statusFilter === "all" || 
        (statusFilter === "published" && blog.published) ||
        (statusFilter === "draft" && !blog.published)
      
      return matchesSearch && matchesTag && matchesStatus
    })
    setFilteredBlogs(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs")
      if (res.ok) {
        const data = await res.json()
        setBlogs(data)
        setFilteredBlogs(data)
      } else {
        toast.error("Failed to fetch blogs")
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error)
      toast.error("Failed to fetch blogs")
    } finally {
      setLoading(false)
    }
  }

  const handleCreateNew = () => {
    setEditingBlog(null)
    setShowEditor(true)
  }

  const handleEdit = (blog: any) => {
    setEditingBlog(blog)
    setShowEditor(true)
  }

  const handleSave = () => {
    setShowEditor(false)
    setEditingBlog(null)
    fetchBlogs()
    toast.success(editingBlog ? "Blog updated successfully" : "Blog created successfully")
  }

  const handleCancel = () => {
    setShowEditor(false)
    setEditingBlog(null)
  }

  if (!mounted) {
    return <div>Loading...</div>
  }

  if (showEditor) {
    return (
      <BlogEditor
        blog={editingBlog}
        onSave={handleSave}
        onCancel={handleCancel}
      />
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{getBlogNamePlural()} Management</h1>
        <div className="hidden md:block">
          <Button type="button" onClick={handleCreateNew}>
            <Plus className="mr-2 h-4 w-4" />
            New {getBlogName()}
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-card rounded-lg border">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search title or content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Input
          placeholder="Filter by tag..."
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
        />
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger>
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
        
        <Select value={blogsPerPage.toString()} onValueChange={(value) => setBlogsPerPage(Number(value))}>
          <SelectTrigger>
            <SelectValue placeholder="Per page" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5 per page</SelectItem>
            <SelectItem value="10">10 per page</SelectItem>
            <SelectItem value="20">20 per page</SelectItem>
            <SelectItem value="50">50 per page</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex md:hidden justify-end"> 
        <Button type="button" onClick={handleCreateNew}>
          <Plus className="mr-2 h-4 w-4" />
          New {getBlogName()}
        </Button>
      </div>
      
      <BlogList
        blogs={paginatedBlogs}
        loading={loading}
        onEdit={handleEdit}
        onRefresh={fetchBlogs}
        userRole={session?.user?.role || 'USER'}
      />
      
      {filteredBlogs.length > blogsPerPage && (
        <div className="flex justify-between items-center">
          <div className="flex gap-1">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>
            {Array.from({ length: Math.min(Math.ceil(filteredBlogs.length / blogsPerPage), 5) }, (_, i) => {
              const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage)
              let pageNum
              if (totalPages <= 5) {
                pageNum = i + 1
              } else if (currentPage <= 3) {
                pageNum = i + 1
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + i
              } else {
                pageNum = currentPage - 2 + i
              }
              
              if (totalPages > 5 && i === 4 && pageNum < totalPages) {
                return (
                  <Button
                    key={totalPages}
                    variant={currentPage === totalPages ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(totalPages)}
                  >
                    {totalPages}
                  </Button>
                )
              }
              
              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentPage(pageNum)}
                >
                  {pageNum}
                </Button>
              )
            })}
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage >= Math.ceil(filteredBlogs.length / blogsPerPage)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}