// 파일 API: 문서 업로드, 다운로드, 파일 삭제 관련 API 함수 정의
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const fileApi = {
  upload: async (file, language) => {
    // const form = new FormData()
    // form.append('file', file)
    // form.append('language', language)
    // return fetch(`${BASE}/documents/upload`, { method: 'POST', body: form }).then(r => r.json())
    return { docId: 'doc-001', status: 'pending' }
  },
  download: async (docId, type = 'pdf') => {
    // window.open(`${BASE}/report/${docId}/download?type=${type}`)
    console.log('[임시] 다운로드:', docId, type)
  },
}
