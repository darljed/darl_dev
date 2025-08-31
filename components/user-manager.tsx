"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Edit, Trash2, Search } from "lucide-react"
import { toast } from "sonner"

interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

export function UserManager() {
  const { data: session } = useSession()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("ALL")
  const [page, setPage] = useState(1)
  const [usersPerPage, setUsersPerPage] = useState(10)
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 0 })
  const [showDialog, setShowDialog] = useState(false)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [formData, setFormData] = useState({ name: "", email: "", password: "", role: "USER" })

  const isAdmin = session?.user?.role === "ADMIN"

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: usersPerPage.toString(),
        ...(search && { search }),
        ...(roleFilter !== "ALL" && { role: roleFilter })
      })
      
      const res = await fetch(`/api/users?${params}`)
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
        setPagination(data.pagination || { page: 1, limit: 10, total: 0, pages: 0 })
      } else {
        toast.error("Failed to fetch users")
      }
    } catch (error) {
      console.error("Failed to fetch users:", error)
      toast.error("Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [page, search, roleFilter, usersPerPage])

  useEffect(() => {
    setPage(1) // Reset to first page when changing filters
  }, [search, roleFilter, usersPerPage])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const method = editingUser ? "PUT" : "POST"
      const url = editingUser ? `/api/users/${editingUser.id}` : "/api/users"
      
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      })

      if (res.ok) {
        setShowDialog(false)
        setEditingUser(null)
        setFormData({ name: "", email: "", password: "", role: "USER" })
        fetchUsers()
        toast.success(editingUser ? "User updated successfully" : "User created successfully")
      } else {
        toast.error(editingUser ? "Failed to update user" : "Failed to create user")
      }
    } catch (error) {
      console.error("Failed to save user:", error)
      toast.error(editingUser ? "Failed to update user" : "Failed to create user")
    }
  }

  const handleEdit = (user: User) => {
    const canEdit = isAdmin || session?.user?.id === user.id
    if (!canEdit) return

    setEditingUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: "",
      role: user.role
    })
    setShowDialog(true)
  }

  const handleDelete = async (id: string) => {
    if (!isAdmin) return

    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" })
      if (res.ok) {
        fetchUsers()
        toast.success("User deleted successfully")
      } else {
        toast.error("Failed to delete user")
      }
    } catch (error) {
      console.error("Failed to delete user:", error)
      toast.error("Failed to delete user")
    }
  }

  const canEditUser = (user: User) => isAdmin || session?.user?.id === user.id

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Users</h1>
        {isAdmin && (
          <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <DialogTrigger asChild>
              <Button onClick={() => {
                setEditingUser(null)
                setFormData({ name: "", email: "", password: "", role: "USER" })
              }}>
                <Plus className="mr-2 h-4 w-4" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingUser ? "Edit User" : "Add New User"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Password {editingUser && "(leave blank to keep current)"}</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingUser}
                  />
                </div>
                {isAdmin && (
                  <div>
                    <Label htmlFor="role">Role</Label>
                    <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USER">User</SelectItem>
                        <SelectItem value="POWER_USER">Power User</SelectItem>
                        <SelectItem value="ADMIN">Admin</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className="flex gap-2">
                  <Button type="submit">Save</Button>
                  <Button type="button" variant="outline" onClick={() => setShowDialog(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All Roles</SelectItem>
                <SelectItem value="USER">User</SelectItem>
                <SelectItem value="POWER_USER">Power User</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            <Select value={usersPerPage.toString()} onValueChange={(value) => setUsersPerPage(Number(value))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5">5 per page</SelectItem>
                <SelectItem value="10">10 per page</SelectItem>
                <SelectItem value="20">20 per page</SelectItem>
                <SelectItem value="50">50 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div>Loading users...</div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    {isAdmin && <TableHead>Email</TableHead>}
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell>{user.name}</TableCell>
                      {isAdmin && <TableCell>{user.email}</TableCell>}
                      <TableCell>
                        <span className={`px-2 py-1 text-xs rounded ${
                          user.role === 'ADMIN' ? 'bg-red-600 text-red-100' :
                          user.role === 'POWER_USER' ? 'bg-blue-800 text-blue-100' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {user.role.replace('_', ' ')[0]}
                        </span>
                      </TableCell>
                      <TableCell>{new Date(user.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          {canEditUser(user) && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(user)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          )}
                          {isAdmin && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="destructive" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Delete User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Are you sure you want to delete this user? This action cannot be undone.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(user.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    Delete
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              {pagination.pages > 1 && (
                <div className="flex justify-between items-center mt-4">
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page - 1)}
                      disabled={page === 1}
                    >
                      Previous
                    </Button>
                    {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
                      let pageNum
                      if (pagination.pages <= 5) {
                        pageNum = i + 1
                      } else if (page <= 3) {
                        pageNum = i + 1
                      } else if (page >= pagination.pages - 2) {
                        pageNum = pagination.pages - 4 + i
                      } else {
                        pageNum = page - 2 + i
                      }
                      
                      if (pagination.pages > 5 && i === 4 && pageNum < pagination.pages) {
                        return (
                          <Button
                            key={pagination.pages}
                            variant={page === pagination.pages ? "default" : "outline"}
                            size="sm"
                            onClick={() => setPage(pagination.pages)}
                          >
                            {pagination.pages}
                          </Button>
                        )
                      }
                      
                      return (
                        <Button
                          key={pageNum}
                          variant={page === pageNum ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPage(pageNum)}
                        >
                          {pageNum}
                        </Button>
                      )
                    })}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setPage(page + 1)}
                      disabled={page === pagination.pages}
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}