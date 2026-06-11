import { useEffect, useMemo, useRef, useState } from 'react'
import { Bot, MessageSquare, Pin, Plus, Search, Send, User } from 'lucide-react'
import { chatApi } from '../services/chatApi'
import { useChatStore } from '../store/chatStore';

type ChatMessage = {
  id: number
  type: 'ai' | 'user'
  text: string
  timestamp: string
}

type ChatSession = {
  id: number
  title: string
  messages: ChatMessage[]
  pinned: boolean
  createdAt: string
  updatedAt: string
}

const suggestedQuestions = [
  '최근 금융소비자보호법 개정 내용은?',
  '신규 대출 상품 출시 전 컴플라이언스 체크리스트',
  'AML 정기 평가 필수 항목',
  '내부통제 시스템 운영 가이드라인',
]

function now() {
  return new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function createWelcomeMessage(): ChatMessage {
  return {
    id: Date.now(),
    type: 'ai',
    text: '안녕하세요. JB금융그룹 컴플라이언스 AI 어시스턴트입니다. 규정, 법령, 내부 정책에 대해 무엇이든 물어보세요.',
    timestamp: now(),
  }
}

function createSession(id: number): ChatSession {
  const createdAt = now()

  return {
    id,
    title: '새 대화',
    messages: [createWelcomeMessage()],
    pinned: false,
    createdAt,
    updatedAt: createdAt,
  }
}

function deriveTitle(messages: ChatMessage[]) {
  const firstUserMessage = messages.find((message) => message.type === 'user')

  if (!firstUserMessage) return '새 대화'

  return firstUserMessage.text.length > 24
    ? `${firstUserMessage.text.slice(0, 24)}...`
    : firstUserMessage.text
}

function getAiResponseText(response: any) {
  return (
    response?.answer ??
    response?.data?.answer ??
    response?.result?.answer ??
    response?.message?.content ??
    response?.data?.message?.content ??
    response?.content ??
    response?.reply ??
    '응답을 받았습니다.'
  )
}

function formatMessageForDisplay(message: ChatMessage) {
  if (message.type !== 'ai') return message.text

  return message.text
    .replace(/\r\n?/g, '\n')
    .replace(/[ \t]+/g, ' ')
    .replace(/([^\n])\s+(\d+\)\s*)/g, '$1\n\n$2')
    .replace(
      /\s+(설명해야 할 사항은|또한|다만|따라서|예를 들어|결론적으로|요약하면)\s+/g,
      '\n\n$1 '
    )
    .replace(/\n{3,}/g, '\n\n')
    .trim()
}

