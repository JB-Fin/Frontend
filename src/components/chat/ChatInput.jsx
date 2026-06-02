// 채팅 입력창 컴포넌트
import '../../styles/home.css'

export default function ChatInput({ value, onChange, onSend }) {
  return (
    <div className="chat-input-bar">
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSend()}
        placeholder="메시지를 입력하세요..."
      />
      <button className="chat-send-btn" onClick={onSend} disabled={!value.trim()}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  )
}
