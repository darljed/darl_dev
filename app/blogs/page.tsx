"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Tag, Calendar, User } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface Blog {
  id: string
  title: string
  excerpt: string
  bannerImage?: string
  tags?: string
  createdAt: string
  author: {
    name: string
  }
}

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [selectedTag, setSelectedTag] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [blogsPerPage, setBlogsPerPage] = useState(6)
  const [availableTags, setAvailableTags] = useState<string[]>([])

  useEffect(() => {
    fetchBlogs()
  }, [])

  useEffect(() => {
    filterBlogs()
  }, [blogs, search, selectedTag])

  const fetchBlogs = async () => {
    try {
      const res = await fetch("/api/blogs/public?all=true")
      if (res.ok) {
        const data = await res.json()
        setBlogs(data)
        setFilteredBlogs(data)
        
        // Extract unique tags
        const tags = new Set<string>()
        data.forEach((blog: Blog) => {
          if (blog.tags) {
            blog.tags.split(',').forEach(tag => tags.add(tag.trim()))
          }
        })
        setAvailableTags(Array.from(tags))
      }
    } catch (error) {
      console.error("Failed to fetch blogs:", error)
      toast.error("Failed to load blogs")
    } finally {
      setLoading(false)
    }
  }

  const filterBlogs = () => {
    let filtered = blogs.filter((blog) => {
      const searchLower = search.toLowerCase()
      const matchesSearch = !search || 
        blog.title.toLowerCase().includes(searchLower) ||
        blog.excerpt?.toLowerCase().includes(searchLower)
      const matchesTag = !selectedTag || blog.tags?.toLowerCase().includes(selectedTag.toLowerCase())
      
      return matchesSearch && matchesTag
    })
    setFilteredBlogs(filtered)
    setCurrentPage(1)
  }

  const paginatedBlogs = filteredBlogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  )

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage)

  const renderPagination = () => {
    if (totalPages <= 1) return null

    return (
      <div className="flex justify-center items-center gap-1 mt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        
        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
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
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={currentPage >= totalPages}
        >
          Next
        </Button>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center py-8">Loading blogs...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-4">Our Blogs</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Discover insights, tutorials, and stories from our team
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="space-y-6 sticky top-8">
              {/* Search */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Search className="h-5 w-5" />
                    Search
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Input
                    placeholder="Search blogs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </CardContent>
              </Card>

              {/* Tags Filter */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Tag className="h-5 w-5" />
                    Topics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button
                      variant={selectedTag === "" ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedTag("")}
                    >
                      All Topics
                    </Button>
                    {availableTags.map((tag) => (
                      <Button
                        key={tag}
                        variant={selectedTag === tag ? "default" : "ghost"}
                        className="w-full justify-start"
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Posts per page */}
              <Card>
                <CardHeader>
                  <CardTitle>Posts per page</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select value={blogsPerPage.toString()} onValueChange={(value) => setBlogsPerPage(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="6">6 posts</SelectItem>
                      <SelectItem value="12">12 posts</SelectItem>
                      <SelectItem value="18">18 posts</SelectItem>
                      <SelectItem value="24">24 posts</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:w-3/4">
            {filteredBlogs.length === 0 ? (
              <div className="text-center py-12">
                <div className="h-40 border rounded-md flex justify-center items-center">
                  <p className="text-muted-foreground">No blogs found matching your criteria.</p>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {paginatedBlogs.map((blog) => (
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
                      <CardContent className="flex-1 flex flex-col">
                        <p className="text-muted-foreground line-clamp-3 mb-4 flex-1">
                          {blog.excerpt || "No excerpt available"}
                        </p>
                        
                        {blog.tags && (
                          <div className="flex flex-wrap gap-1 mb-4">
                            {blog.tags.split(',').slice(0, 3).map((tag, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-muted text-muted-foreground text-xs rounded"
                              >
                                {tag.trim()}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        <div className="flex justify-between items-center text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {blog.author.name}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {new Date(blog.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        
                        <Button asChild variant="outline" size="sm" className="mt-auto">
                          <Link href={`/content/${blog.id}`}>Read More</Link>
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {renderPagination()}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}