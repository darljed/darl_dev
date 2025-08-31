import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    
    const blog = await prisma.blog.findFirst({
      where: { 
        id,
        published: true 
      },
      include: {
        author: {
          select: {
            name: true
          }
        }
      }
    })

    if (!blog) {
      return NextResponse.json({ error: "Blog not found" }, { status: 404 })
    }

    return NextResponse.json(blog)
  } catch (error) {
    console.error("Failed to fetch blog:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}