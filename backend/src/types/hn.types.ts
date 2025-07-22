// Hacker News API Types
// Using 'type' instead of 'interface' as per project conventions

export type HNItem = {
  id: number
  type: 'job' | 'story' | 'comment' | 'poll' | 'pollopt'
  by?: string
  time: number
  text?: string
  dead?: boolean
  parent?: number
  poll?: number
  kids?: number[]
  url?: string
  score?: number
  title?: string
  parts?: number[]
  descendants?: number
}

export type HNStory = {
  id: number
  title: string
  score: number
  url?: string
  by: string
  time: number
  descendants?: number
  kids?: number[]
}

export type HNUser = {
  id: string
  created: number
  karma: number
  about?: string
  submitted?: number[]
}

// API Response types
export type StoryListItem = {
  id: number
  title: string
  score: number
  url?: string
  author: string
}

export type StoryDetail = StoryListItem & {
  authorKarma: number
  authorCreated: number
}

// Cache types
export type CachedStory = HNStory & {
  cachedAt: number
}

export type StoryCache = Map<number, CachedStory>