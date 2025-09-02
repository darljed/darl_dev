"use client"

import { LayoutDashboard, FileText, Users, LogOut } from "lucide-react"
import { Button } from "./ui/button"
import { motion } from "framer-motion"
import { getBlogNamePlural } from "../lib/blog-config"
import { ThemeToggle } from "./theme-toggle"
import { signOut, useSession } from "next-auth/react"

interface AdminSidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  onClose?: () => void
}

export function AdminSidebar({ activeTab, setActiveTab, onClose }: AdminSidebarProps) {
  const { data: session } = useSession()
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "blogs", label: getBlogNamePlural(), icon: FileText },
    { id: "users", label: "Users", icon: Users },
  ]

  return (
    <motion.aside
      initial={{ x: -250 }}
      animate={{ x: 0 }}
      className="w-64 bg-card border-r p-6 flex flex-col h-screen pt-6"
    >
      <div>
        <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
        <nav className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <Button
                key={item.id}
                variant={activeTab === item.id ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab(item.id)
                  onClose?.()
                }}
              >
                <Icon className="mr-2 h-4 w-4" />
                {item.label}
              </Button>
            )
          })}
        </nav>
      </div>
      
      <div className="mt-auto space-y-4">
        <div className="text-sm text-muted-foreground px-2">
          Welcome, {session?.user?.name}
        </div>
        <div className="flex items-center justify-between px-2">
          <span className="text-sm">Theme</span>
          <ThemeToggle />
        </div>
        <Button
          variant="ghost"
          className="w-full justify-start text-destructive hover:text-destructive"
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </Button>
      </div>
    </motion.aside>
  )
}