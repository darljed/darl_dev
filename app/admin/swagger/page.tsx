import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"
import { authOptions } from "@/lib/auth"
import { SwaggerUI } from "@/components/swagger-ui"

export default async function SwaggerPage() {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== "admin") {
    redirect("/login")
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-6">API Documentation</h1>
      <SwaggerUI />
    </div>
  )
}