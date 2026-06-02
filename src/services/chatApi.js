// 채팅 API: AI 질문 응답, 추천 질문, 대화 기록 추천 API 함수들 정의
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const chatApi = {
  send: async (message) => {
    // return fetch(`${BASE}/chat`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ message }),
    // }).then(r => r.json())
    return { reply: '문서를 분석하고 있습니다. 잠시만 기다려 주세요.' }
  },
}
