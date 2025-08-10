# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Development server**: `npm run dev` (starts Supabase locally + Next.js with Turbopack)
- **Build**: `npm run build` 
- **Production server**: `npm start`
- **Lint**: `npm run lint`

## Architecture Overview

This is a Next.js 15+ application with Supabase authentication using the App Router pattern. The project implements a full authentication system with password-based auth using cookies for session management.

### Key Architecture Components

**Supabase Integration** (`lib/supabase/`):
- `client.ts`: Browser client for client-side operations
- `server.ts`: Server client for server components and API routes - always create new instance per request for Fluid compute
- `middleware.ts`: Session management and protected route handling

**Authentication Flow**:
- Middleware (`middleware.ts`) protects all routes except `/`, `/auth/*`, and `/login`
- Unauthenticated users are redirected to `/auth/login`
- Cookie-based session management across client/server boundary
- Protected routes in `/app/protected/`

**UI Framework**:
- shadcn/ui components with "new-york" style in `components/ui/`
- Tailwind CSS with custom configuration
- next-themes for dark/light mode support
- Lucide React for icons

**Component Structure**:
- Authentication components: `auth-button.tsx`, `login-form.tsx`, `sign-up-form.tsx`
- Layout components in `app/` with nested layouts for protected routes
- Tutorial components in `components/tutorial/` for onboarding

### Environment Setup

Required environment variables:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_OR_ANON_KEY`

The `hasEnvVars` check in `lib/utils.ts` validates environment setup.

### Path Aliases

- `@/*` maps to root directory
- Components use absolute imports: `@/components`, `@/lib`, `@/app`

## Important Development Notes

- Always create new Supabase server clients per request (never store in global variables)
- Authentication state is managed via cookies and middleware
- UI components follow shadcn/ui patterns with Tailwind classes
- TypeScript is strictly configured with Next.js plugin