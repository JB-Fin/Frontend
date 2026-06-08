import React, { useState } from 'react'
import { Search, Grid, List } from 'lucide-react'

type FileType = 'review' | 'original' | 'report'
type ViewMode = 'grid' | 'list'
type FilterTab = '모두' | '이미지' | '파일'

interface LibraryFile {
  id: string
  name: string
  type: FileType
  ext: string
  size: string
  updatedAt: string
}

const initialFiles: LibraryFile[] = [
  { id: '1', name: '금융소비자보호법_광고심의_결과.pdf', type: 'review', ext: 'PDF', size: '2.4 MB', updatedAt: '어제' },
  { id: '2', name: 'AML_이상징후_분석_보고서.pdf', type: 'report', ext: 'PDF', size: '1.8 MB', updatedAt: '어제' },
  { id: '3', name: '투자설명서_원본_v2.docx', type: 'original', ext: 'DOCX', size: '890 KB', updatedAt: '어제' },
  { id: 'img1', name: '사내교육_현장사진.png', type: 'original', ext: 'PNG', size: '3.2 MB', updatedAt: '오늘' },
  { id: 'img2', name: '리스크_분석_차트.jpg', type: 'report', ext: 'JPG', size: '1.1 MB', updatedAt: '오늘' },
]

const typeColor = {
  review: '#16a34a',
  original: '#2563eb',
  report: '#f59e0b',
}

const isImage = (ext: string) =>
  ['PNG', 'JPG', 'JPEG'].includes(ext?.toUpperCase())

function FileIcon({ ext }: { ext: string }) {
  return (
    <div
      style={{
        width: 38,
        height: 38,
        borderRadius: 10,
        background: '#f3f4f6',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 700,
        fontSize: 12,
        color: '#374151',
      }}
    >
      {ext}
    </div>
  )
}

export function TaskHistoryPage() {
  const [files] = useState(initialFiles)
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [activeTab, setActiveTab] = useState<FilterTab>('모두')
  const [preview, setPreview] = useState<LibraryFile | null>(null)

  const filtered = files.filter(f => {
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase())
    const matchTab =
      activeTab === '모두'
        ? true
        : activeTab === '이미지'
        ? isImage(f.ext)
        : !isImage(f.ext)

    return matchSearch && matchTab
  })

  return (
    <div style={{ padding: 28, background: '#f9fafb', minHeight: '100vh' }}>

      {/* 헤더 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 18,
      }}>
        <h2 style={{ fontSize: 22, fontWeight: 800, color: '#111827' }}>
          📁 라이브러리
        </h2>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: 8,
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: viewMode === 'list' ? '#111827' : '#fff',
              color: viewMode === 'list' ? '#fff' : '#111827',
            }}
          >
            <List size={16} />
          </button>

          <button
            onClick={() => setViewMode('grid')}
            style={{
              padding: 8,
              borderRadius: 8,
              border: '1px solid #e5e7eb',
              background: viewMode === 'grid' ? '#111827' : '#fff',
              color: viewMode === 'grid' ? '#fff' : '#111827',
            }}
          >
            <Grid size={16} />
          </button>
        </div>
      </div>

      {/* 검색 */}
      <div style={{ marginBottom: 16 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          background: '#fff',
          border: '1px solid #e5e7eb',
          borderRadius: 12,
          padding: '10px 12px',
        }}>
          <Search size={16} color="#9ca3af" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="파일 검색..."
            style={{
              border: 'none',
              outline: 'none',
              marginLeft: 8,
              width: '100%',
              fontSize: 14,
            }}
          />
        </div>
      </div>

      {/* 탭 */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 18 }}>
        {(['모두', '이미지', '파일'] as FilterTab[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '6px 14px',
              borderRadius: 999,
              fontSize: 13,
              border: '1px solid #e5e7eb',
              background: activeTab === tab ? '#111827' : '#fff',
              color: activeTab === tab ? '#fff' : '#6b7280',
              transition: '0.2s',
              cursor: 'pointer',
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* 리스트 */}
      {viewMode === 'list' ? (
        <div style={{ background: '#fff', borderRadius: 14, overflow: 'hidden' }}>
          {filtered.map(file => (
            <div
              key={file.id}
              onClick={() => setPreview(file)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: 14,
                borderBottom: '1px solid #f3f4f6',
                cursor: 'pointer',
              }}
              onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
              onMouseLeave={e => (e.currentTarget.style.background = '#fff')}
            >
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <FileIcon ext={file.ext} />
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>
                    {file.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#9ca3af' }}>
                    {file.size} · {file.updatedAt}
                  </div>
                </div>
              </div>

              <span
                style={{
                  fontSize: 11,
                  padding: '4px 10px',
                  borderRadius: 999,
                  background: '#f3f4f6',
                  color:
                    typeColor[file.type],
                  fontWeight: 600,
                }}
              >
                {file.type}
              </span>
            </div>
          ))}
        </div>
      ) : (
        /* GRID */
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 14,
          }}
        >
          {filtered.map(file => (
            <div
              key={file.id}
              onClick={() => setPreview(file)}
              style={{
                background: '#fff',
                border: '1px solid #eee',
                borderRadius: 14,
                padding: 14,
                cursor: 'pointer',
                transition: '0.2s',
              }}
              onMouseEnter={e =>
                (e.currentTarget.style.transform = 'translateY(-2px)')
              }
              onMouseLeave={e =>
                (e.currentTarget.style.transform = 'translateY(0)')
              }
            >
              <FileIcon ext={file.ext} />
              <div style={{ marginTop: 10 }}>
                <div style={{ fontSize: 13, fontWeight: 600 }}>
                  {file.name}
                </div>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>
                  {file.size}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 모달 */}
      {preview && (
        <div
          onClick={() => setPreview(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              padding: 24,
              borderRadius: 16,
              width: 420,
            }}
          >
            <h3 style={{ fontSize: 16 }}>{preview.name}</h3>
            <p style={{ color: '#6b7280' }}>{preview.ext}</p>
          </div>
        </div>
      )}
    </div>
  )
}