import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { unlink } from 'fs/promises'
import { join } from 'path'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

export async function deleteImage(imageUrl: string) {
  if (!imageUrl) return

  try {
    if (imageUrl.includes('amazonaws.com')) {
      // Delete from S3
      const key = imageUrl.split('/').pop()
      if (key) {
        const command = new DeleteObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET!,
          Key: key,
        })
        await s3Client.send(command)
      }
    } else if (imageUrl.startsWith('/uploads/')) {
      // Delete from local storage
      const filename = imageUrl.replace('/uploads/', '')
      const filePath = join(process.cwd(), 'public/uploads', filename)
      await unlink(filePath)
    }
  } catch (error) {
    console.error('Failed to delete image:', error)
  }
}