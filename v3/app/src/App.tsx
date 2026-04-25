import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Committee from './pages/Committee'
import Courses from './pages/Courses'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/committee" element={<Committee />} />
      <Route path="/courses" element={<Courses />} />
    </Routes>
  )
}