import { create } from 'zustand'

export type ChatMessage = {
  id: number
  type: 'ai' | 'user'
  text: string
  timestamp: string
}

interface ChatState {
  messages: ChatMessage[]
  addMessage: (msg: ChatMessage) => void
  setMessages: (messages: ChatMessage[]) => void
  resetMessages: () => void
}

function now() {
  return new Date().toLocaleTimeString('ko-KR', {
    hour: '2-digit',
    minute: '2-digit',
  })
}

function createInitialMessages(): ChatMessage[] {
  return [
    {
      id: 1,
      type: 'ai',
      text: '안녕하세요! JB금융그룹 Compliance AI assistant입니다.',
      timestamp: now(),
    },
  ]
}

export const useChatStore = create<ChatState>((set) => ({
  messages: createInitialMessages(),

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),

  setMessages: (messages) => set({ messages }),
  resetMessages: () => set({ messages: createInitialMessages() }),
}))
