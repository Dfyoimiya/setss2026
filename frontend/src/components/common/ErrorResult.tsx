import { Result, Button } from 'antd'
import { useTranslation } from 'react-i18next'

interface ErrorResultProps {
  message?: string
  onRetry?: () => void
}

export default function ErrorResult({ message, onRetry }: ErrorResultProps) {
  const { t } = useTranslation()
  return (
    <Result
      status="error"
      title={message || t('common.operation_failed')}
      extra={
        onRetry ? (
          <Button type="primary" onClick={onRetry}>
            {t('common.submit')}
          </Button>
        ) : undefined
      }
    />
  )
}
