# Next.js 15 Content Management System

A modern, full-featured content management system built with Next.js 15, TypeScript, and the App Router. Features include authentication, role-based access control, rich text editing, file uploads, toast notifications, and comprehensive admin panel.

## Features

- **Authentication**: NextAuth.js with credentials provider and user registration
- **Role-based Access**: 3-tier role system (USER, POWER_USER, ADMIN) with hierarchy-based permissions
- **Content Management**: Full CRUD operations with Toast UI rich text editor, draft/publish workflow
- **User Management**: Complete admin interface with search, filtering, and pagination
- **File Uploads**: Local storage (dev) and AWS S3 (production) with automatic cleanup
- **Responsive Design**: Tailwind CSS with Shadcn/UI components and mobile-optimized admin panel
- **Dark/Light Theme**: System-aware theme switching with Toast UI Editor theme integration
- **Toast Notifications**: Sonner toast notifications for all user actions and feedback
- **Confirmation Dialogs**: Custom AlertDialog components replacing browser alerts
- **Advanced Pagination**: Smart pagination with page numbers and truncation
- **Content Filtering**: Search and filter content by title, tags, and status
- **API Documentation**: Custom API documentation for admin users
- **Email Integration**: Password reset functionality with SMTP support
- **Database**: Prisma ORM with SQLite (dev) and PostgreSQL (production)
- **Markdown Support**: GitHub-style markdown rendering for content display

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Database**: Prisma ORM (SQLite/PostgreSQL)
- **Authentication**: NextAuth.js
- **Styling**: Tailwind CSS + Shadcn/UI
- **Rich Text**: Toast UI Editor with theme integration
- **Markdown Rendering**: @uiw/react-markdown-preview
- **Animations**: Framer Motion
- **Notifications**: Sonner toast notifications
- **Dialogs**: Radix UI AlertDialog
- **File Storage**: Local/AWS S3
- **Email**: Nodemailer

## Local Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd nextjs-boilerplate
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```

4. **Configure Environment Variables**
   
   Edit `.env.local` with your settings:
   ```env
   # Database
   DATABASE_URL="file:./dev.db"
   
   # NextAuth
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-key-here"
   
   # SMTP (for password reset)
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-app-password"
   SMTP_FROM="your-email@gmail.com"
   
   # File Upload (Local Development)
   UPLOAD_DIR="./public/uploads"
   
   # Optional: AWS S3 (for production)
   # AWS_ACCESS_KEY_ID="your-access-key"
   # AWS_SECRET_ACCESS_KEY="your-secret-key"
   # AWS_REGION="us-east-1"
   # AWS_S3_BUCKET="your-bucket-name"
   ```

5. **Database Setup**
   ```bash
   # Generate Prisma client (runs automatically via postinstall)
   npm install
   
   # Create and migrate database
   npm run db:push
   
   # Seed admin user
   npm run db:seed
   ```

6. **Start Development Server**
   ```bash
   npm run dev
   ```

7. **Access the Application**
   - Frontend: http://localhost:3000
   - Admin Login: admin@example.com / changeme
   - User Registration: http://localhost:3000/register
   - Admin Panel: http://localhost:3000/admin (admin/power user only)
   - API Docs: http://localhost:3000/admin/swagger (admin only)

## Production Setup

### Environment Variables

For production, update your environment variables:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://username:password@localhost:5432/mydb"

# NextAuth
NEXTAUTH_URL="https://yourdomain.com"
NEXTAUTH_SECRET="your-production-secret"

# SMTP Configuration
SMTP_HOST="your-smtp-host"
SMTP_PORT="587"
SMTP_USER="your-smtp-user"
SMTP_PASS="your-smtp-password"
SMTP_FROM="noreply@yourdomain.com"

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="us-east-1"
AWS_S3_BUCKET="your-bucket-name"
```

### Database Migration

1. **Update Prisma Schema**
   
   In `prisma/schema.prisma`, change the datasource:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Run Migrations**
   ```bash
   # Deploy migrations (production-safe)
   npm run db:migrate:deploy
   
   # Seed admin user
   npm run db:seed
   ```

**Note**: The role system uses string-based roles (USER, POWER_USER, ADMIN) for SQLite compatibility.

