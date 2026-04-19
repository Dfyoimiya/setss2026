// Type definitions mirroring backend schemas

export interface User {
  id: string
  email: string
  full_name: string | null
  institution: string | null
  phone: string | null
  role: string
  is_active: boolean
  created_at: string | null
}

export interface Token {
  access_token: string
  token_type: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  is_published: boolean
  author_id: string
  created_at: string | null
  updated_at: string | null
}

export interface ConfigItem {
  key: string
  value: string
  description: string | null
  updated_at: string | null
}

export interface PaperAuthor {
  id: string
  name: string
  email: string
  institution: string | null
  is_corresponding: boolean
  order: number
}

export interface Paper {
  id: string
  submission_number: string
  title: string
  abstract: string
  keywords: string
  topic: string
  status: string
  submitter_id: string
  file_path: string | null
  camera_ready_path: string | null
  created_at: string | null
  updated_at: string | null
  co_authors: PaperAuthor[]
}

export interface PaperBlind {
  id: string
  submission_number: string
  title: string
  abstract: string
  keywords: string
  topic: string
}

export interface Review {
  id: string
  paper_id: string
  reviewer_id: string
  score: number | null
  comments: string | null
  recommendation: string | null
  status: string
  created_at: string | null
  updated_at: string | null
}

export interface ReviewWithPaper {
  id: string
  paper: PaperBlind
  score: number | null
  comments: string | null
  recommendation: string | null
  status: string
}

export interface Registration {
  id: string
  confirmation_code: string
  user_id: string
  registration_type: string
  institution: string | null
  position: string | null
  dietary_preference: string | null
  status: string
  created_at: string | null
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  size: number
}

export interface MessageResponse {
  message: string
  data?: unknown
}

export const PAPER_STATUS_LABELS: Record<string, string> = {
  submitted: '已提交',
  under_review: '审稿中',
  accepted: '已接受',
  rejected: '已拒绝',
  revision_required: '需修改',
}

export const PAPER_STATUS_COLORS: Record<string, string> = {
  submitted: 'blue',
  under_review: 'processing',
  accepted: 'success',
  rejected: 'error',
  revision_required: 'warning',
}

export const REGISTRATION_TYPE_LABELS: Record<string, string> = {
  student: '学生',
  regular: '普通参会者',
  speaker: '演讲者',
  virtual: '线上参会',
}

export const REVIEW_STATUS_LABELS: Record<string, string> = {
  pending: '待审稿',
  submitted: '已提交',
}

export const RECOMMENDATION_LABELS: Record<string, string> = {
  accept: '接受',
  reject: '拒绝',
  revise: '需要修改',
}
