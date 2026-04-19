import { Card, Form, Input, Button, Row, Col, App, Spin } from 'antd'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useEffect } from 'react'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'
import PageWrapper from '@/components/common/PageWrapper'

// 编辑个人信息表单
const profileSchema = z.object({
  full_name: z.string().min(1),
  institution: z.string().optional(),
  phone: z.string().optional(),
})
type ProfileForm = z.infer<typeof profileSchema>

// 修改密码表单
const passwordSchema = z
  .object({
    old_password: z.string().min(1),
    new_password: z.string().min(6),
    confirm: z.string(),
  })
  .refine((d) => d.new_password === d.confirm, {
    message: '两次密码不一致',
    path: ['confirm'],
  })
type PasswordForm = z.infer<typeof passwordSchema>

export default function ProfilePage() {
  const { t } = useTranslation()
  const { message } = App.useApp()
  const queryClient = useQueryClient()
  const { updateUser } = useAuthStore()

  const { data: me, isLoading } = useQuery({
    queryKey: ['me'],
    queryFn: authApi.getMe,
  })

  // Profile form
  const {
    register: regProfile,
    handleSubmit: handleProfile,
    reset: resetProfile,
    formState: { errors: profileErrors },
  } = useForm<ProfileForm>({ resolver: zodResolver(profileSchema) })

  useEffect(() => {
    if (me) {
      resetProfile({
        full_name: me.full_name || '',
        institution: me.institution || '',
        phone: me.phone || '',
      })
    }
  }, [me, resetProfile])

  const updateMutation = useMutation({
    mutationFn: (data: ProfileForm) => authApi.updateMe(data),
    onSuccess: (updated) => {
      updateUser(updated)
      queryClient.invalidateQueries({ queryKey: ['me'] })
      message.success(t('common.operation_success'))
    },
    onError: () => message.error(t('common.operation_failed')),
  })

  // Password form
  const {
    register: regPassword,
    handleSubmit: handlePassword,
    reset: resetPassword,
    formState: { errors: passwordErrors },
  } = useForm<PasswordForm>({ resolver: zodResolver(passwordSchema) })

  const passwordMutation = useMutation({
    mutationFn: (data: PasswordForm) =>
      authApi.changePassword(data.old_password, data.new_password),
    onSuccess: () => {
      message.success(t('common.operation_success'))
      resetPassword()
    },
    onError: () => message.error(t('common.operation_failed')),
  })

  if (isLoading) return <Spin size="large" style={{ display: 'block', margin: '64px auto' }} />

  return (
    <PageWrapper title={t('profile.title')}>
      <Row gutter={24}>
        {/* 编辑信息 */}
        <Col xs={24} md={12}>
          <Card title={t('profile.edit')}>
            <Form layout="vertical" onFinish={handleProfile((d) => updateMutation.mutate(d))}>
              <Form.Item
                label={t('auth.full_name')}
                validateStatus={profileErrors.full_name ? 'error' : ''}
                help={profileErrors.full_name?.message}
              >
                <Input {...regProfile('full_name')} />
              </Form.Item>
              <Form.Item label={t('auth.institution')}>
                <Input {...regProfile('institution')} />
              </Form.Item>
              <Form.Item label="电话">
                <Input {...regProfile('phone')} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
                  {t('profile.save')}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>

        {/* 修改密码 */}
        <Col xs={24} md={12}>
          <Card title={t('profile.change_password')}>
            <Form layout="vertical" onFinish={handlePassword((d) => passwordMutation.mutate(d))}>
              <Form.Item
                label={t('profile.old_password')}
                validateStatus={passwordErrors.old_password ? 'error' : ''}
                help={passwordErrors.old_password?.message}
              >
                <Input.Password {...regPassword('old_password')} />
              </Form.Item>
              <Form.Item
                label={t('profile.new_password')}
                validateStatus={passwordErrors.new_password ? 'error' : ''}
                help={passwordErrors.new_password?.message}
              >
                <Input.Password {...regPassword('new_password')} />
              </Form.Item>
              <Form.Item
                label="确认新密码"
                validateStatus={passwordErrors.confirm ? 'error' : ''}
                help={passwordErrors.confirm?.message}
              >
                <Input.Password {...regPassword('confirm')} />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={passwordMutation.isPending}>
                  {t('profile.save')}
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>
    </PageWrapper>
  )
}
