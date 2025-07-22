import type { Story, StoriesResponse, StoryResponse } from '../types/index.js'

const API_BASE_URL = 'http://localhost:3000'

export const api = {
  async fetchStories(): Promise<Story[]> {
    const response = await fetch(`${API_BASE_URL}/stories`)
    if (!response.ok) {
      throw new Error('Failed to fetch stories')
    }
    const data: StoriesResponse = await response.json()
    return data.stories // Extract the stories array from the response
  },

  async fetchStory(id: string): Promise<Story> {
    const response = await fetch(`${API_BASE_URL}/stories/${id}`)
    if (!response.ok) {
      throw new Error('Failed to fetch story')
    }
    const data: StoryResponse = await response.json()
    return data.story // Extract the story object from the response
  },

  async refreshStories(): Promise<unknown> {
    const response = await fetch(`${API_BASE_URL}/refresh`, {
      method: 'POST',
    })
    if (!response.ok) {
      throw new Error('Failed to refresh stories')
    }
    return response.json()
  },
}