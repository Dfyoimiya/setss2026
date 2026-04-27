// ============================================================
// SETSS 2026 — API TypeScript 类型定义
// 完全对照后端 Pydantic Schemas
// ============================================================

// ── 通用响应封装 ──

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T | null
}

export interface PagedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination | null
}

export interface Pagination {
  page: number
  page_size: number
  total: number
  total_pages: number
}

export interface ValidationError {
  detail: Array<{
    loc: (string | number)[]
    msg: string
    type: string
  }>
}

// ── 认证 ──

export interface TokenResponse {
  access_token: string
  token_type: 'bearer'
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  full_name?: string
  institution?: string
}

export interface PasswordChangeRequest {
  old_password: string
  new_password: string
}

export interface ForgotPasswordRequest {
  email: string
}

export interface ResetPasswordRequest {
  token: string
  new_password: string
}

export interface MessageResponse {
  message: string
}

// ── 用户 ──

export interface User {
  id: string
  email: string
  full_name: string | null
  institution: string | null
  role: string // e.g. "admin,organizer,reviewer"
  is_active: boolean
  created_at: string | null
}

export interface UserUpdateRequest {
  full_name?: string | null
  institution?: string | null
}

export interface RoleUpdateRequest {
  role: string
}

export interface StatusUpdateRequest {
  is_active: boolean
}

// ── 投稿周期 ──

export interface SubmissionPeriod {
  id: string
  name: string
  description: string | null
  start_date: string
  end_date: string
  review_deadline: string
  rebuttal_deadline: string
  final_decision_deadline: string
  reviewers_per_paper: number
  is_active: boolean
  created_at: string | null
  updated_at: string | null
}

export interface SubmissionPeriodListItem {
  id: string
  name: string
  start_date: string
  end_date: string
  is_active: boolean
}

export interface SubmissionPeriodForm {
  name: string
  description?: string
  start_date: string
  end_date: string
  review_deadline: string
  rebuttal_deadline: string
  final_decision_deadline: string
  reviewers_per_paper?: number
}

export interface SubmissionPeriodUpdate {
  name?: string
  description?: string
  start_date?: string
  end_date?: string
  review_deadline?: string
  rebuttal_deadline?: string
  final_decision_deadline?: string
  reviewers_per_paper?: number
  is_active?: boolean
}

// ── 作者 ──

export interface AuthorInfo {
  name: string
  institution: string
  email: string
}

export interface CorrespondingAuthor {
  name: string
  institution: string
  email: string
}

// ── 论文 ──

export type SubmissionStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'accepted'
  | 'rejected'
  | 'revision_requested'
  | 'withdrawn'

export interface SubmissionForm {
  title: string
  abstract: string
  keywords: string
  authors: AuthorInfo[]
  corresponding_author: CorrespondingAuthor
  period_id: string
}

export interface SubmissionUpdateForm {
  title?: string
  abstract?: string
  keywords?: string
  authors?: AuthorInfo[]
  corresponding_author?: CorrespondingAuthor
}

export interface SubmissionFile {
  id: string
  file_name: string
  file_size: number
  version: number
  is_current: boolean
  uploaded_at: string | null
}

export interface Submission {
  id: string
  user_id: string
  period_id: string
  title: string
  abstract: string
  keywords: string
  authors: AuthorInfo[]
  corresponding_author: CorrespondingAuthor
  status: SubmissionStatus
  created_at: string | null
  updated_at: string | null
  files: SubmissionFile[]
}

export interface SubmissionListItem {
  id: string
  title: string
  status: SubmissionStatus
  created_at: string | null
  updated_at: string | null
}

export interface SubmissionReviewerView {
  id: string
  title: string
  abstract: string
  keywords: string
  authors: AuthorInfo[]
  corresponding_author: CorrespondingAuthor
  status: string
  created_at: string | null
  files: SubmissionFile[]
}

// ── 评审 ──

export type ReviewRecommendation =
  | 'accept'
  | 'reject'
  | 'major_revision'
  | 'minor_revision'

export type AdminDecisionValue =
  | 'accepted'
  | 'rejected'
  | 'minor_revision'
  | 'major_revision'

