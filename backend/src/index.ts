import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import storiesRoutes from './routes/stories.routes'
import { refreshStories, getCacheStats } from './services/story-cache.service'

const app = new Hono()

// Middleware
app.use('*', logger())
app.use('*', cors({
  origin: '*', // Allow all origins for development
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}))

// Routes
app.get('/', (c) => {
  return c.json({
    message: 'Hacker News Aggregator API',
    version: '1.0.0',
    endpoints: {
      'GET /stories': 'Get top 20 stories',
      'GET /stories/:id': 'Get story details with author info',
      'POST /refresh': 'Refresh stories cache'
    }
  })
})

// Mount stories routes
app.route('/stories', storiesRoutes)

// Handle /refresh at root level as per requirements
app.post('/refresh', async (c) => {
  try {
    await refreshStories()
    
    return c.json({
      message: 'Stories refreshed successfully',
      cache: getCacheStats()
    })
  } catch (error) {
    console.error('Error refreshing stories:', error)
    return c.json({ error: 'Failed to refresh stories' }, 500)
  }
})

// 404 handler
app.notFound((c) => {
  return c.json({ error: 'Not Found' }, 404)
})

// Error handler
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json({ error: 'Internal Server Error' }, 500)
})

const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})