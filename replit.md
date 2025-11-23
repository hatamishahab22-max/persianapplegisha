# Persian Apple Store (پرشین اپل استور گیشا)

## Overview
Persian Apple Store is a full-stack e-commerce web application for selling Apple products in Tehran, Iran. The platform provides a bilingual (Persian/English) interface with RTL support, enabling product browsing for iPhones, AirPods, and used devices. It features an admin dashboard for inventory management, price updates, and analytics tracking. The application aims to offer a premium, localized e-commerce experience for Apple products, focusing on a streamlined catalog and user-friendly management.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The frontend is built with React 18 and TypeScript, using Vite for fast development and optimized builds. UI components are crafted with shadcn/ui (based on Radix UI) and styled with Tailwind CSS, following a minimalist design inspired by Apple.com with Persian cultural adaptations and RTL support. Wouter handles client-side routing. State management and data fetching rely on TanStack Query for server state, caching, and optimistic updates, avoiding a global state library. Form handling utilizes React Hook Form with Zod for type-safe validation. The application features a dual typography system (Vazirmatn for Persian, Inter for English) and PWA capabilities.

### Backend Architecture
The backend is an Express.js server developed with TypeScript and ESM. It exposes RESTful API endpoints, using session-based authentication for admin access. PostgreSQL is the primary database, integrated via Drizzle ORM for type-safe operations and managed with Drizzle Kit for migrations. Session management is handled by connect-pg-simple, storing session data in PostgreSQL. The database schema supports a flexible product hierarchy (Categories → Models → Colors/Storage Options → Prices), used iPhone inventory, and page visit analytics. bcrypt is used for password hashing.

### Image Management
Cloudinary is integrated for cloud-based image storage, CDN delivery, and optimization. The system supports both file uploads and direct URL imports, with server-side validation and fallback handling for upload failures.

### Deployment Architecture
The project is optimized for Replit development, with production builds separating client (Vite) and server (esbuild) outputs. Environment variables manage database connections and Cloudinary credentials.

### Analytics & Tracking
A custom hook-based system tracks page visits, offering session-based deduplication and an admin dashboard for visit statistics and popular pages.

### AI Chatbot Integration
An OpenAI GPT-5 powered AI chatbot provides intelligent customer support with Persian language understanding, offering product information, pricing, and contact details via a modal interface.

## External Dependencies

### Core Backend Services
- **Neon Database (PostgreSQL)**: Serverless PostgreSQL for data persistence, utilizing `@neondatabase/serverless` for connection pooling.
- **Cloudinary**: Cloud-based image storage, optimization, and CDN.

### UI Component Libraries
- **Radix UI Primitives**: Headless, accessible UI components.
- **shadcn/ui**: Pre-styled component library built on Radix UI, integrated with Tailwind CSS.

### Development & Build Tools
- **TypeScript**: For type checking across the codebase.
- **Vite**: Fast development server and optimized production builds.
- **Drizzle Kit**: Database schema migrations and type-safe schema definitions.

### Authentication & Security
- **bcrypt**: Password hashing for admin authentication.
- **express-session** & **connect-pg-simple**: Session management with PostgreSQL backing.

### Date & Time Utilities
- **date-fns**: Lightweight date manipulation, including Persian calendar support.

### Miscellaneous
- **Lucide React**: Icon library.
- **class-variance-authority (CVA)**: Utility for creating variant-based component APIs.
- **clsx / tailwind-merge**: Utilities for conditional CSS classes and Tailwind class conflict resolution.