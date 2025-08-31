import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { canViewStats } from "@/lib/permissions"

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !canViewStats(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const [totalBlogs, publishedBlogs, totalUsers] = await Promise.all([
      prisma.blog.count(),
      prisma.blog.count({ where: { published: true } }),
      prisma.user.count(),
    ])

    return NextResponse.json({
      totalBlogs,
      publishedBlogs,
      totalUsers,
    })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}