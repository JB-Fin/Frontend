// 질문 화면 구현: FAQ
import ChatBox from '../components/chat/ChatBox'
import '../styles/chat.css'

// 사이드바 "질문" 탭 — 채팅 전용 전체 화면
export default function QuestionPage() {
  return (
    <div className="question-page" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: 'var(--navy)', marginBottom: 4 }}>AI에게 질문하기</h2>
      <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
        내부 규정, 외부 법령, 준법 판단 등 무엇이든 물어보세요.
      </p>
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <ChatBox />
      </div>
    </div>
  )
}
