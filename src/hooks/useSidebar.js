// 사이드바 훅: 사이드바와 메뉴 선택 관리
import { useState } from 'react'

export function useSidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const toggle = () => setIsOpen(v => !v)
  return { isOpen, toggle }
}
