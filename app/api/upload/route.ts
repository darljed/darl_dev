import { NextRequest, NextResponse } from "next/server"
import { writeFile } from "fs/promises"
import { join } from "path"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../lib/auth"
import { uploadToS3 } from "../../../lib/s3"

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    const data = await request.formData()
    const file: File | null = data.get("file") as unknown as File

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate unique filename
    const timestamp = Date.now()
    const filename = `${timestamp}-${file.name}`

    let url: string

    if (process.env.NODE_ENV === "production" && process.env.AWS_S3_BUCKET) {
      // Upload to S3 in production
      url = await uploadToS3(buffer, filename, file.type)
    } else {
      // Save locally in development
      const uploadDir = join(process.cwd(), "public/uploads")
      const path = join(uploadDir, filename)
      await writeFile(path, buffer)
      url = `/uploads/${filename}`
    }

    return NextResponse.json({ url })
  } catch (error) {
    return NextResponse.json(
      { error: "Upload failed" },
      { status: 500 }
    )
  }
}