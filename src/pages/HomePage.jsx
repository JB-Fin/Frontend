import { useLayoutEffect, useMemo, useRef, useState } from 'react'
import ChatBox from '../components/chat/ChatBox'
import { dummyNotifications } from '../data/dummyNotifications'
import { dummySchedules } from '../data/dummySchedules'
import { SUPPORTED_LANGUAGES } from '../data/languages'
import '../styles/home.css'

const MAX_COLUMNS = 4
const ROW_HEIGHT = 86
const GRID_GAP = 16

const DEFAULT_WIDGETS = [
  { id: 'ai-chat', type: 'ai-chat', title: 'AI 채팅', colSpan: 2, rowSpan: 5 },
  { id: 'ai-review', type: 'ai-review', title: 'AI 검토', colSpan: 1, rowSpan: 2 },
  { id: 'task-history', type: 'task-history', title: '작업 내역', colSpan: 1, rowSpan: 2 },
  { id: 'calendar', type: 'calendar', title: '캘린더', colSpan: 2, rowSpan: 3 },
  { id: 'education', type: 'education', title: '교육 자료', colSpan: 1, rowSpan: 2 },
  { id: 'notification', type: 'notification', title: '최근 알림', colSpan: 1, rowSpan: 2 },
]

const WIDGET_OPTIONS = [
  { type: 'ai-chat', title: 'AI 채팅', colSpan: 2, rowSpan: 5 },
  { type: 'ai-review', title: 'AI 검토', colSpan: 1, rowSpan: 2 },
  { type: 'task-history', title: '작업 내역', colSpan: 1, rowSpan: 2 },
  { type: 'internal-investigation', title: '내부 조사 지원', colSpan: 2, rowSpan: 2 },
  { type: 'calendar', title: '캘린더', colSpan: 2, rowSpan: 3 },
  { type: 'education', title: '교육 자료', colSpan: 1, rowSpan: 2 },
  { type: 'notification', title: '최근 알림', colSpan: 1, rowSpan: 2 },
  { type: 'language', title: '언어 설정', colSpan: 1, rowSpan: 2 },
]

