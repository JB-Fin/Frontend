// 로그인 페이지 구현
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi } from '../services/authApi'
import { useAuth } from '../hooks/useAuth'
import '../styles/auth.css'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [id, setId] = useState('')
  const [pw, setPw] = useState('')
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!id.trim() || !pw.trim()) { setError('아이디와 비밀번호를 입력해주세요.'); return }
    const { token } = await authApi.login(id, pw)
    login(token)
    navigate('/home')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="login-logo__icon">JB</div>
          <span className="login-logo__text">준또배기</span>
        </div>
        <p className="login-subtitle">규정 기반 AI 컴플라이언스 어시스턴트</p>
        <label className="login-label">아이디</label>
        <input className="login-input" value={id} onChange={e => setId(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="사번 또는 아이디" />
        <label className="login-label">비밀번호</label>
        <input className="login-input" type="password" value={pw} onChange={e => setPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLogin()} placeholder="비밀번호" />
        {error && <div className="login-error">{error}</div>}
        <button className="login-btn" onClick={handleLogin}>로그인</button>
        <p className="login-footer">임직원 전용 시스템입니다.<br />계정 문의: 정보보안팀 내선 1234</p>
      </div>
    </div>
  )
}