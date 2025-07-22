# Hacker News Aggregator Backend

A simple REST API built with Hono framework that aggregates top stories from Hacker News.

## Features

- Fetches and caches top 20 Hacker News stories
- In-memory caching with 5-minute TTL
- Rate limiting on HN API calls
- CORS enabled for frontend integration

## API Endpoints

### GET /
Returns API information and available endpoints.

### GET /stories
Returns the top 20 stories with basic information:
- Title
- Score
- URL
- Author

### GET /stories/:id
Returns detailed information about a specific story including:
- All story fields
- Author karma
- Author account creation date

### POST /refresh
Manually refresh the stories cache.

## Setup

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run production build
npm start

# Type check
npm run lint
```

## Development

The server runs on http://localhost:3000 by default.

## Tech Stack

- Node.js with TypeScript
- Hono - Ultrafast web framework
- In-memory caching
- Native fetch API for HTTP requests

## Why Hono?

Hono was chosen as the web framework for this project for several compelling reasons:

1. **Performance**: Hono is one of the fastest web frameworks available, with minimal overhead and excellent request handling speed - perfect for a news aggregator that needs quick response times.

2. **TypeScript First**: Built with TypeScript in mind, Hono provides excellent type inference and type safety out of the box, reducing runtime errors and improving developer experience.

3. **Edge Ready**: Hono is designed to run on edge runtimes (Cloudflare Workers, Deno Deploy, Vercel Edge Functions), making it future-proof for scaling to edge computing.

4. **Small Bundle Size**: With a tiny footprint (~20KB), Hono keeps our application lean and deployment-friendly.

5. **Simple API**: Hono's API is intuitive and similar to Express.js, making it easy to learn while being more modern and performant.

6. **Built-in Features**: Includes middleware for CORS, logging, and error handling without additional dependencies.

## Architecture

The backend follows a clean, modular architecture with clear separation of concerns:

```
src/
├── index.ts                    # Application entry point, middleware setup
├── routes/                     # HTTP route handlers
│   └── stories.routes.ts       # /story path related endpoints
├── services/                   # Business logic layer
│   ├── hn-api.service.ts       # Hacker News API client
│   └── story-cache.service.ts  # In-memory caching logic
├── types/                      # TypeScript type definitions
│   └── hn.types.ts             # Hacker News data types
└── middleware/                 # Custom middleware (ready for expansion)
```

### Service Layer Pattern
The application uses a service layer pattern to separate concerns:

- **Routes**: Handle HTTP requests/responses, parameter validation
- **Services**: Contain business logic, API calls, and data transformation
- **Cache Service**: Manages in-memory storage with TTL and refresh logic

This separation makes the code easier to test, maintain, and extend. For example, switching from in-memory to Redis caching would only require changes to the cache service.

## Hono Basics in This Project

This section explains how Hono is used in this codebase, with examples from the actual implementation.

### Route Organization

Routes are organized into separate files and mounted using `app.route()`:

```typescript
// In index.ts
import storiesRoutes from './routes/stories.routes'

// Mount the routes - this makes stories.routes.ts available at /stories/*
app.route('/stories', storiesRoutes)
```

This means all routes defined in `stories.routes.ts` will be prefixed with `/stories`:
- `GET /` in stories.routes.ts becomes `GET /stories`
- `GET /:id` in stories.routes.ts becomes `GET /stories/:id`

### Real Route Examples from Our Code

#### Getting All Stories (from stories.routes.ts)
```typescript
storiesRoutes.get('/', async (c) => {
  try {
    const stories = await getCachedStories()
    
    const storyList: StoryListItem[] = stories.map(story => ({
      id: story.id,
      title: story.title,
      score: story.score,
      url: story.url,
      author: story.by
    }))
    
    return c.json({
      stories: storyList,
      count: storyList.length,
      cache: getCacheStats()
    })
  } catch (error) {
    console.error('Error fetching stories:', error)
    return c.json({ error: 'Failed to fetch stories' }, 500)
  }
})
```

#### Getting a Story by ID with Parameter Handling
```typescript
storiesRoutes.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))  // Extract URL parameter
  
  if (isNaN(id)) {
    return c.json({ error: 'Invalid story ID' }, 400)  // Error response with status
  }
  
  // ... fetch and return story
})
```

### Middleware Used in This Project

In `index.ts`, we apply middleware globally:

```typescript
// Logger middleware - logs all requests
app.use('*', logger())

// CORS middleware - enables cross-origin requests for frontend
app.use('*', cors({
  origin: '*',  // Allow all origins for development
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))
```

### Error Handling

The project implements both route-level and global error handling:

```typescript
// Route-level try-catch (in routes)
try {
  const stories = await getCachedStories()
  return c.json({ stories })
} catch (error) {
  return c.json({ error: 'Failed to fetch stories' }, 500)
}

// Global error handler (in index.ts)
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json({ error: 'Internal Server Error' }, 500)
})

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})
```

### Type Safety with Hono

This project leverages Hono's TypeScript support with custom types:

```typescript
import type { StoryListItem, StoryDetail } from '../types/hn.types'

// Type-safe response
const storyDetail: StoryDetail = {
  id: story.id,
  title: story.title,
  score: story.score,
  url: story.url,
  author: story.by,
  authorKarma: author.karma,
  authorCreated: author.created
}

return c.json({ story: storyDetail })  // Response is typed
```

### Learn More
- [Hono Documentation](https://hono.dev/)
- [Hono GitHub](https://github.com/honojs/hono)
- See our implementation: `src/index.ts` and `src/routes/stories.routes.ts`

## Future Enhancement: Pagination

The current architecture is designed to easily support pagination with minimal changes. Here's how pagination could be implemented:

### 1. Update Route to Accept Query Parameters
```typescript
// In stories.routes.ts
storiesRoutes.get('/', async (c) => {
  const page = parseInt(c.req.query('page') || '1')
  const limit = parseInt(c.req.query('limit') || '20')
  const offset = (page - 1) * limit
  
  const { stories, total } = await getStoriesWithPagination(offset, limit)
  
  return c.json({
    data: stories,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  })
})
```

### 2. Modify Service Layer
```typescript
// In hn-api.service.ts
export async function getTopStoryIds(limit = 20, offset = 0): Promise<number[]> {
  const response = await fetch(`${HN_API_BASE}/topstories.json`)
  const storyIds = await response.json() as number[]
  return storyIds.slice(offset, offset + limit)
}
```

### 3. Cache Strategy Options

**Option A: Cache All Story IDs**
```typescript
// Cache all 500 story IDs, fetch details on demand
const allStoryIds = await getAllTopStoryIds() // Returns all 500
const pageIds = allStoryIds.slice(offset, offset + limit)
const stories = await fetchStoriesDetails(pageIds)
```

**Option B: Sliding Window Cache**
```typescript
// Cache stories in chunks/pages
const cacheKey = `stories_page_${page}_limit_${limit}`
const cached = cache.get(cacheKey)
```

**Option C: Extended Cache**
```typescript
// Store more stories in cache (e.g., top 100)
// Serve pages from this larger cache
const TOP_STORIES_CACHE_SIZE = 100
```

### 4. Benefits of Current Architecture for Pagination
- Service layer already accepts `limit` parameter
- Cache service is abstracted and can handle different strategies
- Routes are cleanly separated from business logic
- TypeScript types can be easily extended for pagination metadata

The modular design means pagination can be added without refactoring the core architecture.