// 파일 API: 문서 업로드, 다운로드, 파일 삭제 관련 API 함수 정의
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const fileApi = {
  upload: async (file, language) => {
    const form = new FormData()
    form.append('file', file)
    form.append('language', language)
    const res = await fetch(`${BASE}/api/v1/files/upload`, {
      method: 'POST',
      body: form,
    })
    if (!res.ok) throw new Error('업로드 실패')
    return res.json()  // { file_name, ... } 형태로 받아야 함
  },

  download: async (fileName) => {
    window.open(`${BASE}/api/v1/files/download/${fileName}`)
  },
}