### Build and Deploy

```bash
# Build the application (automatically runs migrations)
npm run build

# Start production server
npm start
```

**Note**: The build script automatically:
1. Applies pending database migrations (`prisma migrate deploy`)
2. Generates the Prisma client
3. Builds the Next.js application

This ensures your database is always up-to-date with your application code.

## Configuration Guides

### SMTP Setup (Gmail Example)

1. **Enable 2-Factor Authentication** on your Gmail account
2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Generate password for "Mail"
3. **Update Environment Variables**:
   ```env
   SMTP_HOST="smtp.gmail.com"
   SMTP_PORT="587"
   SMTP_USER="your-email@gmail.com"
   SMTP_PASS="your-16-character-app-password"
   SMTP_FROM="your-email@gmail.com"
   ```

### AWS S3 Setup

1. **Create S3 Bucket**
   - Go to AWS S3 Console
   - Create new bucket with public read access
   - Note the bucket name and region

2. **Create IAM User**
   - Go to AWS IAM Console
   - Create user with S3 permissions
   - Generate access key and secret

3. **Update Environment Variables**:
   ```env
   AWS_ACCESS_KEY_ID="AKIA..."
   AWS_SECRET_ACCESS_KEY="your-secret-key"
   AWS_REGION="us-east-1"
   AWS_S3_BUCKET="your-bucket-name"
   ```

### Database Configuration

#### Development (SQLite)
```env
DATABASE_URL="file:./dev.db"
```

#### Production (PostgreSQL)
```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

## Admin Panel Features

### Dashboard
- System statistics and overview
- Quick access to all management features

### Content Management
- **Rich Text Editor**: Toast UI Editor with dark/light theme support
- **Content Filtering**: Search by title/content, filter by tags and status
- **Pagination**: Smart pagination with page numbers (5+ pages show truncated view)
- **Bulk Operations**: Publish/unpublish, delete with confirmation dialogs
- **Image Upload**: Drag-and-drop banner image upload
- **Draft System**: Save as draft or publish immediately

### User Management
- **User CRUD**: Create, read, update, delete users with role management
- **Search & Filter**: Search by name/email, filter by role
- **Pagination**: Configurable users per page (5, 10, 20, 50)
- **Role Management**: USER, POWER_USER, ADMIN role assignment
- **Self-Service**: Users can edit their own profiles

### Mobile Optimization
- **Collapsible Sidebar**: Toggle sidebar for mobile devices
- **Responsive Layout**: Optimized for tablets and mobile
- **Touch-Friendly**: Proper touch targets and gestures

## Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run lint` - Run ESLint

### Production
- `npm run build` - Build for production (includes automatic database migration)
- `npm start` - Start production server
- `npm run postinstall` - Generate Prisma client (runs automatically after npm install)

### Database Management
- `npm run db:push` - Push schema changes to database (development)
- `npm run db:migrate:dev` - Create and apply new migration (development)
- `npm run db:migrate:deploy` - Apply pending migrations (production)
- `npm run db:seed` - Seed database with admin user
- `npm run db:reset` - Reset database and reseed (development)
- `npm run db:studio` - Open Prisma Studio

## User Interface Features

### Toast Notifications
- Success/error feedback for all operations
- Rich colors and positioning
- Auto-dismiss with manual close option

### Confirmation Dialogs
- Custom AlertDialog components
- Replace browser confirm() dialogs
- Consistent styling with app theme
- Accessible with proper ARIA attributes

### Responsive Design
- Mobile-first approach
- Collapsible admin sidebar
- Touch-optimized controls
- Tablet and desktop layouts

### Theme Integration
- Dark/light mode support
- Toast UI Editor theme switching
- Consistent color scheme
- System preference detection

## Troubleshooting

### Port 3000 Already in Use
```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Remove build files
rm -rf .next

# Start development server
npm run dev
```

### Build Issues
```bash
# Clean install dependencies
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Reset database (development only)
npm run db:reset
```

