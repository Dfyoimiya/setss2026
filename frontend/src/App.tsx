import { Routes, Route } from 'react-router-dom'
import AuthGuard from '@/components/AuthGuard'
import Home from '@/pages/Home'
import Committee from '@/pages/Committee'
import Courses from '@/pages/Courses'
import PreviousEditions from '@/pages/PreviousEditions'
import RegistrationPage from '@/pages/RegistrationPage'
import Transportation from '@/pages/Transportation'
import Accommodation from '@/pages/Accommodation'
import Dashboard from '@/pages/Dashboard'
import SubmissionNew from '@/pages/SubmissionNew'
import SubmissionDetail from '@/pages/SubmissionDetail'
import ReviewerAssignments from '@/pages/ReviewerAssignments'
import AssignmentReview from '@/pages/AssignmentReview'
import AdminLayout from '@/pages/AdminLayout'
import AdminUsers from '@/pages/AdminUsers'
import AdminSubmissions from '@/pages/AdminSubmissions'
import AdminReviews from '@/pages/AdminReviews'
import AdminPeriods from '@/pages/AdminPeriods'

export default function App() {
  return (
    <Routes>
      {/* Public pages */}
      <Route path="/" element={<Home />} />
      <Route path="/committee" element={<Committee />} />
      <Route path="/courses" element={<Courses />} />
      <Route path="/previous-editions" element={<PreviousEditions />} />
      <Route path="/registration" element={<RegistrationPage />} />
      <Route path="/transportation" element={<Transportation />} />
      <Route path="/accommodation" element={<Accommodation />} />

      {/* Protected: any authenticated user */}
      <Route path="/dashboard" element={<AuthGuard><Dashboard /></AuthGuard>} />
      <Route path="/submissions/new" element={<AuthGuard><SubmissionNew /></AuthGuard>} />
      <Route path="/submissions/:id" element={<AuthGuard><SubmissionDetail /></AuthGuard>} />

      {/* Protected: reviewer */}
      <Route path="/reviewer/assignments" element={<AuthGuard requiredRole="reviewer"><ReviewerAssignments /></AuthGuard>} />
      <Route path="/reviewer/assignments/:id" element={<AuthGuard requiredRole="reviewer"><AssignmentReview /></AuthGuard>} />

      {/* Protected: admin/organizer */}
      <Route path="/admin" element={<AuthGuard requiredRole="organizer"><AdminLayout /></AuthGuard>}>
        <Route index element={<AdminSubmissions />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="submissions" element={<AdminSubmissions />} />
        <Route path="reviews" element={<AdminReviews />} />
        <Route path="periods" element={<AdminPeriods />} />
      </Route>
    </Routes>
  )
}
