import { Hono } from 'hono'
import type { StoryListItem, StoryDetail } from '../types/hn.types'
import { getCachedStories, getCachedStory, refreshStories, getCacheStats } from '../services/story-cache.service'
import { getUser } from '../services/hn-api.service'

const storiesRoutes = new Hono()

// GET /stories - Get all top 20 stories
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

// GET /stories/:id - Get specific story with author details
storiesRoutes.get('/:id', async (c) => {
  const id = parseInt(c.req.param('id'))
  
  if (isNaN(id)) {
    return c.json({ error: 'Invalid story ID' }, 400)
  }
  
  try {
    const story = await getCachedStory(id)
    
    if (!story) {
      return c.json({ error: 'Story not found' }, 404)
    }
    
    // Fetch author details
    const author = await getUser(story.by)
    
    if (!author) {
      return c.json({ error: 'Author details not found' }, 404)
    }
    
    const storyDetail: StoryDetail = {
      id: story.id,
      title: story.title,
      score: story.score,
      url: story.url,
      author: story.by,
      authorKarma: author.karma,
      authorCreated: author.created
    }
    
    return c.json({
      story: storyDetail,
      cache: getCacheStats()
    })
  } catch (error) {
    console.error(`Error fetching story ${id}:`, error)
    return c.json({ error: 'Failed to fetch story details' }, 500)
  }
})

// POST /refresh - Refresh stories cache
storiesRoutes.post('/refresh', async (c) => {
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

export default storiesRoutes