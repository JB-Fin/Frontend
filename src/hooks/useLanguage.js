// 언어 설정 훅: 서비스 언어 상태 관리
import { useState } from 'react'

export function useLanguage() {
  const [language, setLanguage] = useState('한국어')
  const languages = ['한국어', 'English', '日本語', '中文']
  return { language, setLanguage, languages }
}
