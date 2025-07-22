import type { HNStory, CachedStory, StoryCache } from '../types/hn.types'
import { getTopStories, getStory } from './hn-api.service'

// In-memory cache for stories
const storyCache: StoryCache = new Map()

// Cache duration: 5 minutes
const CACHE_DURATION_MS = 5 * 60 * 1000

// Track last refresh time
let lastRefreshTime = 0

function isCacheValid(): boolean {
  const now = Date.now()
  return now - lastRefreshTime < CACHE_DURATION_MS && storyCache.size > 0
}

function addToCache(story: HNStory): void {
  const cachedStory: CachedStory = {
    ...story,
    cachedAt: Date.now()
  }
  storyCache.set(story.id, cachedStory)
}

export async function getCachedStories(): Promise<HNStory[]> {
  if (!isCacheValid()) {
    await refreshStories()
  }
  
  // Return stories sorted by their original order (score/time)
  return Array.from(storyCache.values())
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
}

export async function getCachedStory(id: number): Promise<HNStory | null> {
  // If cache is empty or stale, refresh
  if (!isCacheValid()) {
    await refreshStories()
  }
  
  const cachedStory = storyCache.get(id)
  
  // If story not in cache, try to fetch it individually
  if (!cachedStory) {
    const story = await getStory(id)
    if (story) {
      addToCache(story)
      return story
    }
    return null
  }
  
  return cachedStory
}

export async function refreshStories(): Promise<void> {
  try {
    console.log('Refreshing story cache...')
    const stories = await getTopStories(20)
    
    // Clear old cache
    storyCache.clear()
    
    // Add new stories to cache
    stories.forEach(story => addToCache(story))
    
    lastRefreshTime = Date.now()
    console.log(`Cache refreshed with ${stories.length} stories`)
  } catch (error) {
    console.error('Error refreshing stories:', error)
    // Keep existing cache if refresh fails
    if (storyCache.size === 0) {
      throw new Error('Failed to fetch stories and cache is empty')
    }
  }
}

export function getCacheStats() {
  return {
    size: storyCache.size,
    lastRefreshTime,
    isValid: isCacheValid(),
    ageMs: Date.now() - lastRefreshTime
  }
}