import { Empty } from 'antd'
import { useTranslation } from 'react-i18next'

export default function EmptyResult() {
  const { t } = useTranslation()
  return <Empty description={t('common.no_data')} style={{ padding: 32 }} />
}
