# Persian Apple Store (پرشین اپل استور گیشا)

## Overview

Persian Apple Store is a full-stack e-commerce web application for selling Apple products in Tehran, Iran. The application provides a bilingual (Persian/English) interface with right-to-left (RTL) support, featuring product browsing for iPhones, iPads, AirPods, and used devices. It includes an admin dashboard for inventory management, price updates, and analytics tracking.

The application follows a modern web architecture with a React-based frontend and an Express.js backend, utilizing PostgreSQL for data persistence and integrating with Cloudinary for image management.

## User Preferences

Preferred communication style: Simple, everyday language.

## Recent Changes

### Latest Updates (November 22, 2025)
- **Apple ID Service Updates**:
  - Updated service price from 500,000 to 5,000,000 Toman (Verify service)
  - Changed card number to: 6104-3378-2797-7933 (Bank Mellat, Shahab Hatami)
  - Added bank name display (بانک ملت) to payment card section
- **PWA (Progressive Web App) Enhancement**:
  - Registered Service Worker in main.tsx for offline functionality
  - PWA fully functional with manifest.json and caching strategy
  - Users can now install the app on their mobile devices
  - Service Worker caches static resources for offline access
  - Network-first strategy for dynamic content, cache fallback for offline mode
- **Product Details Issue Identified**:
  - Only products with prices in database show storage/color options
  - Currently working models: iPhone 17 series (all variants), iPad, iPad Air, AirPods
  - Models without prices (iPhone 16, 15, 14, etc.) show empty selection screens
  - Database contains 105 prices total (96 for iPhone 17, 8 for iPad, 1 for AirPods)

### Previous Updates (November 21, 2025)
- **CRITICAL DATA PERSISTENCE FIX**:
  - Fixed major issue where data was not persisting across deployments
  - Migrated from in-memory storage (MemStorage) to PostgreSQL database (DbStorage)
  - All APIs now use DbStorage implementation with Drizzle ORM
  - Server configured to use PostgreSQL for all data operations
  - Data now survives server restarts and deployments
- **Database Population**:
  - Successfully populated database with initial product data
  - 4 categories: iPhone, iPad, AirPods, Used Phones
  - 28 iPhone models (iPhone 11 through iPhone 16 series)
  - 23 colors including all Titanium variants for Pro models
  - 9 storage options (64GB, 128GB, 256GB, 512GB, 1TB)
- **Database Schema Fixes**:
  - Added missing "order" column to product_models table
  - Fixed foreign key constraints and relationships
  - All product management APIs now working correctly

### Previous Updates (November 15, 2025)
- **OpenAI AI Chatbot Integration**:
  - Integrated OpenAI GPT-5 for intelligent customer support
  - AI assistant with Persian language support and store context
  - Provides product information, pricing, and contact details
  - Uses OPENAI_API_KEY from environment variables
  - Available on all pages via floating chat button
- **Multi-Category Background System**: 
  - Separate background images for each product category (iPhone, iPad, AirPods, Used Phones, Default)
  - GlobalBackground component with preloading eliminates page transition delays
  - All backgrounds preloaded on app mount for instant switching
  - Settings Manager with tabbed interface for managing multiple category backgrounds
  - Smooth opacity transitions between backgrounds (duration-500)
- **Admin Dialog Fix**: Fixed RTL layout issue that prevented admin dialogs from opening
  - Moved `dir="rtl"` from parent container to specific sidebar and main content areas
  - Dialog Portals now render correctly outside RTL constraints
- **Deployment Configuration**:
  - Created DEPLOYMENT.md with comprehensive Persian deployment guide
  - Created RENDER_CONFIG.md with quick reference configuration
  - GitHub repository connected: https://github.com/hatamishahab22-max/PswDataRenderr
  - Ready for Render deployment with proper build/start commands

### Previous Updates (November 14, 2025)
- **Admin Login Security**: Removed visible credentials from login page for security
- **Background Image System**: 
  - New default background image applied (Apple logo with gradient)
  - Settings page in admin panel for easy background customization
  - Upload via Cloudinary or enter direct URLs
  - Created `useBackgroundImage` hook for consistent management
- **Splash Screen Behavior**: Changed from auto-dismiss to click-to-enter (user must click Power button)
- **Image Upload Enhancement**:
  - Added file size validation (max 10MB per image)
  - Improved error messages with detailed feedback
  - Better console logging for debugging upload issues
- **GitHub Integration**: GitHub connection configured and ready for use

### WhatsApp Order Management System
- Full order management system integrated into admin panel
- Status tracking: pending, contacted, completed, cancelled
- Customer information capture with phone numbers and product details

### Image Gallery Optimization
- Implemented lazy loading for used phone image galleries
- Added loading="lazy" attribute to all product images
- Optimized image rendering performance for better UX

## System Architecture

### Frontend Architecture

**Framework & Build System**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool and development server for fast HMR (Hot Module Replacement)
- Wouter for lightweight client-side routing instead of React Router

