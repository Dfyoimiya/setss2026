import { useMutation, useQuery } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authService } from '@/api/authService'
import { useAuthStore } from '@/stores/authStore'
import type { LoginRequest, RegisterRequest, UserUpdateRequest, PasswordChangeRequest } from '@/api/types'

export function useLogin() {
  const setAuth = useAuthStore((s) => s.setAuth)

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: async (res) => {
      const { access_token } = res.data.data!
      try {
        const meRes = await authService.getMe()
        const user = meRes.data.data!
        setAuth(access_token, user)
        toast.success('登录成功')
        window.location.reload()
      } catch {
        setAuth(access_token, {} as Parameters<typeof setAuth>[1])
        toast.success('登录成功')
        window.location.reload()
      }
    },
    onError: () => {
      // 拦截器已处理 toast，此处仅清理状态
    },
  })
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: () => {
      // 注册成功后由 AuthModal 自动调用登录，不显示提示
    },
  })
}

export function useCurrentUser() {
  const setUser = useAuthStore((s) => s.setUser)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated)

  return useQuery({
    queryKey: ['user', 'me'],
    queryFn: async () => {
      const res = await authService.getMe()
      setUser(res.data.data!)
      return res.data.data!
    },
    enabled: isAuthenticated,
    staleTime: 10 * 60 * 1000,
    retry: false,
  })
}

export function useUpdateProfile() {
  const setUser = useAuthStore((s) => s.setUser)

  return useMutation({
    mutationFn: (data: UserUpdateRequest) => authService.updateMe(data),
    onSuccess: (res) => {
      setUser(res.data.data!)
      toast.success('个人信息已更新')
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: PasswordChangeRequest) => authService.changePassword(data),
    onSuccess: () => {
      toast.success('密码修改成功')
    },
  })
}