export default function HomePage() {
  const [widgets, setWidgets] = useState(DEFAULT_WIDGETS)
  const [panelOpen, setPanelOpen] = useState(false)
  const [selectedType, setSelectedType] = useState(WIDGET_OPTIONS[0].type)
  const [draggingId, setDraggingId] = useState(null)
  const [previewTargetId, setPreviewTargetId] = useState(null)
  const [resizingId, setResizingId] = useState(null)
  const [gridDropActive, setGridDropActive] = useState(false)
  const gridRef = useRef(null)
  const widgetRefs = useRef(new Map())
  const previousRects = useRef(new Map())

  const selectedOption = useMemo(
    () => WIDGET_OPTIONS.find(option => option.type === selectedType) ?? WIDGET_OPTIONS[0],
    [selectedType],
  )

  const handleAddWidget = () => {
    setWidgets(prev => [
      ...prev,
      {
        id: `${selectedOption.type}-${Date.now()}`,
        type: selectedOption.type,
        title: selectedOption.title,
        colSpan: selectedOption.colSpan,
        rowSpan: selectedOption.rowSpan,
      },
    ])
    setPanelOpen(false)
  }

  const handleRemoveWidget = (id) => {
    setWidgets(prev => prev.filter(widget => widget.id !== id))
  }

  const handleResizeWidget = (id, colSpan, rowSpan) => {
    setWidgets(prev => prev.map(widget => (
      widget.id === id
        ? { ...widget, colSpan: clamp(colSpan, 1, MAX_COLUMNS), rowSpan: clamp(rowSpan, 2, 7) }
        : widget
    )))
  }

  const handlePreviewWidget = (dragId, targetId) => {
    if (!dragId || dragId === targetId) return
    setPreviewTargetId(targetId)
  }

  const handleDropWidget = (dragId, targetId) => {
    if (!dragId || dragId === targetId) return
    setWidgets(prev => {
      const from = prev.findIndex(widget => widget.id === dragId)
      const to = prev.findIndex(widget => widget.id === targetId)
      if (from < 0 || to < 0) return prev
      const next = [...prev]
      const [moving] = next.splice(from, 1)
      next.splice(to, 0, moving)
      return next
    })
    setPreviewTargetId(null)
    setGridDropActive(false)
  }

  const handleDropToGrid = (dragId) => {
    if (!dragId) return
    setWidgets(prev => {
      const from = prev.findIndex(widget => widget.id === dragId)
      if (from < 0 || from === prev.length - 1) return prev
      const next = [...prev]
      const [moving] = next.splice(from, 1)
      next.push(moving)
      return next
    })
    setPreviewTargetId(null)
    setGridDropActive(false)
  }

  const setWidgetRef = (id, node) => {
    if (node) {
      widgetRefs.current.set(id, node)
    } else {
      widgetRefs.current.delete(id)
    }
  }

  useLayoutEffect(() => {
    const nextRects = new Map()

    widgetRefs.current.forEach((node, id) => {
      const nextRect = node.getBoundingClientRect()
      nextRects.set(id, nextRect)

      const previousRect = previousRects.current.get(id)
      if (!previousRect || id === draggingId || id === resizingId) return

      const deltaX = previousRect.left - nextRect.left
      const deltaY = previousRect.top - nextRect.top

      if (Math.abs(deltaX) < 1 && Math.abs(deltaY) < 1) return

      node.animate(
        [
          { transform: `translate(${deltaX}px, ${deltaY}px)` },
          { transform: 'translate(0, 0)' },
        ],
        {
          duration: 420,
          easing: 'cubic-bezier(0.16, 1, 0.3, 1)',
        },
      )
    })

    previousRects.current = nextRects
  }, [widgets, draggingId, resizingId])

  return (
    <div className="home-page">
      <section className="dashboard-hero">
        <div>
          <p className="dashboard-hero__eyebrow">Compliance Workspace</p>
          <h2>AI 기반 준법 업무를 한 화면에서 관리하세요</h2>
          <p>문서 검토, 질의 응답, 일정, 알림을 업무 흐름에 맞게 배치할 수 있습니다.</p>
        </div>
        <div className="dashboard-hero__stats" aria-label="업무 요약">
          <Metric label="검토 완료" value="28" tone="green" />
          <Metric label="주의 항목" value="7" tone="orange" />
          <Metric label="오늘 일정" value="3" tone="blue" />
        </div>
      </section>

      <section className="dashboard-toolbar" aria-label="대시보드 도구">
        <p>왼쪽 위 핸들로 위젯을 옮기고, 오른쪽 아래 핸들로 그리드 크기를 조절하세요.</p>
        <div className="dashboard-toolbar__actions">
          <button type="button" onClick={() => setPanelOpen(true)}>
            <PlusIcon />
            위젯 추가
          </button>
          <button type="button" onClick={() => setWidgets(DEFAULT_WIDGETS)}>
            <ResetIcon />
            초기화
          </button>
        </div>
      </section>

      {widgets.length === 0 ? (
        <section className="dashboard-empty">
          <PlusIcon />
          <strong>표시할 위젯이 없습니다</strong>
          <button type="button" onClick={() => setPanelOpen(true)}>위젯 추가</button>
        </section>
      ) : (
        <section
          ref={gridRef}
          className={`widget-grid${gridDropActive ? ' is-grid-drop-target' : ''}${resizingId ? ' is-grid-resizing' : ''}`}
          aria-label="대시보드 위젯"
          onDragOver={event => {
            event.preventDefault()
            if (!event.target.closest('.dashboard-widget')) {
              setPreviewTargetId(null)
              setGridDropActive(true)
            }
          }}
          onDragLeave={event => {
            if (!event.currentTarget.contains(event.relatedTarget)) {
              setGridDropActive(false)
            }
          }}
          onDrop={event => {
            event.preventDefault()
            if (!event.target.closest('.dashboard-widget')) {
              handleDropToGrid(draggingId)
            }
          }}
        >
          {widgets.map(widget => (
            <DashboardWidget
              key={widget.id}
              widget={widget}
              gridRef={gridRef}
              isDragging={draggingId === widget.id}
              isPreviewTarget={previewTargetId === widget.id}
              isResizing={resizingId === widget.id}
              setWidgetRef={setWidgetRef}
              onDragStart={() => setDraggingId(widget.id)}
              onDragEnd={() => {
                setDraggingId(null)
                setPreviewTargetId(null)
                setGridDropActive(false)
              }}
              onPreview={(targetId) => handlePreviewWidget(draggingId, targetId)}
              onDropWidget={(targetId) => handleDropWidget(draggingId, targetId)}
              onRemove={() => handleRemoveWidget(widget.id)}
              onResize={(colSpan, rowSpan) => handleResizeWidget(widget.id, colSpan, rowSpan)}
              onResizeStart={() => setResizingId(widget.id)}
              onResizeEnd={() => setResizingId(null)}
            />
          ))}
        </section>
      )}

      {panelOpen && (
        <aside className="add-widget-panel" aria-label="위젯 추가 패널">
          <div className="add-widget-panel__scrim" onClick={() => setPanelOpen(false)} />
          <div className="add-widget-panel__body">
            <div className="add-widget-panel__head">
              <div>
                <strong>위젯 추가</strong>
                <p>대시보드에 표시할 업무 모듈을 선택하세요.</p>
              </div>
              <button type="button" onClick={() => setPanelOpen(false)} aria-label="닫기">×</button>
            </div>
            <div className="add-widget-panel__options">
              {WIDGET_OPTIONS.map(option => (
                <button
                  type="button"
                  key={option.type}
                  className={selectedType === option.type ? 'selected' : ''}
                  onClick={() => setSelectedType(option.type)}
                >
                  <strong>{option.title}</strong>
                  <span>{option.colSpan} x {option.rowSpan}</span>
                </button>
              ))}
            </div>
            <button type="button" className="add-widget-panel__submit" onClick={handleAddWidget}>
              추가하기
            </button>
          </div>
        </aside>
      )}
    </div>
  )
}