**UI Component System**
- shadcn/ui component library built on Radix UI primitives
- Tailwind CSS for utility-first styling with custom theme configuration
- Custom design system following Apple's minimalist aesthetic with Persian cultural adaptations
- RTL (right-to-left) layout support for Persian language content

**State Management & Data Fetching**
- TanStack Query (React Query) for server state management, caching, and data synchronization
- No global state management library - relies on React Query's cache and local component state
- Optimistic updates for better UX during admin operations

**Form Handling**
- React Hook Form with Zod schema validation via @hookform/resolvers
- Type-safe form validation using Drizzle-Zod schema integration

**Design Approach**
- Dual typography system: Vazirmatn for Persian text, Inter for English/numbers
- Premium minimalist design inspired by Apple.com
- Mobile-first responsive design with touch-optimized interactions
- PWA (Progressive Web App) capabilities with service worker registration

### Backend Architecture

**Server Framework**
- Express.js as the HTTP server framework
- TypeScript for type safety across the entire codebase
- ESM (ES Modules) for modern JavaScript module system

**API Design**
- RESTful API endpoints organized by resource type
- Session-based authentication for admin access
- JSON request/response format with proper error handling
- CORS and security middleware for production deployment

**Database Layer**
- Drizzle ORM for type-safe database operations
- PostgreSQL as the primary database (via Neon serverless)
- Schema-first approach with migrations managed through Drizzle Kit
- Connection pooling using @neondatabase/serverless with WebSocket support

**Database Schema Design**
- Product hierarchy: Categories → Models → Colors/Storage Options → Prices
- Flexible pricing system supporting multiple configurations per product
- Used iPhone inventory tracking with condition-based pricing
- Page visit analytics with session tracking
- Admin authentication with bcrypt password hashing

**Session Management**
- PostgreSQL-backed sessions using connect-pg-simple
- Session data stored in database for scalability and persistence
- Configurable session expiration and security settings

### Image Management

**Cloudinary Integration**
- Cloud-based image storage and CDN delivery
- Server-side upload API with validation (file type, size limits)
- Support for both file uploads and direct URL imports
- Automatic image optimization and transformation capabilities

**Upload Flow**
- Client converts images to base64 for preview
- Server-side validation before Cloudinary upload
- Returns optimized Cloudinary URL for database storage
- Fallback handling for upload failures

### Deployment Architecture

**Development Environment**
- Replit-optimized development setup with custom Vite plugins
- Runtime error overlay and dev banner for debugging
- Cartographer plugin for code navigation

**Production Build**
- Separate client and server builds
- Client: Vite production build to `dist/public`
- Server: esbuild bundle to `dist/index.js`
- Static asset serving from build output

**Environment Configuration**
- Database connection via DATABASE_URL environment variable
- Cloudinary credentials (CLOUD_NAME, API_KEY, API_SECRET)
- Node environment detection for conditional features

### Analytics & Tracking

**Page Visit Tracking**
- Custom hook-based analytics system
- Automatic page view tracking on route changes
- Session-based visit deduplication
- Admin dashboard with visit statistics and popular pages report

### AI Chatbot Integration

**Architecture**
- Modal-based chat interface with message history
- REST API endpoint for chat completions
- Streaming or standard response handling
- Client-side loading states and error handling

## External Dependencies

### Core Backend Services

**Neon Database (PostgreSQL)**
- Serverless PostgreSQL database with WebSocket connections
- Connection pooling via @neondatabase/serverless
- Auto-scaling database with branching capabilities
- Requires DATABASE_URL environment variable

**Cloudinary**
- Cloud image storage and CDN
- Image transformation and optimization
- Upload API with folder organization
- Requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET environment variables

### UI Component Libraries

**Radix UI Primitives**
- Headless, accessible component primitives
- Multiple components: Dialog, Dropdown, Select, Tabs, Toast, etc.
- Full keyboard navigation and ARIA support

**shadcn/ui**
- Pre-styled component library built on Radix UI
- Customizable design system with Tailwind CSS
- Component generation via CLI tool

### Development & Build Tools

**TypeScript**
- Type checking across client and server code
- Shared type definitions via `/shared` directory
- Path aliases for clean imports (@/, @shared/)

**Vite**
- Fast HMR in development
- Optimized production builds
- Plugin ecosystem for Replit integration

**Drizzle Kit**
- Database schema migrations
- Push-based schema synchronization
- TypeScript schema definitions with Zod validation

### Authentication & Security

**bcrypt**
- Password hashing for admin authentication
- Configurable salt rounds for security

**express-session**
- Session middleware for Express
- PostgreSQL session store integration

### Date & Time Utilities

**date-fns**
- Lightweight date manipulation library
- Persian calendar support via extensions
- Formatting and parsing utilities

### Miscellaneous

**Lucide React**
- Icon library with tree-shaking support
- Consistent iconography across UI

**class-variance-authority (CVA)**
- Utility for creating variant-based component APIs
- Type-safe prop variants

**clsx / tailwind-merge**
- Conditional className utilities
- Tailwind class conflict resolution