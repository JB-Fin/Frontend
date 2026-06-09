const BASE = import.meta.env.VITE_API_URL

// 프론트 테스트용 임시 채팅 데이터
const MOCK_CHATS = [
  {
    id: '1',
    title: 'AI 컴플라이언스 상담',
    lastMessage: '금융광고 심의 기준을 알려주세요.',
  },
  {
    id: '2',
    title: '내부 규정 문의',
    lastMessage: '최신 내부통제 기준이 궁금합니다.',
  },
]

export const chatApi = {
  // 채팅방 목록 조회
  getList: async () => {
    /*
    // 실제 백엔드 연결 코드
    const res = await fetch(`${BASE}/api/v1/chats`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.detail || '채팅 목록 조회 실패')
    }

    return data
    */

    // 프론트 테스트용 Mock 데이터
    await new Promise((resolve) => setTimeout(resolve, 300))

    return MOCK_CHATS
  },

  // 메시지 전송
  sendMessage: async (chatId: string, message: string) => {
    /*
    // 실제 백엔드 연결 코드
    const res = await fetch(
      `${BASE}/api/v1/chats/${chatId}/messages`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          content: message,
        }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.detail || '메시지 전송 실패')
    }

    return data
    */

    // 프론트 테스트용 Mock 처리
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      chatId,
      message: {
        id: Date.now().toString(),
        role: 'assistant',
        content: `AI 응답 예시: "${message}"에 대한 답변입니다.`,
        createdAt: new Date().toISOString(),
      },
    }
  },
}