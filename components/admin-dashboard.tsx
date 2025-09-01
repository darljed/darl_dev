"use client"

import { useState, useEffect } from "react"
import { AdminSidebar } from "@/components/admin-sidebar"
import { BlogManager } from "@/components/blog-manager"
import { DashboardStats } from "@/components/dashboard-stats"
import { UserManager } from "@/components/user-manager"

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  useEffect(() => {
    // Expose toggle function to window for navbar access
    (window as any).toggleAdminSidebar = () => setSidebarOpen(!sidebarOpen)
    return () => {
      delete (window as any).toggleAdminSidebar
    }
  }, [sidebarOpen])

  return (
    <div className="flex h-screen relative">
      {sidebarOpen && (
        <>
          <div 
            className="fixed inset-0 bg-black/50 z-40 lg:hidden" 
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed lg:sticky lg:top-0 z-50 h-screen top-0">
            <AdminSidebar 
              activeTab={activeTab} 
              setActiveTab={setActiveTab}
              onClose={() => setSidebarOpen(false)}
            />
          </div>
        </>
      )}
      
      <main className="flex-1 overflow-y-auto p-6">
        {activeTab === "dashboard" && <DashboardStats />}
        {activeTab === "blogs" && <BlogManager />}
        {activeTab === "users" && <UserManager />}
      </main>
    </div>
  )
}