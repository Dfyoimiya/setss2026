import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { Download, Edit2, Trash2, Send } from 'lucide-react'
import { useSubmission, useUpdateSubmission, useDeleteSubmission, useSubmitSubmission, useUploadFile } from '@/hooks/useSubmissionQuery'
import { submissionService } from '@/api/submissionService'
import PageHeader from '@/components/PageHeader'
import { SUBMISSION_STATUS_MAP } from '@/api/types'
import type { SubmissionUpdateForm } from '@/api/types'

export default function PaperDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: submission, isLoading } = useSubmission(id)
  const updateMutation = useUpdateSubmission()
  const deleteMutation = useDeleteSubmission()
  const submitMutation = useSubmitSubmission()
  const uploadMutation = useUploadFile()

  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState<SubmissionUpdateForm>({})

  if (isLoading) {
    return (
      <div className="p-8 space-y-4">
        <div className="skeleton h-8 w-64" />
        <div className="skeleton h-64 w-full" />
      </div>
    )
  }

  if (!submission) {
    return (
      <div className="text-center py-12">
        <p className="text-[#64748B]">论文未找到</p>
        <Link to="/papers" className="text-[#00629B] hover:underline text-sm mt-2 inline-block">
          返回列表
        </Link>
      </div>
    )
  }

  const st = SUBMISSION_STATUS_MAP[submission.status]
  const canEdit = submission.status === 'draft' || submission.status === 'revision_requested'
  const canSubmit = submission.status === 'draft'

  const handleEdit = () => {
    setEditForm({
      title: submission.title,
      abstract: submission.abstract,
      keywords: submission.keywords,
    })
    setEditMode(true)
  }

  const handleSaveEdit = () => {
    if (!id) return
    updateMutation.mutate({ id, data: editForm }, {
      onSuccess: () => setEditMode(false),
    })
  }

  const handleDelete = () => {
    if (!id) return
    if (!window.confirm('确定要撤回这篇论文吗？')) return
    deleteMutation.mutate(id, {
      onSuccess: () => navigate('/papers'),
    })
  }

  const handleSubmit = () => {
    if (!id) return
    submitMutation.mutate(id, {
      onSuccess: () => navigate('/papers'),
    })
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !id) return
    uploadMutation.mutate({ id, file })
  }

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      const res = await submissionService.downloadFile(id!, fileId)
      const url = URL.createObjectURL(new Blob([res.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = fileName
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      // error handled by interceptor
    }
  }

  return (
    <div className="max-w-4xl animate-fade-in-up">
      <PageHeader
        title={submission.title}
        breadcrumbs={[
          { label: '首页', href: '/' },
          { label: '仪表盘', href: '/dashboard' },
          { label: '我的论文', href: '/papers' },
          { label: '论文详情' },
        ]}
        actions={
          <div className="flex items-center gap-2">
            {canSubmit && (
              <button onClick={handleSubmit} disabled={submitMutation.isPending} className="btn-accent">
                <Send className="w-4 h-4 mr-1.5" /> 提交评审
              </button>
            )}
            {canEdit && (
              <button onClick={editMode ? handleSaveEdit : handleEdit} className="btn-accent-outline">
                <Edit2 className="w-4 h-4 mr-1.5" />
                {editMode ? '保存' : '编辑'}
              </button>
            )}
            {canEdit && (
              <button onClick={handleDelete} className="btn-danger">
                <Trash2 className="w-4 h-4 mr-1.5" /> 撤回
              </button>
            )}
          </div>
        }
      />

      {/* 状态标签 */}
      <div className="mb-6">
        <span className={`rounded-full px-3 py-1 text-xs font-medium ${st?.color || ''}`}>
          {st?.label || submission.status}
        </span>
      </div>

      {/* 基本信息 */}
      <div className="card-standard mb-6">
        <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">基本信息</h3>
        {editMode ? (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1">标题</label>
              <input
                value={editForm.title || ''}
                onChange={(e) => setEditForm((p) => ({ ...p, title: e.target.value }))}
                className="input-standard"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1">摘要</label>
              <textarea
                value={(editForm.abstract || '').replace(/\\n/g, '\n')}
                onChange={(e) => setEditForm((p) => ({ ...p, abstract: e.target.value }))}
                className="input-standard min-h-[120px] resize-y"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-1">关键词</label>
              <input
                value={editForm.keywords || ''}
                onChange={(e) => setEditForm((p) => ({ ...p, keywords: e.target.value }))}
                className="input-standard"
              />
            </div>
          </div>
        ) : (
          <dl className="space-y-4">
            <div>
              <dt className="text-xs text-[#64748B] mb-1">摘要</dt>
              <dd className="text-sm text-[#1E293B] leading-relaxed whitespace-pre-wrap">
                {(submission.abstract || '').replace(/\\n/g, '\n')}
              </dd>
            </div>
            <div>
              <dt className="text-xs text-[#64748B] mb-1">关键词</dt>
              <dd className="text-sm text-[#1E293B]">{submission.keywords}</dd>
            </div>
          </dl>
        )}
      </div>

      {/* 作者信息 */}
      <div className="card-standard mb-6">
        <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">作者信息</h3>
        <div className="space-y-3">
          {submission.authors.map((a, i) => (
            <div key={i} className="flex items-center gap-3 text-sm">
              <span className="text-[#64748B]">#{i + 1}</span>
              <span className="font-medium text-[#1E293B]">{a.name}</span>
              <span className="text-[#64748B]">{a.institution}</span>
              <span className="text-[#64748B] text-xs">{a.email}</span>
            </div>
          ))}
        </div>
        <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
          <p className="text-xs text-[#64748B] mb-1">通讯作者</p>
          <div className="flex items-center gap-3 text-sm">
            <span className="font-medium text-[#1E293B]">{submission.corresponding_author.name}</span>
            <span className="text-[#64748B]">{submission.corresponding_author.institution}</span>
            <span className="text-[#64748B] text-xs">{submission.corresponding_author.email}</span>
          </div>
        </div>
      </div>

      {/* 文件 */}
      <div className="card-standard mb-6">
        <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">论文文件</h3>
        {submission.files.length > 0 ? (
          <div className="space-y-2">
            {submission.files.map((f) => (
              <div key={f.id} className="flex items-center justify-between p-3 bg-[#F8FAFC] rounded-lg">
                <div>
                  <p className="text-sm font-medium text-[#1E293B]">{f.file_name}</p>
                  <p className="text-xs text-[#64748B]">
                    版本 {f.version} · {(f.file_size / 1024).toFixed(1)} KB · {f.uploaded_at ? new Date(f.uploaded_at).toLocaleString('zh-CN') : '-'}
                  </p>
                </div>
                <button
                  onClick={() => handleDownload(f.id, f.file_name)}
                  className="btn-accent-outline text-xs px-3 py-1.5"
                >
                  <Download className="w-3.5 h-3.5 mr-1" /> 下载
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#64748B]">暂未上传文件</p>
        )}

        {canEdit && (
          <div className="mt-4">
            <label className="btn-accent-outline text-xs cursor-pointer inline-flex items-center px-3 py-1.5">
              <UploadFile className="w-3.5 h-3.5 mr-1" /> 上传新版本
              <input type="file" accept=".pdf" className="hidden" onChange={handleFileUpload} />
            </label>
          </div>
        )}
      </div>

      {/* 评审意见（作者可见） */}
      {submission.status === 'under_review' || submission.status === 'revision_requested' || submission.status === 'accepted' || submission.status === 'rejected' ? (
        <div className="card-standard mb-6">
          <h3 className="text-sm font-semibold text-[#64748B] uppercase tracking-wider mb-4">评审意见</h3>
          <SubmissionReviews />
        </div>
      ) : null}
    </div>
  )
}

function UploadFile(props: React.SVGProps<SVGSVGElement>) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
}

function SubmissionReviews() {
  return (
    <p className="text-sm text-[#64748B]">评审意见将在论文进入评审阶段后显示</p>
  )
}
