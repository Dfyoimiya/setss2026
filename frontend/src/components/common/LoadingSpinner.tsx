import { Spin } from 'antd'

export default function LoadingSpinner() {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 64 }}>
      <Spin size="large" />
    </div>
  )
}
