import { useState } from 'react'
import '../styles/pages.css'
import '../styles/home.css'

const SUGGESTIONS = [
  '최근 금융소비자보호법 개정 내용은?',
  '신규 대출 상품 출시 전 컴플라이언스 체크리스트',
  'AML 정기 점검 필수 항목',
  '내부통제 시스템 운영 가이드라인',
]

export default function QuestionPage() {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'ai',
      text: '안녕하세요. JB금융그룹 컴플라이언스 AI 어시스턴트입니다. 규정, 법령, 내부 정책에 대해 무엇이든 물어보세요.',
      timestamp: '14:30',
    },
  ])
  const [input, setInput] = useState('')

  const send = () => {
    const text = input.trim()
    if (!text) return
    setMessages(prev => [...prev, { id: Date.now(), type: 'user', text, timestamp: now() }])
    setInput('')
    window.setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: Date.now() + 1,
          type: 'ai',
          text: '관련 규정과 내부 문서를 확인하고 있습니다. 현재 기준으로는 고객 고지, 적합성 원칙, 불완전판매 방지 조치를 우선 확인하는 것이 좋습니다.',
          timestamp: now(),
        },
      ])
    }, 700)
  }

  return (
    <main className="workspace-page chat-workspace">
      <section className="glass-card chat-page-card">
        <header className="chat-page-head">
          <div className="chat-avatar">AI</div>
          <div>
            <h2>AI 어시스턴트</h2>
            <p>컴플라이언스 전문 AI</p>
          </div>
        </header>

        <div className="chat-page-messages">
          {messages.map(message => (
            <div key={message.id} className={`chat-row${message.type === 'user' ? ' chat-row--user' : ''}`}>
              <div className="chat-avatar">{message.type === 'ai' ? 'AI' : '김'}</div>
              <div>
                <div className={`chat-bubble${message.type === 'user' ? ' chat-bubble--user' : ''}`}>{message.text}</div>
                <div className={`chat-time${message.type === 'user' ? ' chat-time--user' : ''}`}>{message.timestamp}</div>
              </div>
            </div>
          ))}
        </div>

        {messages.length === 1 && (
          <div className="chat-page-suggestions">
            <strong>추천 질문</strong>
            <div>
              {SUGGESTIONS.map(question => (
                <button key={question} type="button" className="suggestion-chip" onClick={() => setInput(question)}>
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="chat-input-bar chat-page-input">
          <input value={input} onChange={event => setInput(event.target.value)} onKeyDown={event => event.key === 'Enter' && send()} placeholder="컴플라이언스 관련 질문을 입력하세요..." />
          <button type="button" className="chat-send-btn" onClick={send} disabled={!input.trim()} aria-label="전송">➤</button>
        </div>
      </section>

      <aside className="page-stack chat-side">
        <section className="glass-card panel-pad">
          <h3>오늘의 활동</h3>
          <div className="item-list">
            <Info label="총 질문 수" value="24" />
            <Info label="평균 응답 시간" value="1.2초" />
            <Info label="만족도" value="95%" />
          </div>
        </section>
        <section className="glass-card panel-pad">
          <h3>자주 묻는 주제</h3>
          {['AML 규정', 'KYC 절차', '내부통제'].map((topic, index) => (
            <div className="calendar-event" key={topic}>
              <h4>{topic}</h4>
              <p>{[12, 8, 6][index]}회</p>
            </div>
          ))}
        </section>
      </aside>
    </main>
  )
}

function Info({ label, value }) {
  return (
    <div className="toolbar-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  )
}

function now() {
  return new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}
