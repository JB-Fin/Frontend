const BASE = import.meta.env.VITE_API_URL

/*
const MOCK_REVIEWS = [
  {
    id: '1',
    title: '여름 이벤트 광고',
    status: '완료',
    riskLevel: '낮음',
    createdAt: '2026-06-09',
  },
  {
    id: '2',
    title: '신용대출 프로모션',
    status: '검토중',
    riskLevel: '중간',
    createdAt: '2026-06-08',
  },
  {
    id: '3',
    title: '적금 가입 캠페인',
    status: '반려',
    riskLevel: '높음',
    createdAt: '2026-06-07',
  },
]
*/

export const reviewApi = {
  // 심의 목록 조회
  getList: async () => {
    const res = await fetch(`${BASE}/api/v1/reviews`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.detail || '심의 목록 조회 실패')
    }

    return data

    /*
    // 프론트 테스트용 Mock 데이터
    await new Promise((resolve) => setTimeout(resolve, 300))

    return MOCK_REVIEWS
    */
  },
  // 문서 AI 분석
  analyze: async (reviewData: any) => {
    const res = await fetch(`${BASE}/api/v1/reviews/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({
        file_id: reviewData.file_id,
        language: reviewData.language ?? 'ko',
        regulation_scope:
          reviewData.regulation_scope ?? 'internal_external',
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.detail || '문서 분석 실패')
    }

    return data
  },
  
  // 심의 요청 등록
  postReview: async (reviewData: any) => {
    const res = await fetch(`${BASE}/api/v1/reviews/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({
        file_id: reviewData.file_id,
        language: reviewData.language ?? 'ko',
        regulation_scope:
          reviewData.regulation_scope ?? 'internal_external',
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.detail || '심의 요청 실패')
    }

    return data
  },
   // 심의 결과 상세 조회
   getReview: async (reviewId: number) => {
    const res = await fetch(`${BASE}/api/v1/reviews/${reviewId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })
    const data = await res.json()
    
    if (!res.ok) {
      throw new Error(data.detail || '검토 결과 조회 실패')
    }
    
    return data
 
    /*
    // 프론트 테스트용 Mock 처리
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      review: {
        id: Date.now().toString(),
        ...reviewData,
        status: '검토중',
        createdAt: new Date().toISOString(),
      },
      message: '심의 요청이 등록되었습니다.',
    }
    */
   },
  }