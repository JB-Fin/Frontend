// 인증 API: 로그인, 로그아웃, 사용자 인증 확인 요청 처리 API 함수 정의
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const authApi = {
  login: async (userId, password) => {
    // 백엔드 연결 시 아래 주석 해제
    // const res = await fetch(`${BASE}/auth/login`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ userId, password }),
    // })
    // return res.json()
    return { token: 'mock-token', name: '김준범', team: '컴플라이언스팀' }
  },

  logout: async () => {
    // await fetch(`${BASE}/auth/logout`, { method: 'POST' })
  },
}
