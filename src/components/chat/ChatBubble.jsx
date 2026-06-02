// 채팅 말풍선을 보여주는 컴포넌트
import '../../styles/home.css'

export default function ChatBubble({ message: { role, text, time } }) {
  return (
    <div className={`chat-row${role === 'user' ? ' chat-row--user' : ''}`}>
      {role === 'assistant' && <div className="chat-avatar">JB</div>}
      <div>
        <div className={`chat-bubble${role === 'user' ? ' chat-bubble--user' : ''}`}>{text}</div>
        <div className={`chat-time${role === 'user' ? ' chat-time--user' : ''}`}>{time}</div>
      </div>
    </div>
  )
}