export function AIChatPage() {
  const nextSessionId = useRef(2)
  const bottomRef = useRef<HTMLDivElement | null>(null)

  const [sessions, setSessions] = useState<ChatSession[]>(() => [createSession(1)])
  const [activeSessionId, setActiveSessionId] = useState(1)
  const [input, setInput] = useState('')
  const [historySearch, setHistorySearch] = useState('')
  const [isSending, setIsSending] = useState(false)
  const activeSession = sessions.find((session) => session.id === activeSessionId) ?? sessions[0];

  const storeMessages = useChatStore((s) => s.messages);
  const addMessage = useChatStore((s) => s.addMessage);
  const setStoreMessages = useChatStore((s) => s.setMessages);

  const messages = storeMessages.length > 0 ? storeMessages : activeSession?.messages ?? [];


useEffect(() => {
  if (storeMessages.length === 0) return;

  setSessions((current) =>
    current.map((session) =>
      session.id === activeSessionId
        ? {
            ...session,
            messages: storeMessages,
            title: deriveTitle(storeMessages),
            updatedAt:
              storeMessages[storeMessages.length - 1]?.timestamp ??
              session.updatedAt,
          }
        : session
    )
  );
}, [activeSessionId, storeMessages, setSessions]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const updateSession = (
    sessionId: number,
    updater: (session: ChatSession) => Partial<ChatSession>
  ) => {
    setSessions((current) =>
      current.map((session) =>
        session.id === sessionId
          ? { ...session, ...updater(session) }
          : session
      )
    )
  }

  const handleSend = async (textOverride?: string) => {
    const messageText = (textOverride ?? input).trim()

    if (!messageText || !activeSession || isSending) return

    const sessionId = activeSession.id
    const timestamp = now()

    const userMessage: ChatMessage = {
      id: Date.now(),
      type: 'user',
      text: messageText,
      timestamp,
    }

    addMessage(userMessage);

    updateSession(sessionId, (session) => {
      const nextMessages = [...session.messages, userMessage]

      return {
        messages: nextMessages,
        title: deriveTitle(nextMessages),
        updatedAt: timestamp,
      }
    })

    setInput('')
    setIsSending(true)

    /*
    // 프론트 Mock AI 응답
    setTimeout(() => {
      const replyTime = now()

      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text:
          '관련 규정과 내부 문서를 검색하고 있습니다.\n\n검토 결과 예시는 다음과 같습니다.\n\n1. 금융상품 판매 전 적합성 원칙 준수\n2. 고객 정보 보호 의무 확인\n3. 불완전판매 방지 조치 점검\n\n자세한 내용은 관련 규정 문서를 확인해 주세요.',
        timestamp: replyTime,
      }

      addMessage(aiMessage);

      updateSession(sessionId, (session) => ({
        messages: [...session.messages, aiMessage],
        updatedAt: replyTime,
      }))
    }, 1000)
    */

    // 실제 백엔드 연동
    try {
      const response = await chatApi.sendMessage(String(sessionId), messageText)

      console.log('채팅 응답', response)

      const replyTime = now()

      const aiMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: getAiResponseText(response),
        timestamp: replyTime,
      }
      addMessage(aiMessage);

      updateSession(sessionId, (session) => ({
        messages: [...session.messages, aiMessage],
        updatedAt: replyTime,
      }))
    } catch (error) {
      console.error('메시지 전송 실패', error)

      const errorTime = now()

      const errorMessage: ChatMessage = {
        id: Date.now() + 1,
        type: 'ai',
        text: '메시지 전송 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.',
        timestamp: errorTime,
      }

      addMessage(errorMessage);

      updateSession(sessionId, (session) => ({
        messages: [...session.messages, errorMessage],
        updatedAt: errorTime,
      }))
    } finally {
      setIsSending(false)
    }
  }

  const handleNewSession = () => {

    const newSession = createSession(nextSessionId.current);
    nextSessionId.current += 1;
    setSessions((current) => [newSession, ...current]);
    setActiveSessionId(newSession.id);
    setStoreMessages(newSession.messages);
    setInput('');
  };

  const handleTogglePin = (sessionId: number) => {
    updateSession(sessionId, (session) => ({ pinned: !session.pinned }))
  }

  const handleSelectSession = (sessionId: number) => {
    const selectedSession = sessions.find((session) => session.id === sessionId);

    if (!selectedSession) return;

    setActiveSessionId(sessionId);
    setStoreMessages(selectedSession.messages);
  };

  const filteredSessions = useMemo(() => {
    const keyword = historySearch.trim().toLowerCase()

    const matched = keyword
      ? sessions.filter((session) => {
          const haystack = [
            session.title,
            ...session.messages.map((message) => message.text),
          ]
            .join(' ')
            .toLowerCase()

          return haystack.includes(keyword)
        })
      : sessions

    return [...matched].sort(
      (a, b) => Number(b.pinned) - Number(a.pinned) || b.id - a.id
    )
  }, [historySearch, sessions])

  const pinnedSessions = filteredSessions.filter((session) => session.pinned)
  const recentSessions = filteredSessions.filter((session) => !session.pinned)

  return (
    <div className="flex h-[calc(100vh-150px)] gap-6">
      <div className="flex flex-1 flex-col overflow-hidden rounded-lg border border-white/60 bg-white/85 shadow-lg backdrop-blur-xl">
        <div className="border-b border-gray-200/50 bg-white/60 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-600 to-indigo-600">
              <Bot className="h-6 w-6 text-white" />
            </div>

            <div>
              <h2 className="font-bold text-gray-900">AI 어시스턴트</h2>
              <p className="text-xs text-gray-600">컴플라이언스 전문 AI</p>
            </div>
          </div>
        </div>

        <div className="flex-1 space-y-6 overflow-y-auto p-6">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-4 ${
                message.type === 'user' ? 'flex-row-reverse' : ''
              }`}
            >
              <div
                className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                  message.type === 'ai'
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-600'
                    : 'bg-gradient-to-br from-gray-600 to-gray-700'
                }`}
              >
                {message.type === 'ai' ? (
                  <Bot className="h-5 w-5 text-white" />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>

              <div className={`flex-1 ${message.type === 'user' ? 'text-right' : ''}`}>
                <div className="mb-1 flex items-center gap-2">
                  <span
                    className={`text-sm font-medium text-gray-900 ${
                      message.type === 'user' ? 'ml-auto' : ''
                    }`}
                  >
                    {message.type === 'ai' ? 'AI 어시스턴트' : '김준또'}
                  </span>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>

                <div
                  className={`inline-block max-w-2xl rounded-lg px-5 py-3 text-left ${
                    message.type === 'ai'
                      ? 'border border-gray-200/50 bg-white/90 text-gray-800'
                      : 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white'
                  }`}
                >
                  <p className="whitespace-pre-wrap break-words text-sm leading-7">
                    {formatMessageForDisplay(message)}
                  </p>
                </div>

              </div>
            </div>
          ))}

          <div ref={bottomRef} />
        </div>

        {messages.length === 1 && (
          <div className="px-6 pb-4">
            <p className="mb-3 text-sm font-medium text-gray-600">추천 질문</p>

            <div className="grid grid-cols-2 gap-2">
              {suggestedQuestions.map((question) => (
                <button
                  key={question}
                  type="button"
                  onClick={() => handleSend(question)}
                  disabled={isSending}
                  className="rounded-lg border border-blue-200/50 bg-blue-50/80 px-4 py-3 text-left text-sm text-blue-700 transition-colors hover:bg-blue-100/80 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="border-t border-gray-200/50 bg-white/60 px-6 py-4">
          <div className="flex gap-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  handleSend()
                }
              }}
              placeholder="컴플라이언스 관련 질문을 입력하세요..."
              className="flex-1 rounded-lg border border-gray-200/50 bg-white/90 px-5 py-3 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            />

            <button
              type="button"
              onClick={() => handleSend()}
              disabled={!input.trim() || isSending}
              className="rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-3 text-white transition-all hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <aside className="flex w-80 flex-col overflow-hidden rounded-lg border border-white/60 bg-white/85 shadow-lg backdrop-blur-xl">
        <div className="border-b border-gray-200/50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-bold text-gray-900">
              <MessageSquare className="h-5 w-5 text-indigo-600" />
              채팅 목록
            </h3>

            <button
              type="button"
              onClick={handleNewSession}
              className="rounded-lg border border-blue-200/70 bg-blue-50 p-2 text-blue-700 transition-colors hover:bg-blue-100"
              title="새 채팅"
              aria-label="새 채팅"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

            <input
              value={historySearch}
              onChange={(event) => setHistorySearch(event.target.value)}
              placeholder="과거 채팅 검색"
              className="w-full rounded-lg border border-gray-200/60 bg-white/90 py-2.5 pl-9 pr-3 text-sm text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <ChatSessionSection
            title="고정됨"
            emptyText={
              historySearch
                ? '검색된 고정 채팅이 없습니다.'
                : '핀 고정한 채팅이 없습니다.'
            }
            sessions={pinnedSessions}
            activeSessionId={activeSessionId}
            onSelect={handleSelectSession}
            onTogglePin={handleTogglePin}
          />

          <div className="my-4 border-t border-gray-200/60" />

          <ChatSessionSection
            title="최근 채팅"
            emptyText={
              historySearch
                ? '검색된 채팅이 없습니다.'
                : '아직 과거 채팅이 없습니다.'
            }
            sessions={recentSessions}
            activeSessionId={activeSessionId}
            onSelect={handleSelectSession}
            onTogglePin={handleTogglePin}
          />
        </div>
      </aside>
    </div>
  )
}

