// 채팅 API: AI 질문 응답, 추천 질문, 대화 기록 추천 API 함수들 정의
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const chatApi = {
  send: async (message) => {
    const res = await fetch(`${BASE}/api/v1/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message }),
    })
    if (!res.ok) throw new Error('전송 실패')
    return res.json()  // { reply } 형태로 받아야 함
  },
}