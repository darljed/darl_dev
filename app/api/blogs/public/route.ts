import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getBlogNamePlural } from "@/lib/blog-config"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const all = searchParams.get('all')
    
    const blogs = await prisma.blog.findMany({
      where: { published: true },
      select: {
        id: true,
        title: true,
        excerpt: true,
        bannerImage: true,
        tags: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: all ? undefined : 10,
    })

    return NextResponse.json(blogs)
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch ${getBlogNamePlural().toLowerCase()}` },
      { status: 500 }
    )
  }
}