type ChatSessionSectionProps = {
  title: string
  emptyText: string
  sessions: ChatSession[]
  activeSessionId: number
  onSelect: (sessionId: number) => void
  onTogglePin: (sessionId: number) => void
}

function ChatSessionSection({
  title,
  emptyText,
  sessions,
  activeSessionId,
  onSelect,
  onTogglePin,
}: ChatSessionSectionProps) {
  return (
    <section>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        {title}
      </p>

      {sessions.length === 0 ? (
        <p className="rounded-lg border border-dashed border-gray-200/80 bg-white/50 px-3 py-4 text-center text-xs text-gray-500">
          {emptyText}
        </p>
      ) : (
        <div className="space-y-2">
          {sessions.map((session) => (
            <div
              key={session.id}
              role="button"
              tabIndex={0}
              onClick={() => onSelect(session.id)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault()
                  onSelect(session.id)
                }
              }}
              className={`group w-full rounded-lg border p-3 text-left transition-all ${
                session.id === activeSessionId
                  ? 'border-blue-300 bg-blue-50/90 shadow-sm'
                  : 'border-gray-200/60 bg-white/80 hover:border-blue-200 hover:bg-blue-50/40'
              }`}
            >
              <div className="flex items-start gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-gray-900">
                    {session.title}
                  </p>
                  <p className="mt-1 truncate text-xs text-gray-600">
                    {session.messages[session.messages.length - 1]?.text}
                  </p>
                  <p className="mt-2 text-xs text-gray-400">
                    {session.updatedAt}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    onTogglePin(session.id)
                  }}
                  className={`rounded-md p-1.5 transition-colors ${
                    session.pinned
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-400 hover:bg-gray-100 hover:text-gray-700'
                  }`}
                  title={session.pinned ? '핀 고정 해제' : '핀 고정'}
                  aria-label={session.pinned ? '핀 고정 해제' : '핀 고정'}
                >
                  <Pin className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
