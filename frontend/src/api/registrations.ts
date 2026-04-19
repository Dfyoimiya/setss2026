import apiClient from './client'
import type { Registration } from '@/types'

export const registrationApi = {
  register: (data: {
    registration_type: string
    institution?: string
    position?: string
    dietary_preference?: string
  }) => apiClient.post<Registration>('/registrations/', data).then((r) => r.data),

  getMyRegistration: () =>
    apiClient.get<Registration>('/registrations/me').then((r) => r.data),

  updateMine: (data: {
    institution?: string
    position?: string
    dietary_preference?: string
    registration_type?: string
  }) => apiClient.patch<Registration>('/registrations/me', data).then((r) => r.data),
}
