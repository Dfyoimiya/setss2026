import { useState } from 'react'
import {
  Steps,
  Form,
  Input,
  Select,
  Button,
  Space,
  Card,
  Upload,
  Table,
  Switch,
  App,
} from 'antd'
import { InboxOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { paperApi } from '@/api/papers'
import type { Paper } from '@/types'
import PageWrapper from '@/components/common/PageWrapper'
import type { ColumnsType } from 'antd/es/table'

const TOPICS = [
  'Software Engineering Methods & Practices',
  'Distributed Systems & Cloud Computing',
  'Artificial Intelligence & Machine Learning',
  'DevOps, CI/CD & Software Quality',
  'Formal Methods & Program Verification',
  'Human-Computer Interaction',
  'Software Security & Privacy',
  'Open Source Software & Ecosystems',
]

const step1Schema = z.object({
  title: z.string().min(5).max(200),
  abstract: z.string().min(50).max(3000),
  keywords: z.string().min(1),
  topic: z.string().min(1),
})
type Step1Form = z.infer<typeof step1Schema>

const coAuthorSchema = z.object({
  coAuthors: z.array(
    z.object({
      name: z.string().min(1),
      email: z.string().email(),
      institution: z.string().optional(),
      is_corresponding: z.boolean(),
    })
  ),
})
type Step2Form = z.infer<typeof coAuthorSchema>

export default function SubmitPaperPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { message } = App.useApp()

  const [currentStep, setCurrentStep] = useState(0)
  const [step1Data, setStep1Data] = useState<Step1Form | null>(null)
  const [step2Data, setStep2Data] = useState<Step2Form | null>(null)
  const [file, setFile] = useState<File | null>(null)

  // Step 1 form
  const {
    handleSubmit: handle1,
    control: ctrl1,
    formState: { errors: errors1 },
  } = useForm<Step1Form>({ resolver: zodResolver(step1Schema) })

  // Step 2 form
  const {
    handleSubmit: handle2,
    control: ctrl2,
    formState: { errors: errors2 },
  } = useForm<Step2Form>({
    resolver: zodResolver(coAuthorSchema),
    defaultValues: { coAuthors: [] },
  })

  const { fields, append, remove } = useFieldArray({ control: ctrl2, name: 'coAuthors' })

  const submitMutation = useMutation({
    mutationFn: (fd: FormData) => paperApi.submit(fd),
    onSuccess: (paper: Paper) => {
      message.success(t('submission.submit_success') + paper.submission_number)
      navigate('/submission')
    },
    onError: () => message.error(t('common.operation_failed')),
  })

  const onStep1Next = (data: Step1Form) => {
    setStep1Data(data)
    setCurrentStep(1)
  }

  const onStep2Next = (data: Step2Form) => {
    setStep2Data(data)
    setCurrentStep(2)
  }

  const onFinalSubmit = () => {
    if (!step1Data) return
    const fd = new FormData()
    fd.append('title', step1Data.title)
    fd.append('abstract', step1Data.abstract)
    fd.append('keywords', step1Data.keywords)
    fd.append('topic', step1Data.topic)
    if (step2Data?.coAuthors?.length) {
      fd.append('co_authors', JSON.stringify(step2Data.coAuthors))
    }
    if (file) fd.append('file', file)
    submitMutation.mutate(fd)
  }

  const coAuthorColumns: ColumnsType<(typeof fields)[number]> = [
    {
      title: '姓名 *',
      key: 'name',
      render: (_, __, idx) => (
        <Form.Item
          style={{ margin: 0 }}
          validateStatus={errors2.coAuthors?.[idx]?.name ? 'error' : ''}
        >
          <Controller
            control={ctrl2}
            name={`coAuthors.${idx}.name`}
            render={({ field }) => <Input {...field} placeholder="姓名" />}
          />
        </Form.Item>
      ),
    },
    {
      title: '邮箱 *',
      key: 'email',
      render: (_, __, idx) => (
        <Form.Item
          style={{ margin: 0 }}
          validateStatus={errors2.coAuthors?.[idx]?.email ? 'error' : ''}
        >
          <Controller
            control={ctrl2}
            name={`coAuthors.${idx}.email`}
            render={({ field }) => <Input {...field} placeholder="邮箱" />}
          />
        </Form.Item>
      ),
    },
    {
      title: '机构',
      key: 'institution',
      render: (_, __, idx) => (
        <Controller
          control={ctrl2}
          name={`coAuthors.${idx}.institution`}
          render={({ field }) => <Input {...field} placeholder="机构" />}
        />
      ),
    },
    {
      title: '通讯作者',
      key: 'is_corresponding',
      render: (_, __, idx) => (
        <Controller
          control={ctrl2}
          name={`coAuthors.${idx}.is_corresponding`}
          render={({ field }) => (
            <Switch checked={field.value} onChange={field.onChange} />
          )}
        />
      ),
    },
    {
      title: '',
      key: 'del',
      render: (_, __, idx) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => remove(idx)}
        />
      ),
    },
  ]

  return (
    <PageWrapper title={t('submission.submit')}>
      <Steps
        current={currentStep}
        style={{ marginBottom: 32 }}
        items={[
          { title: t('submission.step1') },
          { title: t('submission.step2') },
          { title: t('submission.step3') },
        ]}
      />

      {/* Step 1: 基本信息 */}
      {currentStep === 0 && (
        <Card>
          <Form layout="vertical" onFinish={handle1(onStep1Next)}>
            <Form.Item
              label={t('submission.paper_title')}
              validateStatus={errors1.title ? 'error' : ''}
              help={errors1.title?.message}
            >
              <Controller
                control={ctrl1}
                name="title"
                render={({ field }) => <Input {...field} />}
              />
            </Form.Item>
            <Form.Item
              label={t('submission.abstract')}
              validateStatus={errors1.abstract ? 'error' : ''}
              help={errors1.abstract?.message}
            >
              <Controller
                control={ctrl1}
                name="abstract"
                render={({ field }) => <Input.TextArea rows={6} {...field} />}
              />
            </Form.Item>
            <Form.Item
              label={t('submission.keywords')}
              validateStatus={errors1.keywords ? 'error' : ''}
              help={errors1.keywords?.message}
              extra="多个关键词用英文逗号分隔"
            >
              <Controller
                control={ctrl1}
                name="keywords"
                render={({ field }) => (
                  <Input {...field} placeholder="e.g., machine learning, software testing" />
                )}
              />
            </Form.Item>
            <Form.Item
              label={t('submission.topic')}
              validateStatus={errors1.topic ? 'error' : ''}
              help={errors1.topic?.message}
            >
              <Controller
                control={ctrl1}
                name="topic"
                render={({ field }) => (
                  <Select
                    {...field}
                    placeholder="选择研究主题"
                    options={TOPICS.map((t) => ({ value: t, label: t }))}
                  />
                )}
              />
            </Form.Item>
            <Form.Item>
              <Space>
                <Button onClick={() => navigate('/submission')}>{t('profile.cancel')}</Button>
                <Button type="primary" htmlType="submit">{t('submission.next')}</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      {/* Step 2: 合著者 */}
      {currentStep === 1 && (
        <Card>
          <Form layout="vertical" onFinish={handle2(onStep2Next)}>
            <Table
              dataSource={fields}
              columns={coAuthorColumns}
              rowKey="id"
              pagination={false}
              locale={{ emptyText: '暂无合著者（可选）' }}
              style={{ marginBottom: 16 }}
            />
            <Button
              icon={<PlusOutlined />}
              onClick={() =>
                append({ name: '', email: '', institution: '', is_corresponding: false })
              }
              disabled={fields.length >= 10}
              style={{ marginBottom: 24 }}
            >
              添加合著者
            </Button>
            <Form.Item>
              <Space>
                <Button onClick={() => setCurrentStep(0)}>{t('submission.prev')}</Button>
                <Button type="primary" htmlType="submit">{t('submission.next')}</Button>
              </Space>
            </Form.Item>
          </Form>
        </Card>
      )}

      {/* Step 3: 上传文件 */}
      {currentStep === 2 && (
        <Card>
          <Upload.Dragger
            beforeUpload={(f) => {
              if (f.type !== 'application/pdf') {
                message.error('仅支持 PDF 格式')
                return false
              }
              if (f.size > 20 * 1024 * 1024) {
                message.error('文件不超过 20MB')
                return false
              }
              setFile(f)
              return false
            }}
            fileList={file ? [{ uid: '-1', name: file.name, status: 'done' }] : []}
            onRemove={() => setFile(null)}
            accept=".pdf"
            maxCount={1}
            style={{ marginBottom: 24 }}
          >
            <p><InboxOutlined style={{ fontSize: 48, color: '#1677ff' }} /></p>
            <p style={{ fontSize: 16 }}>{t('submission.upload_hint')}</p>
          </Upload.Dragger>
          <Space>
            <Button onClick={() => setCurrentStep(1)}>{t('submission.prev')}</Button>
            <Button
              type="primary"
              loading={submitMutation.isPending}
              onClick={onFinalSubmit}
              disabled={!file}
            >
              {t('submission.submit_btn')}
            </Button>
          </Space>
        </Card>
      )}
    </PageWrapper>
  )
}
