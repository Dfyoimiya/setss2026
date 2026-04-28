import { Link } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface PageHeaderProps {
  title: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
}

export default function PageHeader({ title, breadcrumbs, actions }: PageHeaderProps) {
  const defaultBreadcrumbs: BreadcrumbItem[] = [
    { label: '首页', href: '/' },
    { label: title },
  ]

  const crumbs = breadcrumbs || defaultBreadcrumbs

  return (
    <div className="mb-6">
      <nav className="flex items-center gap-1.5 text-sm text-[#64748B] mb-3">
        {crumbs.map((item, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight className="w-3.5 h-3.5" />}
            {item.href ? (
              <Link to={item.href} className="hover:text-[#00629B] transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-[#1E293B] font-medium">{item.label}</span>
            )}
          </span>
        ))}
      </nav>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-[#1E293B]">{title}</h1>
        {actions && <div className="flex items-center gap-3">{actions}</div>}
      </div>
    </div>
  )
}
