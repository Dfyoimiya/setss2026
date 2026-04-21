import { useState } from 'react'
import { Card, Form, Input, Button, Typography, Result, App } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link, useSearchParams } from 'react-router-dom'
import { authApi } from '@/api/auth'

const schema = z.object({
  new_password: z.string().min(6, '密码至少 6 位'),
  confirm: z.string(),
}).refine((d) => d.new_password === d.confirm, { message: '两次密码不一致', path: ['confirm'] })
type Form = z.infer<typeof schema>

export default function ResetPassword() {
  const { message } = App.useApp()
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [done, setDone] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { new_password: '', confirm: '' },
  })

  const mutation = useMutation({
    mutationFn: (d: Form) => authApi.resetPassword(token, d.new_password),
    onSuccess: () => setDone(true),
    onError: (err: { response?: { data?: { detail?: string } } }) => {
      message.error(err?.response?.data?.detail || '重置失败，链接可能已过期')
    },
  })

  if (!token) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Result status="error" title="无效的重置链接" extra={<Link to="/forgot-password"><Button type="primary">重新申请</Button></Link>} />
      </div>
    )
  }

  if (done) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Result status="success" title="密码重置成功" subTitle="请使用新密码登录。" extra={<Link to="/login"><Button type="primary">立即登录</Button></Link>} />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card style={{ width: 400 }} title={<Typography.Title level={3} style={{ margin: 0 }}>重置密码</Typography.Title>}>
        <Form layout="vertical" onFinish={handleSubmit((d) => mutation.mutate(d))}>
          <Form.Item label="新密码" validateStatus={errors.new_password ? 'error' : ''} help={errors.new_password?.message}>
            <Controller control={control} name="new_password" render={({ field }) => <Input.Password {...field} />} />
          </Form.Item>
          <Form.Item label="确认密码" validateStatus={errors.confirm ? 'error' : ''} help={errors.confirm?.message}>
            <Controller control={control} name="confirm" render={({ field }) => <Input.Password {...field} />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={mutation.isPending}>
              确认重置
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  )
}
