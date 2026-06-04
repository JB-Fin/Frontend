// 언어 설정 훅: 서비스 언어 상태 관리
import { useState } from 'react'
import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from '../data/languages'

export function useLanguage() {
  const [language, setLanguage] = useState(DEFAULT_LANGUAGE)
  const languages = SUPPORTED_LANGUAGES
  return { language, setLanguage, languages }
}
