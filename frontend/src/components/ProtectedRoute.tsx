import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/stores/authStore'
import { hasRole } from '@/api/types'

interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'organizer' | 'reviewer' | 'user'
  blockRoles?: string[]
}

export default function ProtectedRoute({ requiredRole, blockRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore()

  if (!isAuthenticated) {
    return <Navigate to="/" replace />
  }

  if (requiredRole === 'admin' && !hasRole(user?.role, 'admin')) {
    return <Navigate to="/dashboard" replace />
  }

  if (requiredRole === 'organizer' && !hasRole(user?.role, 'organizer') && !hasRole(user?.role, 'admin')) {
    return <Navigate to="/dashboard" replace />
  }

  if (requiredRole === 'reviewer' && !hasRole(user?.role, 'reviewer') && !hasRole(user?.role, 'admin')) {
    return <Navigate to="/dashboard" replace />
  }

  if (blockRoles && user?.role) {
    for (const blocked of blockRoles) {
      if (hasRole(user.role, blocked)) {
        return <Navigate to="/dashboard" replace />
      }
    }
  }

  return <Outlet />
}
