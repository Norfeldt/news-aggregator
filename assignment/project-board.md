# Project Board - Flimmer News Aggregator Assignment

## 📋 Overview

Time Budget: **1-1.5 hours**

## 🏃 Sprint Board

### 📝 To Do

### 🔄 In Progress

### ✅ Done

- [x] Initial project setup
  - [x] Initialize Node.js project with TypeScript
  - [x] Set up backend framework (Hono)
  - [x] Configure TypeScript and ESLint
  - [x] Create project structure

---

## 📊 Task Breakdown by Part

### Part 1: Backend API (40-50 mins)

#### Setup (10 mins)
- [x] Initialize backend project
- [x] Install dependencies
- [x] Configure TypeScript
- [x] Set up basic server

#### Core Features (25 mins)
- [x] Implement HN API client
- [x] Create in-memory story storage
- [x] Build `/stories` endpoint
- [x] Build `/stories/:id` endpoint with author details
- [x] Implement `/refresh` endpoint

#### Bonus Features (implemented)
- [x] Add caching mechanism (5-minute TTL with auto-refresh)
- [x] Implement rate limiting (100ms delay on HN API calls)
- [x] Design extensible API structure (service layer pattern)

### Part 2: Frontend (15-20 mins)

#### Setup (5 mins)
- [ ] Initialize frontend project
- [ ] Choose and set up framework
- [ ] Configure API client

#### Core Features (10-15 mins)
- [ ] Create story list component
- [ ] Implement story detail view
- [ ] Add navigation between views
- [ ] Connect to backend API

### Part 3: Documentation (10-15 mins)

- [ ] Write setup instructions
- [ ] Document architecture decisions
- [ ] Note any incomplete items
- [ ] Add performance considerations

### Additional Prep (5-10 mins)

- [ ] Review Task 2 (video reaction feature)
- [ ] Think about Task 3 (hiring considerations)
- [ ] Final code review
- [ ] Push to GitHub

---

## 📈 Progress Tracking

### Time Spent
- Backend: 45 mins (22:05 - 22:50 CEST) ✅
- Frontend: ___/20 mins
- Documentation: ___/15 mins
- **Total**: 45/80 mins (target: 60-90 mins)

### Completion Status
- Part 1: 🟩🟩🟩🟩🟩 100% (Complete)
- Part 2: ⬜⬜⬜⬜⬜ 0%
- Part 3: ⬜⬜⬜⬜⬜ 0%

---

## 🎯 Key Milestones

1. **Backend API Working** - Can fetch and serve HN stories
2. **Frontend Connected** - Can display stories from API
3. **Full Flow Complete** - Can refresh and view story details
4. **Documentation Done** - README complete with all sections

---

## 📝 Notes

### Part 1 Accomplishments
- Chose Hono framework for ultrafast performance and edge compatibility
- Implemented all required endpoints with proper error handling
- Added bonus features: caching with TTL, rate limiting, clean architecture
- Created comprehensive README with framework guide and pagination roadmap
- Structured code for easy extension (service layer pattern)

### Quick Wins
- Focus on core functionality first ✅
- Use simple in-memory storage ✅
- Minimal UI is fine
- Document decisions as you go ✅

### Watch Out For
- Don't over-engineer
- Time management is key
- Test basic flows work
- Remember to handle errors gracefully

### Resources
- [Hacker News API Docs](https://github.com/HackerNews/API)
- [TypeScript Quick Reference](https://www.typescriptlang.org/docs/)
- Framework docs (Express/React/Vue)