const BASE = import.meta.env.VITE_API_URL

export const alramApi = {
  // 알림 목록 조회
  getList: async () => {
    const res = await fetch(`${BASE}/api/v1/alrams`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
    return await res.json()
  },
  // 알림 읽음 처리
  markAsRead: async (id: string) => {
    const res = await fetch(`${BASE}/api/v1/alrams/${id}/read`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
    return await res.json()
  }
}