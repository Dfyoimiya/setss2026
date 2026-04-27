import axios from 'axios'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/authStore'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
})

// 请求拦截器 — 自动附加 Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('setss-auth')
    if (token) {
      try {
        const parsed = JSON.parse(token)
        if (parsed.state?.token) {
          config.headers.Authorization = `Bearer ${parsed.state.token}`
        }
      } catch {
        // ignore parse errors
      }
    }
    return config
  },
  (error) => Promise.reject(error),
)

// 响应拦截器 — 统一错误处理
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      const { status, data } = error.response

      switch (status) {
        case 401: {
          // 清除状态并提示
          useAuthStore.getState().logout()
          const message = getErrorMessage(data, '登录已过期，请重新登录')
          if (window.location.pathname !== '/') {
            toast.error(message)
          }
          break
        }
        case 403:
          toast.error(getErrorMessage(data, '无权限执行此操作'))
          break
        case 404:
          toast.error(getErrorMessage(data, '请求的资源不存在'))
          break
        case 409:
          toast.error(getErrorMessage(data, '操作冲突，数据可能已变更'))
          break
        case 422: {
          // 参数验证错误
          const msg = extractValidationErrors(data)
          toast.error(msg)
          break
        }
        case 500:
        default:
          if (status >= 500) {
            toast.error(getErrorMessage(data, '服务器错误，请稍后重试'))
          } else {
            toast.error(getErrorMessage(data, '请求失败'))
          }
          break
      }
    } else if (error.request) {
      toast.error('网络连接失败，请检查网络')
    }

    return Promise.reject(error)
  },
)

// 从后端响应中提取中文错误信息
function getErrorMessage(data: unknown, fallback: string): string {
  if (typeof data === 'object' && data !== null) {
    const d = data as Record<string, unknown>
    // 优先使用 detail（FastAPI HTTPException）
    if (typeof d.detail === 'string') return d.detail
    // 其次使用 message（自定义 ApiResponse）
    if (typeof d.message === 'string') return d.message
  }
  return fallback
}

// 提取 422 验证错误的字段信息
function extractValidationErrors(data: unknown): string {
  if (typeof data === 'object' && data !== null) {
    const d = data as Record<string, unknown>
    if (Array.isArray(d.detail)) {
      const errors = d.detail
        .map((e: { loc?: string[]; msg?: string }) => {
          const field = e.loc?.filter((l) => l !== 'body').join('.') || ''
          if (field && e.msg) return `${field}: ${e.msg}`
          return e.msg || ''
        })
        .filter(Boolean)
        .slice(0, 3)
      if (errors.length > 0) return errors.join('；')
    }
  }
  return '提交的数据格式不正确'
}

export default apiClient
