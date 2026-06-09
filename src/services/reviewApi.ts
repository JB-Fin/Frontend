const BASE = import.meta.env.VITE_API_URL

// 프론트 테스트용 임시 심의 데이터
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

export const reviewApi = {
  // 심의 목록 조회
  getList: async () => {
    /*
    // 실제 백엔드 연결 코드
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
    */

    // 프론트 테스트용 Mock 데이터
    await new Promise((resolve) => setTimeout(resolve, 300))

    return MOCK_REVIEWS
  },

  // 심의 요청 등록
  postReview: async (reviewData: any) => {
    /*
    // 실제 백엔드 연결 코드
    const res = await fetch(`${BASE}/api/v1/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify(reviewData),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.detail || '심의 요청 실패')
    }

    return data
    */

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
  },
}