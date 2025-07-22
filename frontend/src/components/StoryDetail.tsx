import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import type { Story } from '../types/index.js'

export function StoryDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  
  const { data: story, isLoading, error } = useQuery<Story, Error>({
    queryKey: ['story', id],
    queryFn: () => api.fetchStory(id!),
    enabled: !!id,
  })

  if (isLoading) return <div>Loading story details...</div>
  if (error) return <div>Error loading story: {error.message}</div>
  if (!story) return <div>Story not found</div>

  const formatDate = (timestamp: number): string => {
    return new Date(timestamp * 1000).toLocaleString()
  }

  const calculateAccountAge = (created: number): string => {
    const now = Date.now() / 1000
    const ageInDays = Math.floor((now - created) / (60 * 60 * 24))
    if (ageInDays < 365) {
      return `${ageInDays} days`
    }
    const years = Math.floor(ageInDays / 365)
    return `${years} year${years !== 1 ? 's' : ''}`
  }

  return (
    <div>
      <button onClick={() => navigate('/')}>← Back to list</button>
      
      <h1>{story.title}</h1>
      
      <div>
        <p><strong>Score:</strong> {story.score}</p>
        <p><strong>By:</strong> {story.by}</p>
        <p><strong>Time:</strong> {formatDate(story.time)}</p>
        <p><strong>Comments:</strong> {story.descendants || 0}</p>
        {story.url && (
          <p>
            <strong>URL:</strong>{' '}
            <a href={story.url} target="_blank" rel="noopener noreferrer">
              {story.url}
            </a>
          </p>
        )}
      </div>

      {story.text && (
        <div>
          <h2>Content</h2>
          <div dangerouslySetInnerHTML={{ __html: story.text }} />
        </div>
      )}

      {story.authorInfo && (
        <div>
          <h2>Author Information</h2>
          <p><strong>Username:</strong> {story.authorInfo.id}</p>
          <p><strong>Karma:</strong> {story.authorInfo.karma}</p>
          <p><strong>Account Age:</strong> {calculateAccountAge(story.authorInfo.created)}</p>
          {story.authorInfo.about && (
            <div>
              <strong>About:</strong>
              <div dangerouslySetInnerHTML={{ __html: story.authorInfo.about }} />
            </div>
          )}
        </div>
      )}
    </div>
  )
}