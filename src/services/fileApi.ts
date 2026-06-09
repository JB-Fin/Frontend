const BASE = import.meta.env.VITE_API_URL

// 프론트 테스트용 임시 파일 목록
const MOCK_FILES = [
  {
    id: '1',
    fileName: '광고심의_가이드라인.pdf',
    size: '2.4MB',
    uploadedAt: '2026-06-09',
  },
  {
    id: '2',
    fileName: '내부통제_규정.docx',
    size: '1.1MB',
    uploadedAt: '2026-06-08',
  },
]

export const fileApi = {
  // 파일 업로드
  upload: async (file: File) => {
    /*
    // 실제 백엔드 연결 코드
    const formData = new FormData()
    formData.append('file', file)

    const res = await fetch(`${BASE}/api/v1/files`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
      body: formData,
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.detail || '파일 업로드 실패')
    }

    return data
    */

    // 프론트 테스트용 Mock 처리
    await new Promise((resolve) => setTimeout(resolve, 500))

    return {
      success: true,
      file: {
        id: Date.now().toString(),
        fileName: file.name,
        size: `${(file.size / 1024).toFixed(1)}KB`,
        uploadedAt: new Date().toISOString(),
      },
    }
  },

  // 파일 삭제
  delete: async (fileId: string) => {
    /*
    // 실제 백엔드 연결 코드
    const res = await fetch(`${BASE}/api/v1/files/${fileId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
      },
    })

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.detail || '파일 삭제 실패')
    }

    return data
    */

    // 프론트 테스트용 Mock 처리
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      success: true,
      fileId,
      message: '파일 삭제 완료',
    }
  },

  // 파일 목록 조회 (라이브러리 페이지용)
  getList: async () => {
    await new Promise((resolve) => setTimeout(resolve, 300))

    return MOCK_FILES
  },
}