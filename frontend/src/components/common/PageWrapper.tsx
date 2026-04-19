import { Typography, Space } from 'antd'
import type { ReactNode } from 'react'

interface PageWrapperProps {
  title?: string
  extra?: ReactNode
  children: ReactNode
}

export default function PageWrapper({ title, extra, children }: PageWrapperProps) {
  return (
    <div>
      {(title || extra) && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: 24,
          }}
        >
          {title && <Typography.Title level={3} style={{ margin: 0 }}>{title}</Typography.Title>}
          {extra && <Space>{extra}</Space>}
        </div>
      )}
      {children}
    </div>
  )
}
