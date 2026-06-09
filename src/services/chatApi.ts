const BASE = import.meta.env.VITE_API_URL

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

    return []
  },

  // 메시지 전송
  sendMessage: async (chatId: string, message: string) => {
    // 실제 백엔드 연결 코드
    const res = await fetch(`${BASE}/api/v1/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: JSON.stringify({
        message,
        language: 'ko',
      }),
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.detail || '메시지 전송 실패')
    }

    return data

    /*
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
    */
  },
}