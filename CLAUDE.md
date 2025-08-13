# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm run dev` - Start development server with Turbopack on localhost:3000
- `npm run build` - Build production bundle
- `npm run start` - Start production server

### Code Quality
- `npm run prettier` - Format code with Prettier
- `npm run prettier:check` - Check code formatting (used in tests)
- `npm run test` - Run prettier check (primary test command)

### GraphQL

Codegen is done through `gql.data`. To actively re-generated the types run `npx gql-tada generate output`

## Architecture

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript with strict mode
- **Styling**: Tailwind CSS v4 with tailwind-merge for class composition
- **GraphQL**: gql.tada for type-safe GraphQL with generated types in `lib/vendure/types.ts`
- **UI Components**: Radix UI primitives with custom components in `ui-components/`
- **Forms**: react-hook-form with Zod validation

### Project Structure

#### Route Groups
- `(default)/` - Main storefront routes (home, product pages, search, collections)
- `(checkout)/` - Multi-step checkout flow with isolated layout
- Each route group has its own layout.tsx for different page structures

#### Core Directories
- `lib/vendure/` - Vendure GraphQL API integration
  - `index.ts` - Main API client with vendureFetch function and exported methods
  - `queries/` - GraphQL query definitions
  - `mutations/` - GraphQL mutation definitions  
  - `fragments/` - Reusable GraphQL fragments
  - `types.ts` - Auto-generated TypeScript types (DO NOT EDIT)
  - `checkout.tsx` - Checkout flow configuration and step definitions

- `components/` - React components organized by feature
  - `cart/` - Shopping cart with context providers for state management
  - `checkout/` - Checkout step components
  - `product/` - Product display components with variant selection
  - `layout/` - Header, footer, navigation components

#### State Management
- **Cart State**: React Context (`CartContext`) with server-side data fetching
- **Channel Context**: Manages active Vendure channel configuration
- **Collection Context**: Manages active collection for search/filtering

### API Integration

All Vendure API calls go through the `vendureFetch` function in `lib/vendure/index.ts`:
- Handles authentication via cookies
- Manages cache tags for Next.js revalidation
- Centralizes error handling for Vendure-specific errors

Key API methods:
- `getActiveOrder()` - Fetch current cart/order
- `addToCart()`, `adjustCartItem()`, `removeFromCart()` - Cart mutations
- `getProduct()`, `getCollectionProducts()` - Product queries
- `authenticateCustomer()`, `getActiveCustomer()` - Customer authentication

### Multi-Step Checkout

The checkout flow is defined in `lib/vendure/checkout.tsx`:
- Step configuration with validation logic
- Currently implements: addresses, shipping, payment, summary steps
- Each step has a `validate()` function to check completion
- Steps are rendered dynamically at `/checkout/[step]`

### Environment Variables

Required environment variables (see .env.example):
- `VENDURE_API_ENDPOINT` - Vendure GraphQL endpoint URL
- `COMPANY_NAME`, `SITE_NAME` - Branding configuration
- `TWITTER_CREATOR`, `TWITTER_SITE` - Social metadata

### Development Patterns

- **Server Components by default** - Use 'use client' only when needed
- **Suspense boundaries** for async data fetching
- **Server Actions** for mutations (form submissions)
- **Image optimization** via custom loader for Vendure assets
- **Type safety** enforced via TypeScript strict mode and generated GraphQL types
- **Component composition** - Build complex UIs from primitive components