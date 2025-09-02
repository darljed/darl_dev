import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../../lib/auth"
import { prisma } from "../../../../lib/prisma"
import { canEditBlog, canDeleteBlog } from "../../../../lib/permissions"
import { deleteImage } from "../../../../lib/file-utils"
import { getBlogName } from "../../../../lib/blog-config"

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !canEditBlog(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    const { title, content, excerpt, tags, bannerImage, published } = await request.json()

    const blog = await prisma.blog.update({
      where: { id },
      data: {
        title,
        content,
        excerpt,
        tags,
        bannerImage,
        published,
      }
    })

    return NextResponse.json(blog)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !canDeleteBlog(session.user.role)) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const { id } = await params
    
    // Get blog to access banner image before deletion
    const blog = await prisma.blog.findUnique({
      where: { id }
    })
    
    if (blog?.bannerImage) {
      await deleteImage(blog.bannerImage)
    }
    
    await prisma.blog.delete({
      where: { id }
    })

    return NextResponse.json({ message: `${getBlogName()} deleted successfully` })
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}