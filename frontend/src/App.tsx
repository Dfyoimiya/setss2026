import { lazy, Suspense } from 'react'
import { App as AntApp } from 'antd'
import { Routes, Route, Navigate } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import ProtectedRoute from '@/components/common/ProtectedRoute'
import AdminRoute from '@/components/common/AdminRoute'
import LoadingSpinner from '@/components/common/LoadingSpinner'

// Auth
const Login = lazy(() => import('@/pages/auth/Login'))
const Register = lazy(() => import('@/pages/auth/Register'))
const ForgotPassword = lazy(() => import('@/pages/auth/ForgotPassword'))
const ResetPassword = lazy(() => import('@/pages/auth/ResetPassword'))
const VerifyEmail = lazy(() => import('@/pages/auth/VerifyEmail'))

// Home
const HomePage = lazy(() => import('@/pages/home/HomePage'))

// Announcements
const AnnouncementsPage = lazy(() => import('@/pages/announcements/AnnouncementsPage'))
const AnnouncementDetailPage = lazy(() => import('@/pages/announcements/AnnouncementDetailPage'))

// Static
const CallForPapersPage = lazy(() => import('@/pages/static/CallForPapersPage'))
const CommitteePage = lazy(() => import('@/pages/static/CommitteePage'))
const ContactPage = lazy(() => import('@/pages/static/ContactPage'))

// Profile
const ProfilePage = lazy(() => import('@/pages/profile/ProfilePage'))

// Submission
const SubmissionListPage = lazy(() => import('@/pages/submission/SubmissionListPage'))
const SubmitPaperPage = lazy(() => import('@/pages/submission/SubmitPaperPage'))
const PaperDetailPage = lazy(() => import('@/pages/submission/PaperDetailPage'))

// Review
const ReviewListPage = lazy(() => import('@/pages/review/ReviewListPage'))
const ReviewDetailPage = lazy(() => import('@/pages/review/ReviewDetailPage'))

// Registration
const RegistrationPage = lazy(() => import('@/pages/registration/RegistrationPage'))

// Admin
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'))
const AdminDashboard = lazy(() => import('@/pages/admin/DashboardPage'))
const AdminUsersPage = lazy(() => import('@/pages/admin/UsersPage'))
const AdminPapersPage = lazy(() => import('@/pages/admin/PapersPage'))
const AdminReviewsPage = lazy(() => import('@/pages/admin/ReviewsPage'))
const AdminRegistrationsPage = lazy(() => import('@/pages/admin/RegistrationsPage'))
const AdminAnnouncementsPage = lazy(() => import('@/pages/admin/AnnouncementsPage'))
const AdminConfigPage = lazy(() => import('@/pages/admin/ConfigPage'))

export default function App() {
  return (
    <AntApp>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          <Route element={<AppLayout />}>
            {/* 公开路由 */}
            <Route index element={<HomePage />} />
            <Route path="announcements" element={<AnnouncementsPage />} />
            <Route path="announcements/:id" element={<AnnouncementDetailPage />} />
            <Route path="call-for-papers" element={<CallForPapersPage />} />
            <Route path="committee" element={<CommitteePage />} />
            <Route path="contact" element={<ContactPage />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="forgot-password" element={<ForgotPassword />} />
            <Route path="reset-password" element={<ResetPassword />} />
            <Route path="verify-email" element={<VerifyEmail />} />

            {/* 需要登录 */}
            <Route element={<ProtectedRoute />}>
              <Route path="profile" element={<ProfilePage />} />
              <Route path="submission" element={<SubmissionListPage />} />
              <Route path="submission/new" element={<SubmitPaperPage />} />
              <Route path="submission/:id" element={<PaperDetailPage />} />
              <Route path="review" element={<ReviewListPage />} />
              <Route path="review/:id" element={<ReviewDetailPage />} />
              <Route path="conference-registration" element={<RegistrationPage />} />

              {/* 需要管理员 */}
              <Route element={<AdminRoute />}>
                <Route path="admin" element={<AdminLayout />}>
                  <Route index element={<Navigate to="dashboard" replace />} />
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="users" element={<AdminUsersPage />} />
                  <Route path="papers" element={<AdminPapersPage />} />
                  <Route path="reviews" element={<AdminReviewsPage />} />
                  <Route path="registrations" element={<AdminRegistrationsPage />} />
                  <Route path="announcements" element={<AdminAnnouncementsPage />} />
                  <Route path="config" element={<AdminConfigPage />} />
                </Route>
              </Route>
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </Suspense>
    </AntApp>
  )
}
