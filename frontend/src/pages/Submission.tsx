import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Trash2, Upload, Send } from 'lucide-react'
import { useCreateSubmission, useUploadFile, useSubmitSubmission } from '@/hooks/useSubmissionQuery'
import { useAdminPeriods } from '@/hooks/useAdminQuery'
import PageHeader from '@/components/PageHeader'
import type { AuthorInfo } from '@/api/types'

interface AuthorEntry {
  name: string
  institution: string
  email: string
}

const emptyForm = {
  title: '',
  abstract: '',
  keywords: '',
  authors: [{ name: '', institution: '', email: '' }] as AuthorEntry[],
  corresponding_author: { name: '', institution: '', email: '' },
  period_id: '',
}

export default function Submission() {
  const navigate = useNavigate()
  const { data: periods } = useAdminPeriods()
  const createMutation = useCreateSubmission()
  const uploadMutation = useUploadFile()
  const submitMutation = useSubmitSubmission()

  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [file, setFile] = useState<File | null>(null)
  const [draftSaved, setDraftSaved] = useState(false)

  // 自动保存草稿到 localStorage
  useEffect(() => {
    const timer = setInterval(() => {
      localStorage.setItem('submission_draft', JSON.stringify(form))
      setDraftSaved(true)
      setTimeout(() => setDraftSaved(false), 2000)
    }, 30000)
    return () => clearInterval(timer)
  }, [form])

  // 恢复草稿
  useEffect(() => {
    const draft = localStorage.getItem('submission_draft')
    if (draft) {
      try { setForm(JSON.parse(draft)) } catch { /* ignore */ }
    }
  }, [])

  const updateAuthor = useCallback((index: number, field: keyof AuthorEntry, value: string) => {
    setForm((prev) => {
      const authors = [...prev.authors]
      authors[index] = { ...authors[index], [field]: value }
      return { ...prev, authors }
    })
  }, [])

  const addAuthor = () => setForm((prev) => ({
    ...prev,
    authors: [...prev.authors, { name: '', institution: '', email: '' }],
  }))

  const removeAuthor = (index: number) => setForm((prev) => ({
    ...prev,
    authors: prev.authors.filter((_, i) => i !== index),
  }))

  const validate = (): boolean => {
    const errs: Record<string, string> = {}
    if (!form.title.trim()) errs.title = '请输入论文标题'
    if (!form.abstract.trim()) errs.abstract = '请输入论文摘要'
    if (!form.keywords.trim()) errs.keywords = '请输入关键词'
    if (!form.period_id) errs.period_id = '请选择投稿周期'
    if (form.authors.some((a) => !a.name || !a.email)) errs.authors = '请填写所有作者信息'
    if (!form.corresponding_author.name || !form.corresponding_author.email) errs.corresponding = '请填写通讯作者信息'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSaveDraft = async () => {
    if (!validate()) return
    createMutation.mutate({
      ...form,
      authors: form.authors as AuthorInfo[],
      corresponding_author: form.corresponding_author as AuthorInfo,
    }, {
      onSuccess: () => {
        localStorage.removeItem('submission_draft')
      },
    })
  }

  const handleSubmit = async () => {
    if (!validate()) return
    createMutation.mutate({
      ...form,
      authors: form.authors as AuthorInfo[],
      corresponding_author: form.corresponding_author as AuthorInfo,
    }, {
      onSuccess: (res) => {
        const sid = res.data.data!.id
        // 如果有文件则上传
        if (file) {
          uploadMutation.mutate({ id: sid, file }, {
            onSuccess: () => {
              submitMutation.mutate(sid, {
                onSuccess: () => navigate(`/papers/${sid}`),
              })
            },
          })
        } else {
          submitMutation.mutate(sid, {
            onSuccess: () => navigate(`/papers/${sid}`),
          })
        }
      },
    })
  }

  const isLoading = createMutation.isPending || uploadMutation.isPending || submitMutation.isPending

  return (
    <div className="max-w-3xl animate-fade-in-up">
      <PageHeader
        title="提交论文"
        breadcrumbs={[{ label: '首页', href: '/' }, { label: '仪表盘', href: '/dashboard' }, { label: '提交论文' }]}
        actions={
          <div className="flex items-center gap-2">
            <button onClick={handleSaveDraft} disabled={isLoading} className="btn-accent-outline">
              保存草稿
            </button>
            <button onClick={handleSubmit} disabled={isLoading} className="btn-accent">
              <Send className="w-4 h-4 mr-1.5" />
              提交
            </button>
          </div>
        }
      />

      {draftSaved && <p className="text-xs text-green-600 mb-4">草稿已自动保存</p>}

      {/* 选择投稿周期 */}
      <div className="card-standard mb-6">
        <label className="block text-sm font-medium text-[#1E293B] mb-2">投稿周期 *</label>
        <select
          value={form.period_id}
          onChange={(e) => setForm((p) => ({ ...p, period_id: e.target.value }))}
          className="input-standard"
        >
          <option value="">请选择投稿周期</option>
          {periods?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name} ({new Date(p.start_date).toLocaleDateString('zh-CN')} - {new Date(p.end_date).toLocaleDateString('zh-CN')})
            </option>
          ))}
        </select>
        {errors.period_id && <p className="text-xs text-red-500 mt-1">{errors.period_id}</p>}
      </div>

      {/* 论文信息 */}
      <div className="card-standard mb-6 space-y-4">
        <h3 className="text-lg font-medium text-[#1E293B]">论文信息</h3>

        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1.5">论文标题 *</label>
          <input
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
            className="input-standard"
            placeholder="输入论文标题（不超过 500 字符）"
            maxLength={500}
          />
          {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1.5">摘要 *</label>
          <textarea
            value={form.abstract}
            onChange={(e) => setForm((p) => ({ ...p, abstract: e.target.value }))}
            className="input-standard min-h-[150px] resize-y"
            placeholder="输入论文摘要"
          />
          {errors.abstract && <p className="text-xs text-red-500 mt-1">{errors.abstract}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#1E293B] mb-1.5">关键词 *</label>
          <input
            value={form.keywords}
            onChange={(e) => setForm((p) => ({ ...p, keywords: e.target.value }))}
            className="input-standard"
            placeholder="用逗号分隔，如：形式化方法, 模型检验, 软件安全"
            maxLength={1024}
          />
          {errors.keywords && <p className="text-xs text-red-500 mt-1">{errors.keywords}</p>}
        </div>
      </div>

      {/* 作者信息 */}
      <div className="card-standard mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium text-[#1E293B]">作者信息</h3>
          <button onClick={addAuthor} className="text-sm text-[#00629B] hover:underline flex items-center gap-1">
            <Plus className="w-3.5 h-3.5" /> 添加作者
          </button>
        </div>
        {errors.authors && <p className="text-xs text-red-500 mb-2">{errors.authors}</p>}
        <div className="space-y-4">
          {form.authors.map((author, i) => (
            <div key={i} className="flex items-start gap-3 p-3 bg-[#F8FAFC] rounded-lg">
              <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  value={author.name}
                  onChange={(e) => updateAuthor(i, 'name', e.target.value)}
                  className="input-standard"
                  placeholder="姓名"
                />
                <input
                  value={author.institution}
                  onChange={(e) => updateAuthor(i, 'institution', e.target.value)}
                  className="input-standard"
                  placeholder="所属机构"
                />
                <input
                  value={author.email}
                  onChange={(e) => updateAuthor(i, 'email', e.target.value)}
                  className="input-standard"
                  placeholder="邮箱"
                  type="email"
                />
              </div>
              {form.authors.length > 1 && (
                <button onClick={() => removeAuthor(i)} className="p-2 text-[#64748B] hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 通讯作者 */}
      <div className="card-standard mb-6">
        <h3 className="text-lg font-medium text-[#1E293B] mb-4">通讯作者</h3>
        {errors.corresponding && <p className="text-xs text-red-500 mb-2">{errors.corresponding}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <input
            value={form.corresponding_author.name}
            onChange={(e) => setForm((p) => ({ ...p, corresponding_author: { ...p.corresponding_author, name: e.target.value } }))}
            className="input-standard"
            placeholder="姓名"
          />
          <input
            value={form.corresponding_author.institution}
            onChange={(e) => setForm((p) => ({ ...p, corresponding_author: { ...p.corresponding_author, institution: e.target.value } }))}
            className="input-standard"
            placeholder="所属机构"
          />
          <input
            value={form.corresponding_author.email}
            onChange={(e) => setForm((p) => ({ ...p, corresponding_author: { ...p.corresponding_author, email: e.target.value } }))}
            className="input-standard"
            placeholder="邮箱"
            type="email"
          />
        </div>
      </div>

      {/* 文件上传 */}
      <div className="card-standard mb-6">
        <h3 className="text-lg font-medium text-[#1E293B] mb-4">上传论文文件</h3>
        <div
          className="border-2 border-dashed border-[#E2E8F0] rounded-xl p-8 text-center hover:border-[#00629B]/40 transition-colors cursor-pointer"
          onClick={() => document.getElementById('file-input')?.click()}
        >
          <Upload className="w-8 h-8 text-[#64748B] mx-auto mb-2" />
          <p className="text-sm text-[#64748B]">
            {file ? file.name : '点击或拖拽上传 PDF 文件'}
          </p>
          {file && <p className="text-xs text-[#64748B] mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>}
          <input
            id="file-input"
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) setFile(f)
            }}
          />
        </div>
      </div>

      {/* 底部操作 */}
      <div className="flex items-center gap-3 justify-end">
        <button onClick={handleSaveDraft} disabled={isLoading} className="btn-accent-outline">
          保存草稿
        </button>
        <button onClick={handleSubmit} disabled={isLoading} className="btn-accent">
          <Send className="w-4 h-4 mr-1.5" />
          {isLoading ? '提交中...' : '提交评审'}
        </button>
      </div>
    </div>
  )
}
