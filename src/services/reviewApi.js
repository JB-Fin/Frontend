const BASE = import.meta.env.VITE_API_URL

export const reviewApi = {
  getList: async () => {
    const res = await fetch(`${BASE}/api/v1/reviews`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem('accessToken')}` }
    })
    return await res.json()
  },
  postReview: async (reviewData) => {
    const res = await fetch(`${BASE}/api/v1/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
      },
      body: JSON.stringify(reviewData)
    })
    return await res.json()
  }
}