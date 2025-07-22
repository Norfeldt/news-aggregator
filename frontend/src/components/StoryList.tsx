import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../api/client'
import type { Story } from '../types/index.js'

export function StoryList() {
  const { data: stories, isLoading, error } = useQuery<Story[], Error>({
    queryKey: ['stories'],
    queryFn: api.fetchStories,
  })

  if (isLoading) return <div>Loading stories...</div>
  if (error) return <div>Error loading stories: {error.message}</div>

  return (
    <div>
      <h1>Hacker News Top Stories</h1>
      <ol>
        {stories?.map((story) => (
          <li key={story.id} style={{ marginBottom: '10px' }}>
            <h3>{story.title}</h3>
            <div>
              Score: {story.score} | By: {story.by || story.author} | {' '}
              <Link to={`/${story.id}`}>
                Detail View
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}