import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { getBlogName, getBlogNamePlural } from "@/lib/blog-config"

const swaggerSpec = {
  openapi: "3.0.0",
  info: {
    title: `${getBlogName()} API`,
    version: "1.0.0",
    description: `API documentation for the ${getBlogName()} application`,
  },
  servers: [
    {
      url: process.env.NEXTAUTH_URL || "http://localhost:3000",
      description: "Development server",
    },
  ],
  paths: {
    "/api/auth/register": {
      post: {
        summary: "Register a new user",
        tags: ["Authentication"],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  name: { type: "string" },
                  email: { type: "string", format: "email" },
                  password: { type: "string", minLength: 6 },
                },
                required: ["name", "email", "password"],
              },
            },
          },
        },
        responses: {
          201: { description: "User created successfully" },
          400: { description: "Bad request" },
        },
      },
    },
    "/api/blogs": {
      get: {
        summary: `Get all ${getBlogNamePlural().toLowerCase()}`,
        tags: [getBlogNamePlural()],
        security: [{ bearerAuth: [] }],
        responses: {
          200: { description: `List of ${getBlogNamePlural().toLowerCase()}` },
          401: { description: "Unauthorized" },
        },
      },
      post: {
        summary: `Create a new ${getBlogName().toLowerCase()}`,
        tags: [getBlogNamePlural()],
        security: [{ bearerAuth: [] }],
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  title: { type: "string" },
                  content: { type: "string" },
                  excerpt: { type: "string" },
                  tags: { type: "string" },
                  bannerImage: { type: "string" },
                  published: { type: "boolean" },
                },
                required: ["title", "content"],
              },
            },
          },
        },
        responses: {
          201: { description: `${getBlogName()} created successfully` },
          400: { description: "Bad request" },
          401: { description: "Unauthorized" },
        },
      },
    },
  },
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      )
    }

    return NextResponse.json(swaggerSpec)
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}