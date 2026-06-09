const BASE = import.meta.env.VITE_API_URL

// 프론트 테스트용 임시 알림 데이터
const MOCK_ALARMS = [
  {
    id: '1',
    title: '규정 업데이트',
    message: '금융소비자보호법이 개정되었습니다.',
    isRead: false,
    createdAt: '2026-06-09',
  },
  {
    id: '2',
    title: 'AI 검토 완료',
    message: '광고 심의가 완료되었습니다.',
    isRead: true,
    createdAt: '2026-06-08',
  },
  {
    id: '3',
    title: '일정 리마인더',
    message: '오후 2시 컴플라이언스 회의 예정',
    isRead: false,
    createdAt: '2026-06-09',
  },
]

export const alarmApi = {
  // 알림 목록 조회
  getList: async () => {
    /*
    // 실제 백엔드 연결 코드
    const res = await fetch(`${BASE}/api/v1/alarms`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.detail || '알림 목록 조회 실패')
    }

    return data
    */

    // 프론트 테스트용 Mock 데이터
    await new Promise((resolve) => setTimeout(resolve, 300))

    return MOCK_ALARMS
  },

  // 알림 읽음 처리
  markAsRead: async (id: string) => {
    /*
    // 실제 백엔드 연결 코드
    const res = await fetch(`${BASE}/api/v1/alarms/${id}/read`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.detail || '알림 읽음 처리 실패')
    }

    return data
    */

    // 프론트 테스트용 Mock 처리
    await new Promise((resolve) => setTimeout(resolve, 200))

    return {
      success: true,
      alarmId: id,
      message: '읽음 처리 완료',
    }
  },
}