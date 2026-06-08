const BASE = import.meta.env.VITE_API_URL

export const fileApi = {
  upload: async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    const res = await fetch(`${BASE}/api/v1/files`, {
      method: 'POST',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` },
      body: formData
    })
    return await res.json()
  },
  delete: async (fileId) => {
    const res = await fetch(`${BASE}/api/v1/files/${fileId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
    return await res.json()
  }
}