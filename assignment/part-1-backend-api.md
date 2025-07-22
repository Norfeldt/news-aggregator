# Part 1: Backend API

## Requirements

Create a REST or GraphQL API that:

1. **Fetches and stores the top 20 Hacker News stories in memory** (no DB required)

2. **Exposes an endpoint to retrieve the list of stories** with:
   - Title
   - Score
   - URL
   - Author

3. **Exposes an endpoint to fetch a specific story** with additional author info:
   - Karma
   - Account created date

4. **Allows refreshing the stories** via a dedicated endpoint (`/refresh`)

## Bonus (if time allows)

- Add caching or rate limiting to avoid hitting the HN API unnecessarily
- Structure your API to be easily extensible (e.g., adding pagination later)

## Tech Requirements

- Use **Node.js with TypeScript**
- You're free to use any backend framework (e.g., Express, Fastify, NestJS)
- Write clean, modular code
- Hacker News API: https://github.com/HackerNews/API

## Key Endpoints

### Suggested API Structure

```
GET  /stories          - Get all top 20 stories
GET  /stories/:id      - Get specific story with author details
POST /refresh          - Refresh stories from HN API
```