function DashboardWidget({
  widget,
  gridRef,
  isDragging,
  isPreviewTarget,
  isResizing,
  setWidgetRef,
  onDragStart,
  onDragEnd,
  onPreview,
  onDropWidget,
  onRemove,
  onResize,
  onResizeStart,
  onResizeEnd,
}) {
  const startResize = (event, direction) => {
    event.preventDefault()
    event.stopPropagation()

    const grid = gridRef.current
    if (!grid) return

    const gridWidth = grid.getBoundingClientRect().width
    const columnWidth = (gridWidth - GRID_GAP * (MAX_COLUMNS - 1)) / MAX_COLUMNS
    const startX = event.clientX
    const startY = event.clientY
    const startCols = widget.colSpan
    const startRows = widget.rowSpan
    onResizeStart()

    const handlePointerMove = (moveEvent) => {
      const rawColDelta = Math.round((moveEvent.clientX - startX) / (columnWidth + GRID_GAP))
      const rawRowDelta = Math.round((moveEvent.clientY - startY) / (ROW_HEIGHT + GRID_GAP))
      const colDelta = direction.includes('left') ? -rawColDelta : rawColDelta
      const rowDelta = direction.includes('top') ? -rawRowDelta : rawRowDelta
      onResize(startCols + colDelta, startRows + rowDelta)
    }

    const handlePointerUp = () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
      document.body.classList.remove('widget-resizing')
      onResizeEnd()
    }

    document.body.classList.add('widget-resizing')
    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
  }

  return (
    <article
      ref={node => setWidgetRef(widget.id, node)}
      className={`dashboard-widget${isDragging ? ' is-dragging' : ''}${isPreviewTarget ? ' is-preview-target' : ''}${isResizing ? ' is-resizing' : ''}`}
      style={{ gridColumn: `span ${widget.colSpan}`, gridRow: `span ${widget.rowSpan}` }}
      onDragOver={event => event.preventDefault()}
      onDragEnter={event => {
        event.preventDefault()
        onPreview(widget.id)
      }}
      onDrop={event => {
        event.preventDefault()
        event.stopPropagation()
        onDropWidget(widget.id)
      }}
    >
      <div className="dashboard-widget__head">
        <div className="dashboard-widget__title">
          <button
            type="button"
            className="widget-drag-handle"
            title="드래그하여 이동"
            aria-label={`${widget.title} 이동`}
            draggable
            onDragStart={event => {
              event.dataTransfer.effectAllowed = 'move'
              onDragStart()
            }}
            onDragEnd={onDragEnd}
          >
            <GripIcon />
          </button>
          <h3>{widget.title}</h3>
        </div>
        <div className="dashboard-widget__actions">
          <button type="button" aria-label={`${widget.title} 정보`}>
            <InfoIcon />
          </button>
          <button type="button" onClick={onRemove} aria-label={`${widget.title} 삭제`}>
            <MoreIcon />
          </button>
        </div>
      </div>
      <div className="dashboard-widget__content">{renderWidgetContent(widget.type)}</div>
      {['right', 'bottom'].map(direction => (
        <button
          key={direction}
          type="button"
          className={`widget-resize-handle widget-resize-handle--${direction}`}
          onPointerDown={event => startResize(event, direction)}
          aria-label={`${widget.title} ${direction} 모서리 크기 조절`}
          title="드래그하여 크기 조절"
        />
      ))}
      {isResizing && (
        <div className="widget-size-badge">
          {widget.colSpan} x {widget.rowSpan}
        </div>
      )}
    </article>
  )
}

