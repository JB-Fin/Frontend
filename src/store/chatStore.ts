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
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [
    {
      id: 1,
      type: 'ai',
      text: '안녕하세요! JB금융그룹 컴플라이언스 AI 어시스턴트입니다.',
      timestamp: new Date().toLocaleTimeString('ko-KR', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    },
  ],

  addMessage: (msg) =>
    set((state) => ({
      messages: [...state.messages, msg],
    })),
}))