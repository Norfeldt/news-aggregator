import { Routes, Route } from 'react-router-dom'
import { StoryList } from './components/StoryList'
import { StoryDetail } from './components/StoryDetail'
import './App.css'

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<StoryList />} />
        <Route path="/:id" element={<StoryDetail />} />
      </Routes>
    </div>
  )
}

export default App
