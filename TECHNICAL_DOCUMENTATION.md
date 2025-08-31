# Technical Documentation

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Database Schema](#database-schema)
3. [Authentication System](#authentication-system)
4. [Role-Based Access Control](#role-based-access-control)
5. [API Design](#api-design)
6. [Component Architecture](#component-architecture)
7. [State Management](#state-management)
8. [File Upload System](#file-upload-system)
9. [Theme System](#theme-system)
10. [Notification System](#notification-system)
11. [Pagination Implementation](#pagination-implementation)
12. [Rich Text Editor Integration](#rich-text-editor-integration)
13. [Security Considerations](#security-considerations)
14. [Performance Optimizations](#performance-optimizations)
15. [Testing Strategy](#testing-strategy)
16. [Deployment Architecture](#deployment-architecture)

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 with App Router, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes with TypeScript
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Authentication**: NextAuth.js v4
- **UI Components**: Radix UI + Shadcn/UI
- **Rich Text**: Toast UI Editor
- **Notifications**: Sonner
- **File Storage**: Local filesystem / AWS S3
- **Email**: Nodemailer

### Project Structure
```
├── app/                     # Next.js 15 App Router
│   ├── (auth)/             # Route groups for auth pages
│   ├── admin/              # Protected admin routes
│   ├── api/                # API endpoints
│   ├── content/            # Public content pages
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── ui/                 # Base UI components (Shadcn/UI)
│   ├── admin-*.tsx         # Admin-specific components
│   └── *.tsx               # Feature components
├── lib/                    # Utility functions
│   ├── auth.ts             # NextAuth configuration
│   ├── permissions.ts      # RBAC logic
│   ├── prisma.ts           # Database client
│   └── utils.ts            # Helper functions
├── prisma/                 # Database schema & migrations
├── types/                  # TypeScript type definitions
└── public/                 # Static assets
```

## Database Schema

### Core Tables

#### User Table
```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String
  password  String
  role      String   @default("USER") // USER, POWER_USER, ADMIN
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  // Relations
  blogs     Blog[]
  accounts  Account[]
  sessions  Session[]
}
```

#### Blog/Content Table
```prisma
model Blog {
  id          String   @id @default(cuid())
  title       String
  content     String   @db.Text
  excerpt     String?
  tags        String?
  bannerImage String?
  published   Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  // Relations
  authorId    String
  author      User     @relation(fields: [authorId], references: [id], onDelete: Cascade)
}
```

#### NextAuth Tables
```prisma
model Account {
  // NextAuth.js required fields
}

model Session {
  // NextAuth.js required fields
}

model VerificationToken {
  // NextAuth.js required fields
}
```

### Database Design Decisions

1. **String-based Roles**: Uses strings instead of enums for SQLite compatibility
2. **CUID IDs**: More secure than auto-incrementing integers
3. **Cascade Deletes**: Maintains referential integrity
4. **Text Fields**: Supports large content storage
5. **Timestamps**: Automatic creation and update tracking

## Authentication System

### NextAuth.js Configuration

```typescript
// lib/auth.ts
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // Password verification with bcrypt
        // User lookup and validation
      }
    })
  ],
  session: { strategy: "jwt" },
  callbacks: {
    jwt: async ({ token, user }) => {
      // Include user role in JWT
    },
    session: async ({ session, token }) => {
      // Pass role to client session
    }
  }
}
```

### Password Security
- **Hashing**: bcryptjs with salt rounds
- **Reset Tokens**: Secure random tokens with expiration
- **Validation**: Zod schema validation

### Session Management
- **Strategy**: JWT-based sessions
- **Storage**: HTTP-only cookies
- **Expiration**: Configurable session timeout

## Role-Based Access Control

### Role Hierarchy
```typescript
enum Role {
  USER = "USER",           // Basic access
  POWER_USER = "POWER_USER", // Content creation
  ADMIN = "ADMIN"          // Full system access
}
```

### Permission System
```typescript
// lib/permissions.ts
export const canAccessAdmin = (role: string) => 
  ["POWER_USER", "ADMIN"].includes(role)

export const canDeleteBlog = (role: string) => 
  role === "ADMIN"

export const canPublishBlog = (role: string) => 
  ["POWER_USER", "ADMIN"].includes(role)
```

### Route Protection
```typescript
// Middleware approach
export function middleware(request: NextRequest) {
  // Check authentication and authorization
  // Redirect unauthorized users
}

// Component-level protection
const ProtectedComponent = () => {
  const { data: session } = useSession()
  
  if (!canAccessAdmin(session?.user?.role)) {
    return <Unauthorized />
  }
  
  return <AdminContent />
}
```

## API Design

### RESTful Endpoints

#### Authentication
```typescript
POST /api/auth/register
POST /api/auth/forgot-password
POST /api/auth/reset-password
```

#### Content Management
```typescript
GET    /api/blogs          # List all (admin)
GET    /api/blogs/public   # List published (public)
GET    /api/blogs/public/[id] # Get single (public)
POST   /api/blogs          # Create (power user+)
PUT    /api/blogs/[id]     # Update (role-based)
DELETE /api/blogs/[id]     # Delete (admin)
```

#### User Management
```typescript
GET    /api/users          # List with pagination
POST   /api/users          # Create user (admin)
PUT    /api/users/[id]     # Update user
DELETE /api/users/[id]     # Delete user (admin)
```

### API Response Format
```typescript
// Success Response
{
  success: true,
  data: T,
  pagination?: {
    page: number,
    limit: number,
    total: number,
    pages: number
  }
}

// Error Response
{
  success: false,
  error: string,
  details?: any
}
```

### Error Handling
```typescript
// Centralized error handling
export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public details?: any
  ) {
    super(message)
  }
}

// Usage in API routes
try {
  // API logic
} catch (error) {
  if (error instanceof ApiError) {
    return NextResponse.json(
      { error: error.message, details: error.details },
      { status: error.statusCode }
    )
  }
  // Handle unexpected errors
}
```

## Component Architecture

### Component Hierarchy
```
App Layout
├── Navbar (with theme toggle, auth state)
├── Main Content
│   ├── Public Pages (/, /content/[id])
│   └── Protected Pages (/admin/*)
└── Footer
```

### Admin Panel Architecture
```
AdminDashboard
├── AdminSidebar (collapsible, role-based menu)
├── DashboardStats (overview metrics)
├── BlogManager
│   ├── BlogList (with pagination, filtering)
│   └── BlogEditor (rich text, image upload)
└── UserManager (CRUD, pagination, search)
```

### Component Patterns

#### Compound Components
```typescript
// AlertDialog usage
<AlertDialog>
  <AlertDialogTrigger asChild>
    <Button variant="destructive">Delete</Button>
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Confirm Delete</AlertDialogTitle>
      <AlertDialogDescription>
        This action cannot be undone.
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction onClick={handleDelete}>
        Delete
      </AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```

#### Custom Hooks
```typescript
// useConfirmDialog hook
export const useConfirmDialog = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [config, setConfig] = useState<DialogConfig>()
  
  const confirm = (config: DialogConfig) => {
    setConfig(config)
    setIsOpen(true)
    return new Promise((resolve) => {
      // Handle confirmation logic
    })
  }
  
  return { confirm, isOpen, setIsOpen, config }
}
```

## State Management

### Client State
- **React State**: Component-level state with useState
- **Server State**: React Query/SWR for API data caching
- **Form State**: React Hook Form for form management
- **Global State**: Context API for theme, auth status

### State Patterns
```typescript
// Server state with SWR
const { data: blogs, error, mutate } = useSWR(
  '/api/blogs',
  fetcher,
  { revalidateOnFocus: false }
)

// Form state with React Hook Form
const { register, handleSubmit, formState: { errors } } = useForm({
  resolver: zodResolver(blogSchema)
})

// Global theme state
const ThemeContext = createContext<{
  theme: 'light' | 'dark' | 'system'
  setTheme: (theme: string) => void
}>()
```

## File Upload System

### Local Development
```typescript
// API route: /api/upload
export async function POST(request: Request) {
  const formData = await request.formData()
  const file = formData.get('file') as File
  
  // Validate file type and size
  if (!isValidFileType(file.type)) {
    throw new ApiError(400, 'Invalid file type')
  }
  
  // Save to public/uploads
  const filename = `${Date.now()}-${file.name}`
  const filepath = path.join(process.cwd(), 'public/uploads', filename)
  
  await writeFile(filepath, Buffer.from(await file.arrayBuffer()))
  
  return NextResponse.json({ url: `/uploads/${filename}` })
}
```

### Production (AWS S3)
```typescript
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  }
})

export async function uploadToS3(file: File) {
  const key = `uploads/${Date.now()}-${file.name}`
  
  await s3Client.send(new PutObjectCommand({
    Bucket: process.env.AWS_S3_BUCKET,
    Key: key,
    Body: Buffer.from(await file.arrayBuffer()),
    ContentType: file.type
  }))
  
  return `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${key}`
}
```

### File Validation
```typescript
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export const validateFile = (file: File) => {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('File too large')
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error('Invalid file type')
  }
}
```

## Theme System

### Next-Themes Integration
```typescript
// app/layout.tsx
<ThemeProvider
  attribute="class"
  defaultTheme="system"
  enableSystem
  disableTransitionOnChange
>
  {children}
</ThemeProvider>
```

### CSS Variables
```css
/* globals.css */
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  /* ... other light theme variables */
}

.dark {
  --background: 222.2 84% 4.9%;
  --foreground: 210 40% 98%;
  /* ... other dark theme variables */
}
```

### Toast UI Editor Theme Integration
```typescript
// components/rich-text-editor.tsx
export function RichTextEditor({ content, onChange }: Props) {
  const { theme } = useTheme()
  
  return (
    <Editor
      initialValue={content}
      theme={theme === 'dark' ? 'dark' : 'light'}
      onChange={onChange}
    />
  )
}
```

## Notification System

### Sonner Integration
```typescript
// app/layout.tsx
import { Toaster } from 'sonner'

<Toaster richColors position="top-right" />
```

### Usage Patterns
```typescript
import { toast } from 'sonner'

// Success notification
toast.success('Blog created successfully')

// Error notification
toast.error('Failed to save blog')

// Loading state
const promise = saveBlog()
toast.promise(promise, {
  loading: 'Saving blog...',
  success: 'Blog saved successfully',
  error: 'Failed to save blog'
})
```

### Custom Toast Types
```typescript
// Custom toast with action
toast('Blog published', {
  action: {
    label: 'View',
    onClick: () => router.push(`/content/${blogId}`)
  }
})
```

## Pagination Implementation

### Smart Pagination Logic
```typescript
const renderPageNumbers = (currentPage: number, totalPages: number) => {
  const pages = []
  
  if (totalPages <= 5) {
    // Show all pages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
  } else {
    // Smart truncation
    if (currentPage <= 3) {
      pages.push(1, 2, 3, 4, '...', totalPages)
    } else if (currentPage >= totalPages - 2) {
      pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
    } else {
      pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages)
    }
  }
  
  return pages
}
```

### API Pagination
```typescript
// API route with pagination
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '10')
  const skip = (page - 1) * limit
  
  const [items, total] = await Promise.all([
    prisma.blog.findMany({
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.blog.count()
  ])
  
  return NextResponse.json({
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  })
}
```

## Rich Text Editor Integration

### Toast UI Editor Setup
```typescript
// components/rich-text-editor.tsx
import dynamic from 'next/dynamic'

const Editor = dynamic(
  () => import('@toast-ui/react-editor').then(mod => mod.Editor),
  { ssr: false }
)

export function RichTextEditor({ content, onChange }: Props) {
  const editorRef = useRef<any>(null)
  const { theme } = useTheme()
  
  return (
    <Editor
      ref={editorRef}
      initialValue={content}
      previewStyle="vertical"
      height="400px"
      initialEditType="wysiwyg"
      theme={theme === 'dark' ? 'dark' : 'light'}
      onChange={() => {
        const markdown = editorRef.current?.getInstance().getMarkdown()
        onChange(markdown)
      }}
    />
  )
}
```

### Markdown Rendering
```typescript
// For display, use react-markdown-preview
import MarkdownPreview from '@uiw/react-markdown-preview'

<MarkdownPreview 
  source={content}
  style={{ backgroundColor: 'transparent' }}
/>
```

## Security Considerations

### Input Validation
```typescript
// Zod schemas for validation
export const blogSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1),
  excerpt: z.string().max(500).optional(),
  tags: z.string().optional(),
  published: z.boolean()
})

// API route validation
export async function POST(request: Request) {
  const body = await request.json()
  const validatedData = blogSchema.parse(body)
  // Process validated data
}
```

### Authentication Checks
```typescript
// Middleware for protected routes
export async function authMiddleware(request: Request) {
  const token = await getToken({ req: request })
  
  if (!token) {
    throw new ApiError(401, 'Unauthorized')
  }
  
  return token
}
```

### CSRF Protection
- NextAuth.js provides built-in CSRF protection
- API routes use HTTP-only cookies
- Form submissions include CSRF tokens

### XSS Prevention
- React's built-in XSS protection
- Sanitize user input before database storage
- Use dangerouslySetInnerHTML sparingly

## Performance Optimizations

### Code Splitting
```typescript
// Dynamic imports for heavy components
const AdminDashboard = dynamic(() => import('./admin-dashboard'), {
  loading: () => <LoadingSpinner />
})

// Route-based code splitting (automatic with App Router)
```

### Image Optimization
```typescript
// Next.js Image component
import Image from 'next/image'

<Image
  src={blog.bannerImage}
  alt={blog.title}
  width={800}
  height={400}
  priority={isAboveFold}
/>
```

### Database Optimization
```typescript
// Efficient queries with Prisma
const blogs = await prisma.blog.findMany({
  select: {
    id: true,
    title: true,
    excerpt: true,
    createdAt: true,
    author: {
      select: { name: true }
    }
  },
  where: { published: true },
  orderBy: { createdAt: 'desc' },
  take: 10
})
```

### Caching Strategy
```typescript
// API route caching
export async function GET() {
  const blogs = await getBlogs()
  
  return NextResponse.json(blogs, {
    headers: {
      'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    }
  })
}
```

## Testing Strategy

### Unit Testing
```typescript
// Component testing with React Testing Library
import { render, screen } from '@testing-library/react'
import { BlogCard } from './blog-card'

test('renders blog title', () => {
  const blog = { id: '1', title: 'Test Blog', content: 'Content' }
  render(<BlogCard blog={blog} />)
  expect(screen.getByText('Test Blog')).toBeInTheDocument()
})
```

### API Testing
```typescript
// API route testing
import { POST } from './route'

test('creates blog successfully', async () => {
  const request = new Request('http://localhost/api/blogs', {
    method: 'POST',
    body: JSON.stringify({ title: 'Test', content: 'Content' })
  })
  
  const response = await POST(request)
  expect(response.status).toBe(201)
})
```

### E2E Testing
```typescript
// Playwright/Cypress tests
test('admin can create blog', async ({ page }) => {
  await page.goto('/login')
  await page.fill('[name="email"]', 'admin@example.com')
  await page.fill('[name="password"]', 'password')
  await page.click('button[type="submit"]')
  
  await page.goto('/admin')
  await page.click('text=New Blog')
  // ... test blog creation flow
})
```

## Deployment Architecture

### Environment Configuration
```bash
# Development
DATABASE_URL="file:./dev.db"
NEXTAUTH_URL="http://localhost:3000"

# Production
DATABASE_URL="postgresql://user:pass@host:5432/db"
NEXTAUTH_URL="https://yourdomain.com"
AWS_S3_BUCKET="your-bucket"
```

### Build Process
```json
{
  "scripts": {
    "build": "next build",
    "start": "next start",
    "postbuild": "prisma generate"
  }
}
```

### Docker Configuration
```dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
```

### Vercel Deployment
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install --legacy-peer-deps"
}
```

### Database Migration Strategy
```bash
# Development
npx prisma db push

# Production
npx prisma migrate deploy
npx prisma generate
```

## Monitoring and Logging

### Error Tracking
```typescript
// Sentry integration
import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: process.env.NODE_ENV
})
```

### Performance Monitoring
```typescript
// Web Vitals tracking
export function reportWebVitals(metric: NextWebVitalsMetric) {
  console.log(metric)
  // Send to analytics service
}
```

### Logging Strategy
```typescript
// Structured logging
const logger = {
  info: (message: string, meta?: any) => {
    console.log(JSON.stringify({ level: 'info', message, meta, timestamp: new Date() }))
  },
  error: (message: string, error?: Error) => {
    console.error(JSON.stringify({ level: 'error', message, error: error?.stack, timestamp: new Date() }))
  }
}
```

## Customization Guide

### Adding New Roles
1. Update Prisma schema
2. Add role to permissions.ts
3. Update UI components with role checks
4. Add database migration

### Extending Content Types
1. Modify Blog model in Prisma
2. Update API routes
3. Extend form validation schemas
4. Update UI components

### Adding New Features
1. Create API routes in `/api`
2. Build UI components
3. Add to admin navigation
4. Update permissions system
5. Add tests

This technical documentation provides a comprehensive guide for developers working with or extending this boilerplate. Each section includes practical examples and implementation details to facilitate understanding and customization.