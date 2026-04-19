import { useState } from 'react'

export function usePagination(defaultSize = 10) {
  const [page, setPage] = useState(1)
  const [size] = useState(defaultSize)

  const onChange = (p: number) => setPage(p)

  const reset = () => setPage(1)

  return { page, size, onChange, reset }
}
