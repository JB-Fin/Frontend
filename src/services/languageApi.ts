const BASE = import.meta.env.VITE_API_URL

export const languageApi = {
  getSettings: async () => {
    const res = await fetch(`${BASE}/api/v1/settings/language`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
    return await res.json()
  },
  updateSettings: async (langCode: string) => {
    const res = await fetch(`${BASE}/api/v1/settings/language`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify({ lang: langCode })
    })
    return await res.json()
  }
}