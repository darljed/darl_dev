import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getBlogNamePlural } from "@/lib/blog-config"

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        excerpt: true,
        bannerImage: true,
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
      take: 10,
    })

    return NextResponse.json(blogs)
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch ${getBlogNamePlural().toLowerCase()}` },
      { status: 500 }
    )
  }
}