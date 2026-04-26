const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'
const TOKEN_KEY = 'setss-auth-token'
const USER_KEY = 'setss-auth-user'

export interface ApiEnvelope<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PagedEnvelope<T = unknown> extends ApiEnvelope<T[]> {
  pagination?: {
    page: number
    page_size: number
    total: number
    total_pages: number
  }
}

export class ApiError extends Error {
  code: number
  status: number

  constructor(message: string, code: number, status: number) {
    super(message)
    this.code = code
    this.status = status
    this.name = 'ApiError'
  }
}

function getToken(): string | null {
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
}

export function isAuthenticated(): boolean {
  return !!getToken()
}

export function getStoredUser(): { name: string; email: string } | null {
  const raw = localStorage.getItem(USER_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw)
  } catch {
    return null
  }
}

export function setStoredUser(user: { name: string; email: string }): void {
  localStorage.setItem(USER_KEY, JSON.stringify(user))
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<ApiEnvelope<T>> {
  const token = getToken()
  const headers: Record<string, string> = {
    ...((options.headers as Record<string, string>) || {}),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  if (options.body && typeof options.body === 'string') {
    headers['Content-Type'] = 'application/json'
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
  })

  if (res.status === 401) {
    clearToken()
    throw new ApiError('Unauthorized', 401, 401)
  }

  let json: ApiEnvelope<T>
  try {
    json = await res.json()
  } catch {
    throw new ApiError('Invalid response', 0, res.status)
  }

  if (!res.ok) {
    const detail = (json as ApiEnvelope & { detail?: string }).detail
    throw new ApiError(
      detail || json.message || 'Request failed',
      json.code || res.status,
      res.status,
    )
  }

  return json
}

export const api = {
  get<T>(path: string): Promise<ApiEnvelope<T>> {
    return request<T>(path, { method: 'GET' })
  },

  post<T>(path: string, body?: unknown): Promise<ApiEnvelope<T>> {
    return request<T>(path, {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  put<T>(path: string, body?: unknown): Promise<ApiEnvelope<T>> {
    return request<T>(path, {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  patch<T>(path: string, body?: unknown): Promise<ApiEnvelope<T>> {
    return request<T>(path, {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined,
    })
  },

  delete<T>(path: string): Promise<ApiEnvelope<T>> {
    return request<T>(path, { method: 'DELETE' })
  },

  upload<T>(path: string, formData: FormData): Promise<ApiEnvelope<T>> {
    const token = getToken()
    const headers: Record<string, string> = {}
    if (token) {
      headers['Authorization'] = `Bearer ${token}`
    }
    return fetch(`${API_URL}${path}`, {
      method: 'POST',
      headers,
      body: formData,
    }).then(async (res) => {
      const json = await res.json()
      if (!res.ok) {
        throw new ApiError(json.message || 'Upload failed', json.code, res.status)
      }
      return json
    })
  },
}
