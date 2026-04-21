import { useEffect, useState } from 'react'
import { Result, Button, Spin } from 'antd'
import { useSearchParams, Link } from 'react-router-dom'
import { authApi } from '@/api/auth'

export default function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const token = searchParams.get('token') ?? ''
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!token) { setStatus('error'); setMsg('验证链接无效'); return }
    authApi.verifyEmail(token)
      .then((d) => { setStatus('success'); setMsg(d.message) })
      .catch(() => { setStatus('error'); setMsg('验证链接无效或已过期') })
  }, [token])

  if (status === 'loading') {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Spin size="large" tip="正在验证邮箱…" />
      </div>
    )
  }

  return (
    <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Result
        status={status === 'success' ? 'success' : 'error'}
        title={status === 'success' ? '邮箱验证成功' : '验证失败'}
        subTitle={msg}
        extra={
          <Link to="/login">
            <Button type="primary">{status === 'success' ? '立即登录' : '返回登录'}</Button>
          </Link>
        }
      />
    </div>
  )
}
