import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: 'admin' | 'organizer' | 'reviewer'
}

export default function AuthGuard({ children, requiredRole }: AuthGuardProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-[#005C99] animate-spin" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />
  }

  if (requiredRole === 'admin' && !user.role?.includes('admin')) {
    return <Navigate to="/dashboard" replace />
  }

  if (requiredRole === 'organizer' && !(user.role?.includes('admin') || user.role?.includes('organizer'))) {
    return <Navigate to="/dashboard" replace />
  }

  if (requiredRole === 'reviewer' && !(user.role?.includes('admin') || user.role?.includes('reviewer'))) {
    return <Navigate to="/dashboard" replace />
  }

  return <>{children}</>
}
