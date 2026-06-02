// 검토 API: 문서 업로드, AI 준법성 검토 요청, 검토 결과 조회, 검토 결과 보고서 생성을 처리하는 API 함수들 정의
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const reviewApi = {
  getResult: async (docId) => {
    // return fetch(`${BASE}/review/${docId}`).then(r => r.json())
    const { dummyReviewDetail } = await import('../data/dummyReviewDetail')
    return dummyReviewDetail
  },
  getHistory: async () => {
    // return fetch(`${BASE}/review/history`).then(r => r.json())
    const { dummyWorks } = await import('../data/dummyWorks')
    return dummyWorks
  },
}
