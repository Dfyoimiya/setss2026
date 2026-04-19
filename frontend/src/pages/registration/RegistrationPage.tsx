import { Card, Descriptions, Tag, Form, Input, Select, Button, Result, App } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import type { AxiosError } from 'axios'
import { registrationApi } from '@/api/registrations'
import { REGISTRATION_TYPE_LABELS } from '@/types'
import LoadingSpinner from '@/components/common/LoadingSpinner'
import ErrorResult from '@/components/common/ErrorResult'
import PageWrapper from '@/components/common/PageWrapper'

const schema = z.object({
  registration_type: z.enum(['student', 'regular', 'speaker', 'virtual'] as const),
  institution: z.string().optional(),
  position: z.string().optional(),
  dietary_preference: z.string().optional(),
})
type RegForm = z.infer<typeof schema>

const STATUS_COLORS: Record<string, string> = {
  pending: 'orange',
  confirmed: 'success',
  cancelled: 'error',
}

export default function RegistrationPage() {
  const { t } = useTranslation()
  const queryClient = useQueryClient()
  const { message } = App.useApp()

  const { data: reg, isLoading, isError, error, refetch } = useQuery({
    queryKey: ['myRegistration'],
    queryFn: registrationApi.getMyRegistration,
    retry: false,
  })

  const notRegistered = isError && (error as AxiosError)?.response?.status === 404
  const otherError = isError && !notRegistered

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegForm>({ resolver: zodResolver(schema) })

  const registerMutation = useMutation({
    mutationFn: (data: RegForm) => registrationApi.register(data),
    onSuccess: (result) => {
      message.success(t('registration.submit_success') + result.confirmation_code)
      queryClient.invalidateQueries({ queryKey: ['myRegistration'] })
    },
    onError: () => message.error(t('common.operation_failed')),
  })

  if (isLoading) return <LoadingSpinner />
  if (otherError) return <ErrorResult onRetry={refetch} />

  // 已报名 — 展示详情
  if (reg) {
    return (
      <PageWrapper title={t('registration.title')}>
        <Result
          status="success"
          title={t('registration.already_registered')}
          subTitle={
            <>
              确认码：<strong>{reg.confirmation_code}</strong>
            </>
          }
        />
        <Card style={{ maxWidth: 600, margin: '0 auto' }}>
          <Descriptions bordered column={1}>
            <Descriptions.Item label={t('registration.confirmation_code')}>
              <strong>{reg.confirmation_code}</strong>
            </Descriptions.Item>
            <Descriptions.Item label={t('registration.type')}>
              {REGISTRATION_TYPE_LABELS[reg.registration_type] || reg.registration_type}
            </Descriptions.Item>
            <Descriptions.Item label={t('registration.institution')}>
              {reg.institution || '-'}
            </Descriptions.Item>
            <Descriptions.Item label={t('registration.position')}>
              {reg.position || '-'}
            </Descriptions.Item>
            <Descriptions.Item label={t('registration.dietary')}>
              {reg.dietary_preference || '-'}
            </Descriptions.Item>
            <Descriptions.Item label={t('registration.status')}>
              <Tag color={STATUS_COLORS[reg.status]}>
                {t(`registration.${reg.status}`) || reg.status}
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </PageWrapper>
    )
  }

  // 未报名 — 展示表单
  return (
    <PageWrapper title={t('registration.title')}>
      <Card style={{ maxWidth: 600, margin: '0 auto' }}>
        <Form layout="vertical" onFinish={handleSubmit((d) => registerMutation.mutate(d))}>
          <Form.Item
            label={t('registration.type')}
            validateStatus={errors.registration_type ? 'error' : ''}
            help={errors.registration_type?.message}
          >
            <Controller
              control={control}
              name="registration_type"
              render={({ field }) => (
                <Select
                  {...field}
                  placeholder="选择参会类型"
                  options={[
                    { value: 'student', label: t('registration.student') },
                    { value: 'regular', label: t('registration.regular') },
                    { value: 'speaker', label: t('registration.speaker') },
                    { value: 'virtual', label: t('registration.virtual') },
                  ]}
                />
              )}
            />
          </Form.Item>
          <Form.Item label={t('registration.institution')}>
            <Input {...register('institution')} />
          </Form.Item>
          <Form.Item label={t('registration.position')}>
            <Input {...register('position')} />
          </Form.Item>
          <Form.Item label={t('registration.dietary')}>
            <Input {...register('dietary_preference')} placeholder="如：素食、清真等" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" loading={registerMutation.isPending} block>
              {t('registration.submit_btn')}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </PageWrapper>
  )
}
