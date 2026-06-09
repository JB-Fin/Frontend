const BASE = import.meta.env.VITE_API_URL

// 프론트 테스트용 임시 언어 설정
const MOCK_LANGUAGE_SETTING = {
  lang: 'ko',
  availableLanguages: [
    { code: 'ko', name: '한국어' },
    { code: 'en', name: 'English' },
    { code: 'vi', name: 'Tiếng Việt' },
    { code: 'km', name: 'ភាសាខ្មែរ' },
    { code: 'my', name: 'မြန်မာဘာသာ' },
  ],
}

export const languageApi = {
  // 언어 설정 조회
  getSettings: async () => {
    /*
    // 실제 백엔드 연결 코드
    const res = await fetch(
      `${BASE}/api/v1/settings/language`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      }
    )

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.detail || '언어 설정 조회 실패')
    }

    return data
    */

    // 프론트 테스트용 Mock 데이터
    await new Promise((resolve) => setTimeout(resolve, 300))

    return MOCK_LANGUAGE_SETTING
  },

  // 언어 설정 변경
  updateSettings: async (langCode: string) => {
    /*
    // 실제 백엔드 연결 코드
    const res = await fetch(
      `${BASE}/api/v1/settings/language`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
        body: JSON.stringify({
          lang: langCode,
        }),
      }
    )

    const data = await res.json()

    if (!res.ok) {
      throw new Error(data.detail || '언어 설정 변경 실패')
    }

    return data
    */

    // 프론트 테스트용 Mock 처리
    await new Promise((resolve) => setTimeout(resolve, 300))

    return {
      success: true,
      lang: langCode,
      message: '언어 설정이 변경되었습니다.',
    }
  },
}