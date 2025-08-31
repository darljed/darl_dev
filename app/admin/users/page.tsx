import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { UserManager } from "@/components/user-manager"
import { canAccessAdmin } from "@/lib/permissions"

export default async function UsersPage() {
  const session = await getServerSession(authOptions)

  if (!session || !canAccessAdmin(session.user.role)) {
    redirect("/login")
  }

  return (
    <div className="container py-8">
      <UserManager />
    </div>
  )
}