function renderWidgetContent(type) {
  switch (type) {
    case 'ai-chat':
      return <ChatBox />
    case 'ai-review':
      return <AIReviewWidget />
    case 'task-history':
      return <TaskHistoryWidget />
    case 'internal-investigation':
      return <InternalInvestigationWidget />
    case 'calendar':
      return <CalendarWidget />
    case 'education':
      return <EducationWidget />
    case 'notification':
      return <NotificationWidget />
    case 'language':
      return <LanguageSelect />
    default:
      return <p className="muted-text">위젯 콘텐츠를 준비 중입니다.</p>
  }
}

function AIReviewWidget() {
  return (
    <div className="review-widget">
      <div className="widget-leading-icon blue"><UploadIcon /></div>
      <h4>문서 AI 검토</h4>
      <p>규정 준수 검토를 위한 문서를 업로드하세요.</p>
      <button type="button" className="widget-primary-btn">파일 선택</button>
      <div className="widget-mini-stats">
        <span>검토 완료: 24건</span>
        <span>대기중: 3건</span>
      </div>
    </div>
  )
}

function TaskHistoryWidget() {
  const tasks = [
    { id: 1, title: '신규 대출 상품 검토', status: '완료', date: '2026.06.05', tone: 'green' },
    { id: 2, title: 'AML 정책 업데이트', status: '진행중', date: '2026.06.06', tone: 'blue' },
    { id: 3, title: '리스크 평가 보고서', status: '대기', date: '2026.06.07', tone: 'yellow' },
  ]

  return (
    <div className="compact-list widget-card-list">
      {tasks.map(task => (
        <div className="compact-list__item glass-list-item" key={task.id}>
          <div>
            <strong>{task.title}</strong>
            <span>{task.date}</span>
          </div>
          <span className={`status-dot ${task.tone}`}>{task.status}</span>
        </div>
      ))}
    </div>
  )
}

