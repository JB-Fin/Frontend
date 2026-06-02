// 검토 API: 문서 업로드, AI 준법성 검토 요청, 검토 결과 조회, 검토 결과 보고서 생성을 처리하는 API 함수들 정의
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const reviewApi = {
  // 문서 분석 요청
  analyze: async (fileName, language) => {
    const res = await fetch(`${BASE}/api/v1/reviews/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ file_name: fileName, language }),
    })
    if (!res.ok) throw new Error('분석 요청 실패')
    return res.json()  // { review_id, ... }
  },

  // 검토 결과 조회
  getResult: async (reviewId) => {
    const res = await fetch(`${BASE}/api/v1/reviews/${reviewId}`)
    if (!res.ok) throw new Error('결과 조회 실패')
    return res.json()
  },

  // 보고서 조회
  getReport: async (reviewId) => {
    const res = await fetch(`${BASE}/api/v1/reviews/${reviewId}/report`)
    if (!res.ok) throw new Error('보고서 조회 실패')
    return res.json()
  },

  // 작업 내역 목록
  getHistory: async () => {
    const res = await fetch(`${BASE}/api/v1/history`)
    if (!res.ok) throw new Error('내역 조회 실패')
    return res.json()
  },
}
