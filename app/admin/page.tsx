import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "../../lib/auth"
import { AdminDashboard } from "../../components/admin-dashboard"
import { canAccessAdmin } from "../../lib/permissions"

export default async function AdminPage() {
  const session = await getServerSession(authOptions)

  if (!session || !canAccessAdmin(session.user.role)) {
    redirect("/login")
  }

  return <AdminDashboard />
}