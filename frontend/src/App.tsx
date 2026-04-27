import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Committee from './pages/Committee'
import Courses from './pages/Courses'
import PreviousEditions from './pages/PreviousEditions'
import RegistrationPage from './pages/RegistrationPage'
import Transportation from './pages/Transportation'
import Accommodation from './pages/Accommodation'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/committee" element={<Committee />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/previous-editions" element={<PreviousEditions />} />
      <Route path="/registration" element={<RegistrationPage />} />
      <Route path="/transportation" element={<Transportation />} />
      <Route path="/accommodation" element={<Accommodation />} />
    </Routes>
  )
}