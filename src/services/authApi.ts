// 인증 API: 로그인, 로그아웃, 사용자 인증 확인 요청 처리 API 함수 정의
 
const BASE = import.meta.env.VITE_API_URL
 
// 프론트 테스트용 임시 로그인 계정
const MOCK_USERS = [
  {
    user_id: 'admin',
    password: '1234',
    name: '관리자',
    role: 'ADMIN',
  },
  {
    user_id: 'user',
    password: '1234',
    name: '일반 사용자',
    role: 'USER',
  },
]
 
export const authApi = {
  login: async (userId, password) => {
    // 실제 백엔드 로그인 API 연결 코드
 
    const res = await fetch(
      `${BASE}/api/v1/auth/login`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: userId,
          password,
        }),
      }
    )
 
    const data = await res.json()
 
    if (!res.ok) {
      throw new Error(
        data.detail || '로그인 실패'
      )
    }
 
    localStorage.setItem('token', data.token)
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('user', JSON.stringify(data.user))
 
    return data
 
    /*
    // 프론트 내부 임시 로그인 로직
    await new Promise((resolve) => setTimeout(resolve, 300))
 
    const user = MOCK_USERS.find(
      (mockUser) =>
        mockUser.user_id === userId &&
        mockUser.password === password
    )
 
    if (!user) {
      throw new Error('아이디 또는 비밀번호가 올바르지 않습니다.')
    }
 
    const loginUser = {
      user_id: user.user_id,
      name: user.name,
      role: user.role,
    }
 
    const data = {
      token: 'mock-token',
      accessToken: 'mock-access-token',
      user: loginUser,
    }
 
    localStorage.setItem('token', data.token)
    localStorage.setItem('accessToken', data.accessToken)
    localStorage.setItem('user', JSON.stringify(loginUser))
 
    return data
    */
  },
 
  logout: async () => {
    // 실제 백엔드 로그아웃 API 연결 코드
 
    const res = await fetch(
      `${BASE}/api/v1/auth/logout`,
      {
        method: 'POST',
      }
    )
 
    localStorage.removeItem('token')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
 
    return await res.json()
 
    /*
    // 프론트 내부 임시 로그아웃 로직
    localStorage.removeItem('token')
    localStorage.removeItem('accessToken')
    localStorage.removeItem('user')
 
    return {
      success: true,
      message: '로그아웃 완료',
    }
    */
  },
}