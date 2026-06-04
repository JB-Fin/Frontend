// 채팅 박스 컴포넌트 생성
import { useState, useRef, useEffect } from 'react'
import ChatBubble from './ChatBubble'
import ChatInput from './ChatInput'
import SuggestionChips from './SuggestionChips'
import { chatApi } from '../../services/chatApi'
import '../../styles/home.css'

const INITIAL = [
  { id: 1, role: 'assistant', text: '안녕하세요! 컴플라이언스 관련 질문을 도와드리겠습니다. 내부 규정, 외부 법령, 문서 검토를 무엇이든 물어보세요.', time: '오후 05:00' },
]
const SUGGESTIONS = [
  '광고 문구의 준법 리스크를 검토해줘',
  '금융상품 설명서에서 수정이 필요한 부분을 찾아줘',
  '최근 내부 규정 기준으로 확인해줘',
]

export default function ChatBox() {
  const [messages, setMessages] = useState(INITIAL)
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [messages])

  const sendMessage = (text) => {
    const messageText = String(text ?? '').trim()
    if (!messageText) return
    const now = new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text: messageText, time: now }])
    setInput('')
    chatApi
      .send(messageText)
      .then(({ reply }) => {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: reply, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }])
      })
      .catch(() => {
        setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', text: '응답을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.', time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }])
      })
  }

  const handleInputSend = () => sendMessage(input)
  const handleSuggestionSend = (suggestion) => sendMessage(suggestion)

  return (
  <div className="chat-panel" style={{ height: '100%' }}>  {/* ← 추가 */}
    <h2 className="chat-panel__heading">규정 기반 AI 어시스턴트</h2>
    <p className="chat-panel__sub">내부 규정과 외부 법령을 기반으로 문서 준법성을 빠르게 확인하세요.</p>
    <div className="chat-messages">
      {messages.map(m => <ChatBubble key={m.id} message={m} />)}
      <div ref={bottomRef} />
    </div>
    <SuggestionChips suggestions={SUGGESTIONS} onSelect={handleSuggestionSend} />
    <ChatInput value={input} onChange={setInput} onSend={handleInputSend} />
  </div>
)
}