export interface ReviewForm {
  overall_score: number // 1-10
  detailed_comments: string
  recommendation: ReviewRecommendation
}

export interface ReviewUpdateForm {
  overall_score?: number
  detailed_comments?: string
  recommendation?: ReviewRecommendation
}

export interface Review {
  id: string
  assignment_id: string
  overall_score: number
  detailed_comments: string
  recommendation: string
  is_visible_to_author: boolean
  created_at: string | null
  updated_at: string | null
}

export interface ReviewForAuthor {
  id: string
  overall_score: number
  detailed_comments: string
  recommendation: string
  created_at: string | null
  reviewer_number: number
  rebuttal: Rebuttal | null
}

export type AssignmentStatus =
  | 'pending'
  | 'accepted'
  | 'declined'
  | 'in_review'
  | 'completed'

export interface ReviewAssignment {
  id: string
  submission_id: string
  reviewer_id: string
  status: AssignmentStatus
  assigned_by: string | null
  assigned_at: string | null
  deadline: string
  completed_at: string | null
  created_at: string | null
  updated_at: string | null
  submission: SubmissionReviewerView | null
  review: Review | null
}

export interface ReviewAssignmentListItem {
  id: string
  submission_id: string
  status: AssignmentStatus
  deadline: string
  completed_at: string | null
  created_at: string | null
}

export interface AssignmentDecision {
  accept: boolean
}

export interface AdminDecisionRequest {
  decision: AdminDecisionValue
}

export interface ReviewVisibilityUpdate {
  is_visible_to_author: boolean
}

// ── 反驳 ──

export interface RebuttalForm {
  content: string
}

export interface Rebuttal {
  id: string
  review_id: string
  content: string
  is_visible_to_reviewer: boolean
  created_at: string | null
}

// ── 管理评审人 ──

export interface Reviewer {
  id: string
  email: string
  full_name: string | null
  institution: string | null
}

export interface ManualAssignmentRequest {
  submission_id: string
  reviewer_id: string
}

// ── 工具函数 ──

export function hasRole(userRole: string | undefined, role: string): boolean {
  if (!userRole) return false
  return userRole.split(',').map((r) => r.trim()).includes(role)
}

export function isAdmin(role: string | undefined): boolean {
  return hasRole(role, 'admin')
}

export function isOrganizer(role: string | undefined): boolean {
  return hasRole(role, 'admin') || hasRole(role, 'organizer')
}

export function isReviewer(role: string | undefined): boolean {
  return hasRole(role, 'admin') || hasRole(role, 'reviewer')
}

// ── 状态显示映射 ──

export const SUBMISSION_STATUS_MAP: Record<SubmissionStatus, { label: string; color: string }> = {
  draft: { label: '草稿', color: 'bg-gray-100 text-gray-600' },
  submitted: { label: '已提交', color: 'bg-blue-100 text-blue-700' },
  under_review: { label: '评审中', color: 'bg-amber-100 text-amber-700' },
  accepted: { label: '已接收', color: 'bg-green-100 text-green-700' },
  rejected: { label: '已拒绝', color: 'bg-red-100 text-red-700' },
  revision_requested: { label: '需修改', color: 'bg-purple-100 text-purple-700' },
  withdrawn: { label: '已撤回', color: 'bg-gray-100 text-gray-500' },
}

export const ASSIGNMENT_STATUS_MAP: Record<AssignmentStatus, { label: string; color: string }> = {
  pending: { label: '待响应', color: 'bg-gray-100 text-gray-600' },
  accepted: { label: '已接受', color: 'bg-blue-100 text-blue-700' },
  declined: { label: '已拒绝', color: 'bg-red-100 text-red-700' },
  in_review: { label: '评审中', color: 'bg-amber-100 text-amber-700' },
  completed: { label: '已完成', color: 'bg-green-100 text-green-700' },
}

export const RECOMMENDATION_MAP: Record<ReviewRecommendation, string> = {
  accept: '接收 (Accept)',
  reject: '拒绝 (Reject)',
  major_revision: '大修 (Major Revision)',
  minor_revision: '小修 (Minor Revision)',
}
