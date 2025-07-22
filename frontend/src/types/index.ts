export interface AuthorInfo {
  id: string
  karma: number
  created: number
  about?: string
}

export interface Story {
  id: number
  title: string
  score: number
  by: string
  author?: string
  time: number
  descendants?: number
  url?: string
  text?: string
  authorInfo?: AuthorInfo
}

export interface ApiResponse<T> {
  [key: string]: T
}

export interface StoriesResponse {
  stories: Story[]
}

export interface StoryResponse {
  story: Story
}