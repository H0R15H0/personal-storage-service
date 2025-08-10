# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (starts Supabase locally + Next.js with Turbopack)
- **Build**: `npm run build` 
- **Production server**: `npm start`
- **Lint**: `npm run lint` (ESLint + Next.js rules)
- **Code formatting**: `npm run format` or `biome format . --write`
- **Biome check**: `npm run biome:check` (lint + format check)
- **Biome fix**: `npm run biome:fix` (auto-fix issues)

### Supabase Commands

- **New migration**: `npm run migration:new <name>`
- **Run migrations**: `npm run migrate`
- **Generate types**: `npm run generate` (updates `supabase/types.ts`)

## Architecture Overview

This is a Next.js 15+ application with Supabase for authentication and database, implementing a storage service for file metadata tracking. Uses the App Router pattern with server-side rendering and cookie-based session management.

### Key Architecture Components

**Supabase Integration** (`lib/supabase/`):
- `client.ts`: Browser client for client-side operations
- `server.ts`: Server client for server components and API routes - **CRITICAL**: Always create new instance per request for Fluid compute, never store globally
- `middleware.ts`: Session management and auth cookie handling

**Authentication Flow**:
- Middleware (`middleware.ts`) protects all routes except `/`, `/auth/*`  
- Unauthenticated users redirected to `/auth/login`
- Cookie-based sessions managed by Supabase SSR package
- Protected routes in `/app/protected/` with dedicated layout

**Storage Service Architecture**:
- API route `/api/objects` handles file metadata creation  
- Database table `objects` stores file metadata with RLS policies
- Upload form tracks file info (name, size, MIME type) without actual file storage
- User-scoped data isolation via RLS and `user_id` foreign key

**Database Schema**:
- `objects` table: `id`, `user_id`, `name`, `size_bytes`, `mime_type`, `created_at`
- Row Level Security enabled with user-scoped read/write policies
- References `auth.users` table for user isolation

**UI Framework**:
- shadcn/ui components with "new-york" style in `components/ui/`
- Tailwind CSS with custom theme support
- next-themes for dark/light mode switching  
- Lucide React for consistent iconography
- Japanese UI text throughout the application

**Code Quality**:
- Biome for linting and formatting (replaces ESLint/Prettier)
- TypeScript strict mode with Next.js configuration
- Import sorting enforced via Biome assist actions

### Environment Setup

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL` 
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`

The `hasEnvVars` utility in `lib/utils.ts` validates environment setup and shows warnings.

### Path Aliases

- `@/*` maps to root directory
- Import paths: `@/components`, `@/lib`, `@/app`, `@/hooks`

## Important Development Notes

- **Supabase clients**: Always create new server client instances per request, never global variables
- **Authentication**: Managed via cookies and middleware, session state flows through SSR
- **File uploads**: Currently tracks metadata only, no actual file storage implemented
- **Styling**: Follow shadcn/ui patterns, use Tailwind utility classes
- **RLS**: Database policies enforce user data isolation - respect this in all queries
- **Japanese text**: UI labels and messages are in Japanese throughout