# Overview

This is a full-stack React application built as a modern university website for "Мандах Их Сургууль" (Mandakh University). The project combines a React frontend with a Node.js/Express backend, featuring a comprehensive university website with multiple sections including programs, admissions, student life, news, and contact information. The application is built with TypeScript and uses modern web technologies for a professional academic presentation.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript using Vite as the build tool
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation via @hookform/resolvers

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API structure with `/api` prefix routing
- **Storage**: In-memory storage implementation with interface for future database integration
- **Development**: Vite middleware integration for hot module replacement during development

## Data Storage Solutions
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Database**: PostgreSQL (configured but not actively used in current implementation)
- **Session Storage**: Uses connect-pg-simple for PostgreSQL session store
- **Current Implementation**: In-memory storage for users with CRUD operations

## Authentication and Authorization
- **Schema**: User model with username/password fields using Drizzle ORM
- **Validation**: Zod schemas for type-safe user input validation
- **Session Management**: Express sessions with PostgreSQL store configuration

## Component Structure
- **UI System**: Modular component architecture with reusable UI primitives
- **Layout**: Single-page application with smooth scrolling navigation between sections
- **Responsive Design**: Mobile-first approach with Tailwind breakpoints
- **Accessibility**: ARIA labels, keyboard navigation, and proper semantic HTML

## Development Workflow
- **Build System**: Vite for fast development and optimized production builds
- **Type Checking**: TypeScript with strict configuration across client, server, and shared code
- **Hot Reload**: Development server with automatic reloading for both client and server changes
- **Path Aliases**: Configured aliases for clean imports (`@/`, `@shared/`)

# External Dependencies

## Core Framework Dependencies
- **React**: React 18 with DOM rendering
- **Express**: Node.js web framework for backend API
- **TypeScript**: Type safety across the entire application
- **Vite**: Build tool and development server

## Database and ORM
- **Drizzle ORM**: Type-safe ORM with PostgreSQL dialect
- **@neondatabase/serverless**: PostgreSQL driver for serverless environments
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## UI and Styling
- **Tailwind CSS**: Utility-first CSS framework
- **Radix UI**: Unstyled, accessible UI primitives (@radix-ui/react-*)
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Utility for creating variant-based component APIs

## Form and Validation
- **React Hook Form**: Performant forms with easy validation
- **Zod**: TypeScript-first schema validation
- **@hookform/resolvers**: Validation resolvers for React Hook Form

## State Management and Data Fetching
- **TanStack React Query**: Server state management and caching
- **Wouter**: Lightweight routing library for React

## Development Tools
- **@replit/vite-plugin-***: Replit-specific development plugins for enhanced development experience
- **PostCSS**: CSS processing with Autoprefixer
- **ESBuild**: Fast JavaScript bundler used by Vite

## Additional Utilities
- **clsx & tailwind-merge**: Conditional CSS class utilities
- **date-fns**: Modern JavaScript date utility library
- **cmdk**: Command palette component
- **embla-carousel-react**: Carousel component library