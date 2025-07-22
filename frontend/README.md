# Hacker News Aggregator Frontend

A minimal React frontend for the HN Story Aggregator backend, built with React + TypeScript + Vite.

## Tech Stack

- **React 19** - Component-based UI library
- **TypeScript** - Type safety and better developer experience
- **Vite** - Lightning-fast development server and build tool
- **React Query** - Server state management
- **React Router** - Client-side routing

## Why This Stack is Perfect for Part 2 Requirements

### 1. **Minimal Setup, Maximum Productivity**
The assignment emphasizes "minimal frontend" with "focus on functionality over aesthetics". This stack provides:
- Zero-config development with Vite's instant HMR
- No time wasted on complex build configurations
- Out-of-the-box TypeScript support

### 2. **React Query for API Integration**
Perfect for the requirement to "fetch data from your backend API":
- Automatic caching of the top 20 stories
- Built-in loading and error states
- No manual state management needed
- Refetch on focus for fresh data

### 3. **React Router for Navigation**
Ideal for "clicking a story to see its details":
- Simple declarative routing between list and detail views
- Browser back button works naturally
- Clean URLs for each story

### 4. **TypeScript for Rapid Development**
Even for a minimal frontend, TypeScript helps:
- Auto-completion for API response types
- Catch errors before runtime
- Self-documenting code through interfaces

### 5. **Focused on Functionality**
This stack avoids complexity:
- No CSS frameworks or preprocessors
- No complex state management (Redux, MobX)
- No unnecessary abstractions
- Just the essentials for fetching and displaying data

## Project Structure

```
src/
├── api/           # API client for backend communication
├── components/    # StoryList and StoryDetail components
├── types/         # TypeScript interfaces for stories and authors
└── App.tsx        # Main app with routing
```

## Getting Started

```bash
npm install
npm run dev
```

The app will be available at http://localhost:5173
