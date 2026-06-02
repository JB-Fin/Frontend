// 검색 바: 목록, 이력, 문서 검색에 사용하는 입력 컴포넌트
import { useState } from 'react'

export default function SearchBar({ placeholder = '검색', onSearch }) {
  const [value, setValue] = useState('')
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--white)', border: '1px solid var(--border)', borderRadius: 8, padding: '8px 12px' }}>
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={e => e.key === 'Enter' && onSearch?.(value)}
        placeholder={placeholder}
        style={{ border: 'none', outline: 'none', fontSize: 13, color: 'var(--text-dark)', background: 'transparent', width: 200 }}
      />
    </div>
  )
}
