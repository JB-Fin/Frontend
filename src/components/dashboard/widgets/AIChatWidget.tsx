import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Bot, Send, User } from 'lucide-react'
import { useChatStore } from '../../../store/chatStore'

function now() {
  return new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function AIChatWidget() {
  const navigate = useNavigate()
  const messages = useChatStore((s) => s.messages)
  const addMessage = useChatStore((s) => s.addMessage)

  const [input, setInput] = useState('')
  const bottomRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSend = (textOverride?: string) => {
    const messageText = (textOverride ?? input).trim()
    if (!messageText) return

    addMessage({
      id: Date.now(),
      type: 'user',
      text: messageText,
      timestamp: now(),
    })

    setInput('')

    setTimeout(() => {
      addMessage({
        id: Date.now() + 1,
        type: 'ai',
        text: '해당 내용에 대해 검토 중입니다. 잠시만 기다려주세요.',
        timestamp: now(),
      })
    }, 800)
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="mb-4 min-h-0 flex-1 space-y-4 overflow-y-auto pr-2">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div
              className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${
                message.type === 'ai'
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
                  : 'bg-gradient-to-br from-gray-600 to-gray-700'
              }`}
            >
              {message.type === 'ai' ? (
                <Bot className="h-4 w-4 text-white" />
              ) : (
                <User className="h-4 w-4 text-white" />
              )}
            </div>

            <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
              <div
                className={`inline-block rounded-lg px-4 py-2 ${
                  message.type === 'ai'
                    ? 'border border-gray-200/50 bg-white/90 text-gray-800'
                    : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                }`}
              >
                <p className="whitespace-pre-wrap text-sm">{message.text}</p>
              </div>
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          placeholder="질문을 입력하세요..."
          className="flex-1 rounded-lg border border-gray-200/50 bg-white/90 px-4 py-2 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        />

        <button
          type="button"
          onClick={() => handleSend()}
          className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-4 py-2 text-white transition-all hover:shadow-lg"
        >
          <Send className="h-4 w-4" />
        </button>
      </div>

      <button
        onClick={() => navigate('/question')}
        className="mt-3 w-full py-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
      >
        전체 채팅 열기 →
      </button>
    </div>
  )
}
