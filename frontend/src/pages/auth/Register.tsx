import { Card, Form, Input, Button, Typography, Result, App } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useState } from 'react'
import { authApi } from '@/api/auth'

const schema = z.object({
  email: z.string().email('请输入有效邮箱'),
  password: z.string().min(6, '密码至少 6 位'),
  full_name: z.string().min(1, '请输入姓名'),
  institution: z.string().optional(),
})
type RegisterForm = z.infer<typeof schema>

export default function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { message } = App.useApp()
  const [done, setDone] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<RegisterForm>({
    resolver: zodResolver(schema),
    defaultValues: { email: '', password: '', full_name: '', institution: '' },
  })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterForm) => authApi.register(data),
    onSuccess: () => setDone(true),
    onError: (err: { response?: { data?: { detail?: string } } }) => {
      message.error(err?.response?.data?.detail || t('common.operation_failed'))
    },
  })

  if (done) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Result
          status="success"
          title="注册成功！"
          subTitle="验证邮件已发送到您的邮箱，请点击邮件中的链接激活账户后再登录。"
          extra={[
            <Button type="primary" key="login" onClick={() => navigate('/login')}>
              前往登录
            </Button>,
          ]}
        />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card
        style={{ width: 420 }}
        title={<Typography.Title level={3} style={{ margin: 0 }}>{t('auth.register_title')}</Typography.Title>}
      >
        <Form layout="vertical" onFinish={handleSubmit((d) => registerMutation.mutate(d))}>
          <Form.Item label={t('auth.email')} validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
            <Controller control={control} name="email" render={({ field }) => <Input {...field} placeholder="you@example.com" />} />
          </Form.Item>
          <Form.Item label={t('auth.password')} validateStatus={errors.password ? 'error' : ''} help={errors.password?.message}>
            <Controller control={control} name="password" render={({ field }) => <Input.Password {...field} />} />
          </Form.Item>
          <Form.Item label={t('auth.full_name')} validateStatus={errors.full_name ? 'error' : ''} help={errors.full_name?.message}>
            <Controller control={control} name="full_name" render={({ field }) => <Input {...field} />} />
          </Form.Item>
          <Form.Item label={t('auth.institution')} validateStatus={errors.institution ? 'error' : ''} help={errors.institution?.message}>
            <Controller control={control} name="institution" render={({ field }) => <Input {...field} />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={registerMutation.isPending}>
              {t('auth.register_btn')}
            </Button>
          </Form.Item>
        </Form>
        <Typography.Text type="secondary">
          {t('auth.has_account')}{' '}
          <Link to="/login">{t('auth.go_login')}</Link>
        </Typography.Text>
      </Card>
    </div>
  )
}
