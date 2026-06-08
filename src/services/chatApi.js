const BASE = import.meta.env.VITE_API_URL

export const chatApi = {
  getList: async () => {
    const res = await fetch(`${BASE}/api/v1/chats`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
    return await res.json()
  },
  sendMessage: async (chatId, message) => {
    const res = await fetch(`${BASE}/api/v1/chats/${chatId}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ content: message })
    })
    return await res.json()
  }
}