### Hydration Issues (iPad/Mobile)
```bash
# Clear browser cache and reload
# Check for JavaScript errors in console
# Ensure proper viewport meta tags
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password with token

### Content Management (Role-based Access)
- `GET /api/blogs` - List all content (admin only)
- `GET /api/blogs/public` - List published content (public)
- `GET /api/blogs/public/[id]` - Get single published content (public)
- `POST /api/blogs` - Create new content (power users and admins)
- `PUT /api/blogs/[id]` - Update content (role-based permissions)
- `DELETE /api/blogs/[id]` - Delete content (admin only)

### File Upload
- `POST /api/upload` - Upload file (authenticated users)

### Users (Admin Only)
- `GET /api/users` - List all users with search, filtering, and pagination
- `POST /api/users` - Create new user
- `PUT /api/users/[id]` - Update user (own account or admin)
- `DELETE /api/users/[id]` - Delete user

### Statistics
- `GET /api/stats` - Get dashboard statistics (admin only)

### API Documentation
- `GET /api/swagger` - OpenAPI specification (admin only)

## Default Users

### Admin User
After running the seed command, you can login with:
- **Email**: admin@example.com
- **Password**: changeme
- **Role**: ADMIN (full access to all features)

### User Registration
New users can register at `/register` and will be assigned:
- **Role**: USER (basic access, cannot access admin features)
- **Permissions**: Can view public content only

### Role Hierarchy
- **USER**: Basic access, public content only
- **POWER_USER**: Can create and edit blogs
- **ADMIN**: Full system access including user management

**Important**: Change the admin password after first login!

### Content Access
- **Public**: Can view published content at `/content/[id]`
- **Users**: Can register and view content
- **Power Users**: Can create and edit content
- **Admins**: Full system access including user management

## Project Structure

```
├── app/                    # Next.js App Router
│   ├── admin/             # Admin dashboard pages
│   │   ├── users/         # User management
│   │   └── swagger/       # API documentation
│   ├── api/               # API routes
│   │   ├── auth/          # Authentication endpoints
│   │   ├── blogs/         # Content CRUD operations
│   │   └── users/         # User management endpoints
│   ├── content/           # Public content pages
│   │   └── [id]/         # Individual content view
│   ├── login/             # Authentication pages
│   ├── register/          # User registration
│   └── reset-password/    # Password reset
├── components/            # React components
│   ├── ui/               # Shadcn/UI + custom components
│   │   ├── alert-dialog.tsx  # Confirmation dialogs
│   │   └── ...           # Other UI components
│   ├── admin-*.tsx       # Admin panel components
│   ├── blog-*.tsx        # Content management components
│   ├── rich-text-editor.tsx # Toast UI Editor wrapper
│   └── ...
├── lib/                  # Utility libraries
│   ├── permissions.ts    # Role-based access control
│   ├── blog-config.ts    # Content configuration
│   └── ...
├── prisma/               # Database schema and migrations
├── public/               # Static assets
│   └── uploads/          # File upload directory
└── types/                # TypeScript type definitions
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Recent Updates

### v2.0 Features
- ✅ Renamed "blog" to "content" for better flexibility
- ✅ Enhanced admin panel with collapsible sidebar
- ✅ Toast UI Editor with theme integration
- ✅ Sonner toast notifications system
- ✅ Custom AlertDialog components
- ✅ Advanced pagination with page numbers
- ✅ Content filtering and search
- ✅ GitHub-style markdown rendering
- ✅ Mobile-optimized responsive design
- ✅ Improved user experience and accessibility

## Support

For support and questions:
- Create an issue on GitHub
- Email: darljedmatundan@gmail.com

## Deployment Platforms

This application can be deployed on:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **DigitalOcean App Platform**
- **AWS Amplify**
- **Self-hosted VPS**

### Deployment Notes
- Use `--legacy-peer-deps` flag for npm install
- Configure environment variables for your platform
- Set up PostgreSQL database for production
- Configure SMTP for email functionality
- Set up AWS S3 for file uploads (optional)
- Database migrations run automatically during build
- Ensure `DATABASE_URL` is set before deployment

### Deployment Workflow
1. Set environment variables (especially `DATABASE_URL`)
2. Run `npm install` (generates Prisma client via postinstall)
3. Run `npm run build` (applies migrations and builds app)
4. Run `npm start` (starts production server)

Make sure to configure environment variables and database connections for your chosen platform.