import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Committee from './pages/Committee'
import Courses from './pages/Courses'
import PreviousEditions from './pages/PreviousEditions'
import RegistrationPage from './pages/RegistrationPage'
import Transportation from './pages/Transportation'
import Accommodation from './pages/Accommodation'
import Dashboard from './pages/Dashboard'
import Submission from './pages/Submission'
import Papers from './pages/Papers'
import PaperDetail from './pages/PaperDetail'
import Reviews from './pages/Reviews'
import ReviewDetail from './pages/ReviewDetail'
import AdminUsers from './pages/admin/AdminUsers'
import AdminPapers from './pages/admin/AdminPapers'
import AdminReviews from './pages/admin/AdminReviews'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './layouts/DashboardLayout'

export default function App() {
  return (
    <Routes>
      {/* 公开页面 */}
      <Route path="/" element={<Home />} />
      <Route path="/committee" element={<Committee />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/previous-editions" element={<PreviousEditions />} />
      <Route path="/registration" element={<RegistrationPage />} />
      <Route path="/transportation" element={<Transportation />} />
      <Route path="/accommodation" element={<Accommodation />} />

      {/* 认证用户页面 */}
      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/submission" element={<Submission />} />
          <Route path="/papers" element={<Papers />} />
          <Route path="/papers/:id" element={<PaperDetail />} />
          <Route path="/reviews" element={<Reviews />} />
          <Route path="/reviews/:id" element={<ReviewDetail />} />
        </Route>
      </Route>

      {/* 管理员页面 */}
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route element={<DashboardLayout admin />}>
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/papers" element={<AdminPapers />} />
          <Route path="/admin/reviews" element={<AdminReviews />} />
        </Route>
      </Route>
    </Routes>
  )
}
