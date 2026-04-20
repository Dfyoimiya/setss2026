import { Card, Form, Input, Button, Typography, App } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { authApi } from '@/api/auth'
import { useAuthStore } from '@/store/authStore'

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})
type LoginForm = z.infer<typeof schema>

export default function Login() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { login } = useAuthStore()
  const { message } = App.useApp()

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const tokenData = await authApi.login(data.email, data.password)
      // 先临时写入 token，让 getMe 请求能携带它
      useAuthStore.getState().login(tokenData.access_token, null as never)
      const user = await authApi.getMe()
      return { token: tokenData.access_token, user }
    },
    onSuccess: ({ token, user }) => {
      login(token, user)
      message.success(t('auth.login_success'))
      const redirect = searchParams.get('redirect') || '/'
      navigate(redirect, { replace: true })
    },
    onError: () => {
      message.error(t('common.operation_failed'))
    },
  })

  const onSubmit = (data: LoginForm) => loginMutation.mutate(data)

  return (
    <div
      style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card style={{ width: 400 }} title={<Typography.Title level={3} style={{ margin: 0 }}>{t('auth.login_title')}</Typography.Title>}>
        <Form layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Form.Item
            label={t('auth.email')}
            validateStatus={errors.email ? 'error' : ''}
            help={errors.email?.message}
          >
            <Controller
              control={control}
              name="email"
              render={({ field }) => (
                <Input {...field} placeholder="you@example.com" />
              )}
            />
          </Form.Item>
          <Form.Item
            label={t('auth.password')}
            validateStatus={errors.password ? 'error' : ''}
            help={errors.password?.message}
          >
            <Controller
              control={control}
              name="password"
              render={({ field }) => (
                <Input.Password {...field} />
              )}
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              loading={loginMutation.isPending}
            >
              {t('auth.login_btn')}
            </Button>
          </Form.Item>
        </Form>
        <Typography.Text type="secondary">
          {t('auth.no_account')}{' '}
          <Link to="/register">{t('auth.go_register')}</Link>
        </Typography.Text>
      </Card>
    </div>
  )
}
