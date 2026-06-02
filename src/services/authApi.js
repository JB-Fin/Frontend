// 인증 API: 로그인, 로그아웃, 사용자 인증 확인 요청 처리 API 함수 정의

const BASE =

  import.meta.env.VITE_API_URL ||

  'http://127.0.0.1:8000'
 
export const authApi = {

  login: async (userId, password) => {

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
 
    return data

  },
 
  logout: async () => {

    const res = await fetch(

      `${BASE}/api/v1/auth/logout`,

      {

        method: 'POST',

      }

    )
 
    return await res.json()

  },

}
 