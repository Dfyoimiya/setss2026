import { Card, Form, Input, Button, Typography, App } from 'antd'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authApi } from '@/api/auth'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  full_name: z.string().min(1),
  institution: z.string().optional(),
})
type RegisterForm = z.infer<typeof schema>

export default function Register() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { message } = App.useApp()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({ resolver: zodResolver(schema) })

  const registerMutation = useMutation({
    mutationFn: (data: RegisterForm) => authApi.register(data),
    onSuccess: () => {
      message.success(t('auth.register_success'))
      navigate('/login')
    },
    onError: () => {
      message.error(t('common.operation_failed'))
    },
  })

  const onSubmit = (data: RegisterForm) => registerMutation.mutate(data)

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card style={{ width: 420 }} title={<Typography.Title level={3} style={{ margin: 0 }}>{t('auth.register_title')}</Typography.Title>}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label={t('auth.email')}
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Input {...register('email')} placeholder="you@example.com" />
          </Form.Item>
          <Form.Item
            label={t('auth.password')}
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Input.Password {...register('password')} />
          </Form.Item>
          <Form.Item
            label={t('auth.full_name')}
            validateStatus={errors.full_name ? 'error' : ''}
            help={errors.full_name?.message}
          >
            <Input {...register('full_name')} />
          </Form.Item>
          <Form.Item label={t('auth.institution')}>
            <Input {...register('institution')} />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={registerMutation.isPending}
            >
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
