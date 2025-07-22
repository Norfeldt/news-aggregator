import type { HNItem, HNUser, HNStory } from '../types/hn.types'

const HN_API_BASE = 'https://hacker-news.firebaseio.com/v0'

// Simple rate limiter for HN API calls
let lastApiCall = 0
const MIN_DELAY_MS = 100 // 100ms between API calls

async function throttledFetch(url: string): Promise<Response> {
  const now = Date.now()
  const timeSinceLastCall = now - lastApiCall
  
  if (timeSinceLastCall < MIN_DELAY_MS) {
    await new Promise(resolve => setTimeout(resolve, MIN_DELAY_MS - timeSinceLastCall))
  }
  
  lastApiCall = Date.now()
  const response = await fetch(url)
  
  if (!response.ok) {
    throw new Error(`HN API request failed: ${response.statusText}`)
  }
  
  return response
}

export async function getTopStoryIds(limit = 20): Promise<number[]> {
  try {
    const response = await throttledFetch(`${HN_API_BASE}/topstories.json`)
    const storyIds = await response.json() as number[]
    return storyIds.slice(0, limit)
  } catch (error) {
    console.error('Error fetching top stories:', error)
    throw new Error('Failed to fetch top stories from Hacker News')
  }
}

export async function getItem(id: number): Promise<HNItem | null> {
  try {
    const response = await throttledFetch(`${HN_API_BASE}/item/${id}.json`)
    const item = await response.json() as HNItem | null
    return item
  } catch (error) {
    console.error(`Error fetching item ${id}:`, error)
    return null
  }
}

export async function getStory(id: number): Promise<HNStory | null> {
  const item = await getItem(id)
  
  if (!item || item.type !== 'story' || !item.by || !item.title) {
    return null
  }
  
  return {
    id: item.id,
    title: item.title,
    score: item.score || 0,
    url: item.url,
    by: item.by,
    time: item.time,
    descendants: item.descendants,
    kids: item.kids
  }
}

export async function getUser(username: string): Promise<HNUser | null> {
  try {
    const response = await throttledFetch(`${HN_API_BASE}/user/${username}.json`)
    const user = await response.json() as HNUser | null
    return user
  } catch (error) {
    console.error(`Error fetching user ${username}:`, error)
    return null
  }
}

export async function getTopStories(limit = 20): Promise<HNStory[]> {
  // Fetch extra stories to account for any that might be filtered out
  const storyIds = await getTopStoryIds(limit + 5)
  
  // Fetch stories in parallel but with controlled concurrency
  const stories: HNStory[] = []
  const batchSize = 5 // Process 5 stories at a time
  
  for (let i = 0; i < storyIds.length && stories.length < limit; i += batchSize) {
    const batch = storyIds.slice(i, i + batchSize)
    const batchStories = await Promise.all(
      batch.map(id => getStory(id))
    )
    
    const validStories = batchStories.filter((story): story is HNStory => story !== null)
    stories.push(...validStories)
  }
  
  // Return exactly the requested limit
  return stories.slice(0, limit)
}