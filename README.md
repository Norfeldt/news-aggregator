# Hacker News Aggregator 🗞️

A full-stack application that aggregates top stories from Hacker News, built with a modern TypeScript stack.

## 🚀 Quick Start

### Prerequisites

- Node.js 20+ (recommend using a version manager like [Volta](https://volta.sh/))

### Development

```bash
# Start the backend (runs on http://localhost:3000)
cd backend && npm install && npm run dev

# In a new terminal, start the frontend (runs on http://localhost:5173)
cd frontend && npm install && npm run dev
```

For detailed setup instructions:\
- [Backend Setup](./backend/README.md)
- [Frontend Setup](./frontend/README.md)

## 🏗️ Architecture

### Overview

The application follows a clean separation of concerns with:
- **Backend API**: RESTful service aggregating Hacker News data
- **Frontend SPA**: Responsive React application for viewing stories

### Technology Choices

#### Backend: Hono Framework
Initially considered Express.js, but chose Hono after seeing demonstrations from Syntax.fm and Cloudflare showcasing its Express-like API with superior performance. Hono provides:
- Ultrafast request handling
- TypeScript-first design
- Edge runtime compatibility (Cloudflare Workers ready)
- Minimal overhead (~20KB)

#### Frontend: React SPA with Vite
Chose a Single Page Application over Next.js because:
- Next.js felt like overkill with a separate backend API
- Next.js shines when using its integrated API routes and server-side handlers
- For a dedicated backend + frontend architecture, SPA provides cleaner separation
- Vite offers lightning-fast development experience

### Key Design Patterns

- **Service Layer Pattern**: Business logic separated from HTTP handlers
- **In-Memory Caching**: 5-minute TTL with automatic refresh
- **React Query**: Server state management with built-in caching
- **Type Safety**: Full TypeScript coverage across the stack

## 📋 Potential Enhancements

While the current implementation meets all requirements, here are improvements I would add with more time:

### 1. Automated Testing
- Unit tests for backend services using Vitest
- Integration tests for API endpoints
- Spike: Explore Storybook's component testing capabilities
  - Component isolation and visual testing
  - Interaction testing within stories
  - Accessibility testing integration
- E2E tests with Playwright

### 2. CI/CD Pipeline
- GitHub Actions workflow for:
  - Running tests on PR
  - Type checking and linting
  - Automated deployment to Cloudflare Workers (backend)
  - Frontend deployment to Cloudflare Pages

### 3. Type Sharing & API Contract
- **Option A**: OpenAPI specification
  - Define API schema in OpenAPI/Swagger format
  - Generate TypeScript types for both backend and frontend
  - Auto-generate API documentation
- **Option B**: Shared types package
  - Enhance current monorepo with proper tooling (Turborepo or NX)
  - Create shared `@hn-aggregator/types` package
  - Direct type imports between projects

### 4. Additional Features
- Pagination support (backend already architected for this)
- Search functionality

## 🚀 Performance & Scaling

### Current Optimizations
- 5-minute cache TTL reduces API calls to Hacker News
- Rate limiting (100ms delay) prevents API abuse
- Efficient data transformation in service layer

### Cloudflare Deployment Benefits
Hono's edge-ready architecture enables seamless deployment to Cloudflare, providing:
- **Global CDN**: Static assets served from edge locations
- **Workers**: Backend running at the edge, closer to users
- **KV Storage**: Replace in-memory cache with distributed storage
- **Automatic Scaling**: Handle traffic spikes without infrastructure management

### Current Bottlenecks
1. **In-Memory Storage**: Limited to single instance memory
2. **No Horizontal Scaling**: Single server instance
3. **Cache Invalidation**: Simple TTL-based strategy

### Scaling Solutions
1. **Distributed Cache**: Redis or Cloudflare KV for shared state
2. **Database**: PostgreSQL for persistent storage and complex queries
3. **Load Balancing**: Multiple instances behind a load balancer
4. **Queue System**: Background job processing for cache updates