function InternalInvestigationWidget() {
  return (
    <div className="investigation-widget">
      <div className="widget-section-head">
        <div className="widget-leading-icon purple"><SearchIcon /></div>
        <div>
          <h4>내부 조사 지원</h4>
          <p>AI 기반 증거 분석</p>
        </div>
      </div>
      <div className="widget-stat-grid">
        <div>
          <span>진행중인 조사</span>
          <strong>3건</strong>
        </div>
        <div>
          <span>완료된 조사</span>
          <strong>18건</strong>
        </div>
      </div>
      <button type="button" className="widget-primary-btn purple">새 조사 시작</button>
    </div>
  )
}

function CalendarWidget() {
  return (
    <div className="timeline-list widget-card-list">
      {dummySchedules.map(schedule => (
        <div className="timeline-list__item glass-list-item" key={schedule.id}>
          <time>{schedule.date.slice(5)}</time>
          <div>
            <strong>{schedule.title}</strong>
            <span>{schedule.tag}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

function EducationWidget() {
  const courses = [
    { title: 'AML 기초과정', progress: 75 },
    { title: 'KYC 가이드라인', progress: 100 },
    { title: '내부통제 절차', progress: 30 },
  ]

  return (
    <div className="education-progress-list">
      <div className="widget-section-head">
        <div className="widget-leading-icon green"><EducationIcon /></div>
        <div>
          <h4>교육 자료</h4>
          <p>AI 생성 학습 콘텐츠</p>
        </div>
      </div>
      {courses.map(course => (
        <div className="education-progress-item" key={course.title}>
          <div>
            <strong>{course.title}</strong>
            <span>{course.progress}%</span>
          </div>
          <div className="progress-track"><span style={{ width: `${course.progress}%` }} /></div>
        </div>
      ))}
    </div>
  )
}

function NotificationWidget() {
  return (
    <div className="compact-list widget-card-list">
      {dummyNotifications.slice(0, 3).map(item => (
        <div className="compact-list__item glass-list-item" key={item.id}>
          <div>
            <strong>{item.title}</strong>
            <span>{item.desc}</span>
          </div>
          <small>{item.time}</small>
        </div>
      ))}
    </div>
  )
}

function LanguageSelect() {
  return (
    <label className="language-select">
      <span>검토 언어</span>
      <select defaultValue={SUPPORTED_LANGUAGES[0]}>
        {SUPPORTED_LANGUAGES.map(language => <option key={language}>{language}</option>)}
      </select>
    </label>
  )
}

function Metric({ label, value, tone }) {
  return (
    <div className={`metric metric--${tone}`}>
      <strong>{value}</strong>
      <span>{label}</span>
    </div>
  )
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value))
}

function PlusIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"><path d="M12 5v14M5 12h14" /></svg>
}

function ResetIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 3-6.7" /><path d="M3 4v5h5" /></svg>
}

function GripIcon() {
  return <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><circle cx="8" cy="5" r="1.6" /><circle cx="8" cy="12" r="1.6" /><circle cx="8" cy="19" r="1.6" /><circle cx="16" cy="5" r="1.6" /><circle cx="16" cy="12" r="1.6" /><circle cx="16" cy="19" r="1.6" /></svg>
}

function InfoIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M12 10v6" /><path d="M12 7h.01" /></svg>
}

function MoreIcon() {
  return <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="12" cy="19" r="1.8" /></svg>
}

function UploadIcon() {
  return <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 15V3" /><path d="m7 8 5-5 5 5" /><path d="M20 15v4a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-4" /></svg>
}

function EducationIcon() {
  return <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10 12 5 2 10l10 5 10-5Z" /><path d="M6 12v5c3 2 9 2 12 0v-5" /></svg>
}

function SearchIcon() {
  return <svg width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /><path d="M8 11h6" /></svg>
}
