// 보호 라우트: 로그인 여부에 따라 접근 가능한 페이지 제한
import { Navigate } from 'react-router-dom'
export default function ProtectedRoute({ children }) {
  const token = sessionStorage.getItem('jb_token')
  if (!token) return <Navigate to="/login" replace />
  return children
}
