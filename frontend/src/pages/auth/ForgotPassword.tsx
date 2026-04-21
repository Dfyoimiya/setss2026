import { useState } from 'react'
import { Card, Form, Input, Button, Typography, Result, App } from 'antd'
import { useForm, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useMutation } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { authApi } from '@/api/auth'

const schema = z.object({ email: z.string().email('请输入有效邮箱') })
type Form = z.infer<typeof schema>

export default function ForgotPassword() {
  const { message } = App.useApp()
  const [done, setDone] = useState(false)

  const { control, handleSubmit, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { email: '' },
  })

  const mutation = useMutation({
    mutationFn: (d: Form) => authApi.forgotPassword(d.email),
    onSuccess: () => setDone(true),
    onError: () => message.error('请求失败，请稍后重试'),
  })

  if (done) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Result
          status="success"
          title="邮件已发送"
          subTitle="如果该邮箱已注册，您将收到密码重置邮件，请在 1 小时内完成重置。"
          extra={<Link to="/login"><Button type="primary">返回登录</Button></Link>}
        />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card style={{ width: 400 }} title={<Typography.Title level={3} style={{ margin: 0 }}>找回密码</Typography.Title>}>
        <Typography.Paragraph type="secondary" style={{ marginBottom: 20 }}>
          输入注册邮箱，我们将发送密码重置链接。
        </Typography.Paragraph>
        <Form layout="vertical" onFinish={handleSubmit((d) => mutation.mutate(d))}>
          <Form.Item label="邮箱" validateStatus={errors.email ? 'error' : ''} help={errors.email?.message}>
            <Controller control={control} name="email" render={({ field }) => <Input {...field} placeholder="you@example.com" />} />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={mutation.isPending}>
              发送重置邮件
            </Button>
          </Form.Item>
        </Form>
        <Typography.Text type="secondary">
          想起密码了？ <Link to="/login">返回登录</Link>
        </Typography.Text>
      </Card>
    </div>
  )
}
