// 인증 훅: 로그인 상태, 사용자 정보, 로그아웃 기능 관리
import { useState } from 'react'

// 로그인 상태를 관리하는 커스텀 훅
// 나중에 실제 토큰 검사 로직으로 교체하면 됩니다
export function useAuth() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => !!sessionStorage.getItem('jb_token')
  )

  const login = (token) => {
    sessionStorage.setItem('jb_token', token)
    setIsLoggedIn(true)
  }

  const logout = () => {
    sessionStorage.removeItem('jb_token')
    setIsLoggedIn(false)
  }

  return { isLoggedIn, login, logout }
}
