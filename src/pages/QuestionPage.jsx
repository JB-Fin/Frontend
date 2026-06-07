import { useState, useRef } from 'react'
import '../styles/pages.css'
import '../styles/home.css'

const SUGGESTIONS = [
  '최근 금융소비자보호법 개정 내용은?',
  '신규 대출 상품 출시 전 컴플라이언스 체크리스트',
  'AML 정기 점검 필수 항목',
  '내부통제 시스템 운영 가이드라인',
]

function now() {
  return new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

function makeInitMessages() {
  return [
    {
      id: Date.now(),
      type: 'ai',
      text: '안녕하세요. JB금융그룹 컴플라이언스 AI 어시스턴트입니다. 규정, 법령, 내부 정책에 대해 무엇이든 물어보세요.',
      timestamp: now(),
    },
  ]
}

function deriveTitle(messages) {
  const first = messages.find(m => m.type === 'user')
  if (!first) return '새 대화'
  return first.text.length > 16 ? first.text.slice(0, 15) + '…' : first.text
}

export default function QuestionPage() {
  const sessionIdRef = useRef(2)

  const [sessions, setSessions] = useState(() => ([
    {
      id: 1,
      messages: makeInitMessages(),
      pinned: false,
      createdAt: now(),
      title: '새 대화',
    },
  ]))
  const [activeId, setActiveId] = useState(1)
  const [input, setInput] = useState('')

  const activeSession = sessions.find(s => s.id === activeId)
  const messages = activeSession?.messages ?? []

  const updateSession = (id, fn) =>
    setSessions(prev => prev.map(s => s.id === id ? { ...s, ...fn(s) } : s))

  const send = (text = input) => {
    const trimmed = text.trim()
    if (!trimmed) return
    const userMsg = { id: Date.now(), type: 'user', text: trimmed, timestamp: now() }
    updateSession(activeId, s => ({
      messages: [...s.messages, userMsg],
      title: deriveTitle([...s.messages, userMsg]),
    }))
    setInput('')
    window.setTimeout(() => {
      const aiMsg = {
        id: Date.now() + 1,
        type: 'ai',
        text: '관련 규정과 내부 문서를 확인하고 있습니다. 현재 기준으로는 고객 고지, 적합성 원칙, 불완전판매 방지 조치를 우선 확인하는 것이 좋습니다.',
        timestamp: now(),
      }
      updateSession(activeId, s => ({ messages: [...s.messages, aiMsg] }))
    }, 700)
  }

  const newSession = () => {
    const id = sessionIdRef.current++
    const s = {
      id,
      messages: makeInitMessages(),
      pinned: false,
      createdAt: now(),
      title: '새 대화',
    }
    setSessions(prev => [s, ...prev])
    setActiveId(id)
    setInput('')
  }

  const togglePin = (id, e) => {
    e.stopPropagation()
    updateSession(id, s => ({ pinned: !s.pinned }))
  }

  const pinnedSessions = sessions.filter(s => s.pinned)
  const recentSessions = sessions.filter(s => !s.pinned)

  return (
    <main className="workspace-page chat-workspace">

      {/* ── 채팅 본문 ── */}
      <section className="glass-card chat-page-card">
        <header className="chat-page-head">
          <div className="chat-avatar">AI</div>
          <div>
            <h2>AI 어시스턴트</h2>
            <p>컴플라이언스 전문 AI</p>
          </div>
        </header>

        <div className="chat-page-messages">
          {messages.map(msg => (
            <div key={msg.id} className={`chat-row${msg.type === 'user' ? ' chat-row--user' : ''}`}>
              <div className="chat-avatar">{msg.type === 'ai' ? 'AI' : '김'}</div>
              <div>
                <div className={`chat-bubble${msg.type === 'user' ? ' chat-bubble--user' : ''}`}>
                  {msg.text}
                </div>
                <div className={`chat-time${msg.type === 'user' ? ' chat-time--user' : ''}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          ))}
        </div>

        {messages.length === 1 && (
          <div className="chat-page-suggestions">
            <strong>추천 질문</strong>
            <div>
              {SUGGESTIONS.map(q => (
                <button
                  key={q}
                  type="button"
                  className="suggestion-chip"
                  onClick={() => send(q)}
                >
                  {q}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="chat-input-bar chat-page-input">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            placeholder="컴플라이언스 관련 질문을 입력하세요..."
          />
          <button
            type="button"
            className="chat-send-btn"
            onClick={() => send()}
            disabled={!input.trim()}
            aria-label="전송"
          >
            ➤
          </button>
        </div>
      </section>

      {/* ── 사이드바: 대화 목록 ── */}
      <aside className="chat-side">
        <section className="glass-card chat-history-panel">

          <div className="chat-history-header">
            <h3>대화 목록</h3>
            <button type="button" className="new-chat-btn" onClick={newSession}>
              ＋ 새 대화
            </button>
          </div>

          {/* ── 고정된 대화 ── */}
          <div className="chat-section">
            <p className="chat-list-label">📌 고정된 대화</p>
            {pinnedSessions.length === 0 ? (
              <p className="chat-list-empty">고정된 대화가 없습니다</p>
            ) : (
              <ul className="chat-session-list">
                {pinnedSessions.map(s => (
                  <SessionItem
                    key={s.id}
                    session={s}
                    isActive={s.id === activeId}
                    onSelect={() => setActiveId(s.id)}
                    onTogglePin={togglePin}
                  />
                ))}
              </ul>
            )}
          </div>

          <div className="chat-divider" />

          {/* ── 대화 이력 ── */}
          <div className="chat-section chat-section--scroll">
            <p className="chat-list-label">🕐 대화 이력</p>
            {recentSessions.length === 0 ? (
              <p className="chat-list-empty">대화 이력이 없습니다</p>
            ) : (
              <ul className="chat-session-list">
                {recentSessions.map(s => (
                  <SessionItem
                    key={s.id}
                    session={s}
                    isActive={s.id === activeId}
                    onSelect={() => setActiveId(s.id)}
                    onTogglePin={togglePin}
                  />
                ))}
              </ul>
            )}
          </div>

        </section>
      </aside>
    </main>
  )
}

function SessionItem({ session, isActive, onSelect, onTogglePin }) {
  return (
    <li
      className={`chat-session-item${isActive ? ' chat-session-item--active' : ''}`}
      onClick={onSelect}
    >
      <div className="chat-session-info">
        <span className="chat-session-title">{session.title}</span>
        <span className="chat-session-time">{session.createdAt}</span>
      </div>
      <button
        type="button"
        className={`pin-btn${session.pinned ? ' pin-btn--active' : ''}`}
        onClick={e => onTogglePin(session.id, e)}
        title={session.pinned ? '핀 해제' : '핀 고정'}
      >
        📌
      </button>
    </li>
  )
}