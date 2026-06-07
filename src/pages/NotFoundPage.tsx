// 404 screen: 존재하지 않는 경로로 접근 시 경고 화면 구현
import { useNavigate } from 'react-router-dom'

export default function NotFoundPage() {
  const navigate = useNavigate()
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--page-bg)' }}>
      <div style={{ fontSize: 64, marginBottom: 16 }}>🔍</div>
      <h2 style={{ fontSize: 22, fontWeight: 700, color: 'var(--navy)', marginBottom: 8 }}>페이지를 찾을 수 없습니다</h2>
      <p style={{ fontSize: 14, color: 'var(--text-muted)', marginBottom: 28 }}>요청하신 주소가 존재하지 않습니다.</p>
      <button
        onClick={() => navigate('/home')}
        style={{ padding: '11px 28px', background: 'var(--navy)', color: 'var(--white)', border: 'none', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
      >
        홈으로 돌아가기
      </button>
    </div>
  )
}
