import { useState, useEffect } from 'react'
import './Storyboard.css'

const SIZES = [
  { id: '1080x1080', label: '1080 × 1080', w: 1080, h: 1080, ratio: '1:1' },
  { id: '1200x628', label: '1200 × 628', w: 1200, h: 628, ratio: '1.91:1' },
  { id: '720x1080', label: '720 × 1080', w: 720, h: 1080, ratio: '9:16' },
  { id: '1080x1350', label: '1080 × 1350', w: 1080, h: 1350, ratio: '4:5' },
]

const STORAGE_PREFIX = 'cb-storyboards-'

function loadBoards(appId) {
  if (!appId) return []
  try { return JSON.parse(localStorage.getItem(STORAGE_PREFIX + appId)) || [] }
  catch { return [] }
}
function saveBoards(appId, boards) {
  if (!appId) return
  localStorage.setItem(STORAGE_PREFIX + appId, JSON.stringify(boards))
}

const STATUSES = [
  { id: 'planning', label: '기획 중', color: '#6366f1', bg: '#eef2ff' },
  { id: 'requested', label: '제작 요청', color: '#f59e0b', bg: '#fffbeb' },
  { id: 'in-progress', label: '제작 중', color: '#3b82f6', bg: '#eff6ff' },
  { id: 'done', label: '제작 완료', color: '#10b981', bg: '#ecfdf5' },
]

function newVariant(num) {
  return { id: Date.now() + '-' + num, name: `시안 ${num}`, imageDesc: '', mainCopy: '', subCopy: '', cta: '' }
}

// ── 칸반 보드 ──
function KanbanBoard({ boards, onOpen, onCreate, onDelete, onStatusChange }) {
  const [dragId, setDragId] = useState(null)
  const [dragOver, setDragOver] = useState(null)

  const handleDragStart = (e, id) => {
    setDragId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e, statusId) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setDragOver(statusId)
  }

  const handleDrop = (e, statusId) => {
    e.preventDefault()
    if (dragId) onStatusChange(dragId, statusId)
    setDragId(null)
    setDragOver(null)
  }

  const handleDragEnd = () => {
    setDragId(null)
    setDragOver(null)
  }

  return (
    <div className="sb-kanban">
      <div className="sb-kanban-columns">
        {STATUSES.map(status => {
          const columnBoards = boards.filter(b => (b.status || 'planning') === status.id)
          const isOver = dragOver === status.id
          return (
            <div
              key={status.id}
              className={`sb-column ${isOver ? 'drag-over' : ''}`}
              onDragOver={e => handleDragOver(e, status.id)}
              onDragLeave={() => setDragOver(null)}
              onDrop={e => handleDrop(e, status.id)}
            >
              <div className="sb-column-header" style={{ '--col-color': status.color }}>
                <span className="sb-column-dot" style={{ background: status.color }} />
                <span className="sb-column-title">{status.label}</span>
                <span className="sb-column-count">{columnBoards.length}</span>
              </div>

              <div className="sb-column-body">
                {columnBoards.map(b => {
                  const size = SIZES.find(s => s.id === b.sizeId)
                  const date = new Date(b.createdAt)
                  const dateStr = `${date.getMonth() + 1}/${date.getDate()}`
                  return (
                    <div
                      key={b.id}
                      className={`sb-kanban-card ${dragId === b.id ? 'dragging' : ''}`}
                      draggable
                      onDragStart={e => handleDragStart(e, b.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => onOpen(b.id)}
                    >
                      <div className="sb-kc-top">
                        <span className="sb-kc-name">{b.name || '이름 없음'}</span>
                        <button className="sb-kc-del" onClick={e => { e.stopPropagation(); onDelete(b.id) }}>×</button>
                      </div>
                      <div className="sb-kc-meta">
                        <span className={`sb-kc-format ${b.format === 'video' ? 'video' : ''}`}>{b.format === 'video' ? '영상' : 'DA'}</span>
                        {b.format !== 'video' && <span className="sb-kc-size">{size?.ratio}</span>}
                        <span className="sb-kc-count">{b.format === 'video' ? `${b.scenes?.length || 0}씬` : `시안 ${b.variants?.length || 0}`}</span>
                        <span className="sb-kc-date">{dateStr}</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── 포맷 선택 ──
function FormatPicker({ onSelect, onCancel }) {
  return (
    <div className="sb-format-picker">
      <h2>소재 포맷 선택</h2>
      <div className="sb-format-grid">
        <button className="sb-format-card" onClick={() => onSelect('da')}>
          <span className="sb-format-icon">🖼️</span>
          <h3>DA (이미지)</h3>
          <p>정적 이미지 광고 소재</p>
        </button>
        <button className="sb-format-card" onClick={() => onSelect('video')}>
          <span className="sb-format-icon">🎬</span>
          <h3>영상</h3>
          <p>동영상 광고 소재</p>
        </button>
      </div>
      <button className="sb-cancel-btn" style={{ marginTop: 20 }} onClick={onCancel}>취소</button>
    </div>
  )
}

// ── DA 편집 ──
const LANG_OPTIONS = ['한국어', '영어', '일본어', '간체', '번체']
const SIZE_OPTIONS = ['16:9', '9:16', '4:5', '1:1']

function DAEditor({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [dueDate, setDueDate] = useState(initial?.dueDate || '')
  const [sizeId, setSizeId] = useState(initial?.sizeId || '1080x1080')
  const [selectedSizes, setSelectedSizes] = useState(initial?.selectedSizes || ['1:1'])
  const [selectedLangs, setSelectedLangs] = useState(initial?.selectedLangs || ['한국어'])
  const [memo, setMemo] = useState(initial?.memo || '')
  const [variants, setVariants] = useState(initial?.variants || [newVariant(1)])

  const toggleSize = (s) => setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  const toggleLang = (l) => setSelectedLangs(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l])

  const size = SIZES.find(s => s.id === sizeId)
  const previewScale = 240 / Math.max(size?.w || 1080, size?.h || 1080)
  const previewW = (size?.w || 1080) * previewScale
  const previewH = (size?.h || 1080) * previewScale

  const updateVariant = (id, field, value) => {
    setVariants(prev => prev.map(v => v.id === id ? { ...v, [field]: value } : v))
  }
  const addVariant = () => setVariants(prev => [...prev, newVariant(prev.length + 1)])
  const removeVariant = (id) => { if (variants.length > 1) setVariants(prev => prev.filter(v => v.id !== id)) }

  const handleSave = () => {
    onSave({
      id: initial?.id || Date.now().toString(),
      name: name || '이름 없음',
      format: 'da',
      sizeId,
      selectedSizes,
      selectedLangs,
      memo,
      dueDate,
      variants,
      createdAt: initial?.createdAt || new Date().toISOString(),
    })
  }

  return (
    <div className="sb-editor">
      <div className="sb-due-bar">
        <label className="sb-due-label">제작완료 요청일</label>
        <input type="date" className="sb-due-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
      </div>
      {/* 필요 사이즈 + 언어 체크박스 */}
      <div className="sb-spec-row">
        <div className="sb-spec-group">
          <span className="sb-spec-label">필요 사이즈</span>
          <div className="sb-checkboxes">
            {SIZE_OPTIONS.map(s => (
              <label key={s} className={`sb-checkbox ${selectedSizes.includes(s) ? 'checked' : ''}`}>
                <input type="checkbox" checked={selectedSizes.includes(s)} onChange={() => toggleSize(s)} />
                {s}
              </label>
            ))}
          </div>
        </div>
        <div className="sb-spec-group">
          <span className="sb-spec-label">언어</span>
          <div className="sb-checkboxes">
            {LANG_OPTIONS.map(l => (
              <label key={l} className={`sb-checkbox ${selectedLangs.includes(l) ? 'checked' : ''}`}>
                <input type="checkbox" checked={selectedLangs.includes(l)} onChange={() => toggleLang(l)} />
                {l}
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* 프리뷰용 사이즈 선택 */}
      <div className="sb-size-bar">
        <span className="sb-size-label">프리뷰</span>
        {SIZES.map(s => (
          <button key={s.id} className={`sb-size-btn ${sizeId === s.id ? 'active' : ''}`} onClick={() => setSizeId(s.id)}>
            {s.ratio}<span className="sb-size-px">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="sb-variants">
        {variants.map((v, idx) => (
          <div key={v.id} className="sb-variant">
            <div className="sb-variant-header">
              {idx === 0 ? (
                <input className="sb-name-inline" placeholder="스토리보드 이름을 입력하세요" value={name} onChange={e => setName(e.target.value)} autoFocus />
              ) : (
                <span className="sb-variant-num">시안 {idx + 1}</span>
              )}
              {variants.length > 1 && <button className="sb-remove-btn" onClick={() => removeVariant(v.id)}>삭제</button>}
            </div>
            <div className="sb-variant-body">
              <div className="sb-preview-area">
                <div className="sb-preview-frame" style={{ width: previewW, height: previewH }}>
                  <div className="sb-preview-content">
                    {v.imageDesc ? <div className="sb-pv-image">{v.imageDesc}</div> : <div className="sb-pv-placeholder">이미지 설명을<br />입력하세요</div>}
                    {v.mainCopy && <div className="sb-pv-main">{v.mainCopy}</div>}
                    {v.subCopy && <div className="sb-pv-sub">{v.subCopy}</div>}
                    {v.cta && <div className="sb-pv-cta">{v.cta}</div>}
                  </div>
                </div>
                <div className="sb-preview-size">{size?.label} ({size?.ratio})</div>
              </div>
              <div className="sb-input-area">
                <div className="sb-field"><label>이미지 설명</label><textarea placeholder="어떤 이미지가 들어가야 하는지 설명하세요" value={v.imageDesc} onChange={e => updateVariant(v.id, 'imageDesc', e.target.value)} rows={3} /></div>
                <div className="sb-field"><label>메인 카피</label><input placeholder="예: 논리는 없지만 귀여움은 확실한" value={v.mainCopy} onChange={e => updateVariant(v.id, 'mainCopy', e.target.value)} /></div>
                <div className="sb-field"><label>서브 카피</label><input placeholder="예: 이런 친구들이 수백 마리나 더 있습니다" value={v.subCopy} onChange={e => updateVariant(v.id, 'subCopy', e.target.value)} /></div>
                <div className="sb-field"><label>CTA</label><input placeholder="예: 지금 다운로드" value={v.cta} onChange={e => updateVariant(v.id, 'cta', e.target.value)} /></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 메모 */}
      <div className="sb-memo-section">
        <label className="sb-memo-label">메모 / 비고</label>
        <textarea
          className="sb-memo-input"
          placeholder="제작 참고사항, 특이사항 등을 메모하세요"
          value={memo}
          onChange={e => setMemo(e.target.value)}
          rows={3}
        />
      </div>

      <div className="sb-bottom-actions">
        <button className="sb-add-variant-btn" onClick={addVariant}>+ 시안 추가</button>
        <div className="sb-bottom-right">
          <button className="sb-cancel-btn" onClick={onCancel}>취소</button>
          <button className="sb-save-btn" onClick={handleSave}>저장하기</button>
        </div>
      </div>
    </div>
  )
}

// ── 영상 편집 ──
function newScene(num) {
  return { id: Date.now() + '-s' + num, label: `S${num}`, copy: '', direction: '', character: '' }
}

function VideoEditor({ initial, onSave, onCancel }) {
  const [name, setName] = useState(initial?.name || '')
  const [dueDate, setDueDate] = useState(initial?.dueDate || '')
  const [scenes, setScenes] = useState(initial?.scenes || [
    { ...newScene(1), label: 'S1', copy: '', direction: '', character: '' },
    { ...newScene(2), label: 'S2', copy: '', direction: '', character: '' },
    { ...newScene(3), label: 'S3', copy: '', direction: '', character: '' },
    { ...newScene(4), label: 'S4', copy: '', direction: '', character: '' },
  ])

  const updateScene = (id, field, value) => {
    setScenes(prev => prev.map(s => s.id === id ? { ...s, [field]: value } : s))
  }
  const addScene = () => setScenes(prev => [...prev, newScene(prev.length + 1)])
  const removeScene = (id) => { if (scenes.length > 1) setScenes(prev => prev.filter(s => s.id !== id)) }

  const handleSave = () => {
    onSave({
      id: initial?.id || Date.now().toString(),
      name: name || '이름 없음',
      format: 'video',
      dueDate,
      scenes,
      createdAt: initial?.createdAt || new Date().toISOString(),
    })
  }

  return (
    <div className="sb-editor">
      <div className="sb-due-bar">
        <label className="sb-due-label">제작완료 요청일</label>
        <input type="date" className="sb-due-input" value={dueDate} onChange={e => setDueDate(e.target.value)} />
      </div>
      <div className="sb-video-scenes">
        {scenes.map((s, idx) => (
          <div key={s.id} className="sb-scene">
            <div className="sb-scene-header">
              {idx === 0 ? (
                <input className="sb-name-inline" placeholder="스토리보드 이름을 입력하세요" value={name} onChange={e => setName(e.target.value)} autoFocus />
              ) : (
                <span className="sb-scene-num">S{idx + 1}</span>
              )}
              {scenes.length > 1 && <button className="sb-remove-btn" onClick={() => removeScene(s.id)}>삭제</button>}
            </div>
            <div className="sb-scene-body">
              <div className="sb-scene-col">
                <div className="sb-field"><label>카피 / 나레이션</label><textarea placeholder="예: 요즘 게임들, 너무 어렵죠?" value={s.copy} onChange={e => updateScene(s.id, 'copy', e.target.value)} rows={2} /></div>
              </div>
              <div className="sb-scene-col">
                <div className="sb-field"><label>영상 연출</label><textarea placeholder="예: 쎈 우파루 캐릭터가 나오고 FAIL 문구가 나옴" value={s.direction} onChange={e => updateScene(s.id, 'direction', e.target.value)} rows={2} /></div>
              </div>
              <div className="sb-scene-col narrow">
                <div className="sb-field"><label>캐릭터 / 비고</label><input placeholder="예: 스켈, 바나멍" value={s.character} onChange={e => updateScene(s.id, 'character', e.target.value)} /></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="sb-bottom-actions">
        <button className="sb-add-variant-btn" onClick={addScene}>+ 씬 추가</button>
        <div className="sb-bottom-right">
          <button className="sb-cancel-btn" onClick={onCancel}>취소</button>
          <button className="sb-save-btn" onClick={handleSave}>저장하기</button>
        </div>
      </div>
    </div>
  )
}

// ── 통합 에디터 라우터 ──
function BoardEditor({ initial, onSave, onCancel }) {
  const [format, setFormat] = useState(initial?.format || null)

  if (!format) {
    return <FormatPicker onSelect={setFormat} onCancel={onCancel} />
  }

  if (format === 'video') {
    return <VideoEditor initial={initial} onSave={onSave} onCancel={onCancel} />
  }

  return <DAEditor initial={initial} onSave={onSave} onCancel={onCancel} />
}

// ── 시트 뷰 ──
function SheetView({ boards, onOpen, onCreate, onDelete, onStatusChange, onReorder }) {
  const [sortBy, setSortBy] = useState('dueDate')
  const [dragIdx, setDragIdx] = useState(null)

  const sorted = [...boards].sort((a, b) => {
    if (sortBy === 'status') {
      const order = STATUSES.map(s => s.id)
      return order.indexOf(a.status || 'planning') - order.indexOf(b.status || 'planning')
    }
    if (sortBy === 'dueDate') {
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return new Date(a.dueDate) - new Date(b.dueDate)
    }
    if (sortBy === 'format') {
      return (a.format || '').localeCompare(b.format || '')
    }
    return new Date(b.createdAt) - new Date(a.createdAt)
  })

  const fmtDate = (iso) => {
    if (!iso) return '-'
    const d = new Date(iso)
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  const fmtDueDate = (dateStr) => {
    if (!dateStr) return '-'
    const d = new Date(dateStr)
    return `${d.getMonth() + 1}/${d.getDate()}`
  }

  const handleRowDragStart = (e, idx) => {
    setDragIdx(idx)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleRowDrop = (e, targetIdx) => {
    e.preventDefault()
    if (dragIdx === null || dragIdx === targetIdx) return
    const reordered = [...boards]
    const [moved] = reordered.splice(dragIdx, 1)
    reordered.splice(targetIdx, 0, moved)
    onReorder(reordered)
    setDragIdx(null)
  }

  return (
    <div className="sb-sheet">
      <table className="sb-table">
        <thead>
          <tr>
            <th style={{ width: 30 }}></th>
            <th className="sb-th-name">이름</th>
            <th onClick={() => setSortBy('format')} style={{ cursor: 'pointer' }}>포맷 {sortBy === 'format' ? '▼' : ''}</th>
            <th>시안/씬</th>
            <th onClick={() => setSortBy('status')} style={{ cursor: 'pointer' }}>상태 {sortBy === 'status' ? '▼' : ''}</th>
            <th onClick={() => setSortBy('dueDate')} style={{ cursor: 'pointer' }}>요청일 {sortBy === 'dueDate' ? '▼' : ''}</th>
            <th onClick={() => setSortBy('createdAt')} style={{ cursor: 'pointer' }}>생성일 {sortBy === 'createdAt' ? '▼' : ''}</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((b, idx) => {
            const status = STATUSES.find(s => s.id === (b.status || 'planning')) || STATUSES[0]
            const size = SIZES.find(s => s.id === b.sizeId)
            return (
              <tr
                key={b.id}
                className={`sb-row ${dragIdx === idx ? 'dragging' : ''}`}
                draggable
                onDragStart={e => handleRowDragStart(e, idx)}
                onDragOver={e => e.preventDefault()}
                onDrop={e => handleRowDrop(e, idx)}
                onDragEnd={() => setDragIdx(null)}
                onClick={() => onOpen(b.id)}
              >
                <td className="sb-td-grip">⠿</td>
                <td className="sb-td-name">{b.name || '이름 없음'}</td>
                <td>
                  <span className={`sb-kc-format ${b.format === 'video' ? 'video' : ''}`}>
                    {b.format === 'video' ? '영상' : 'DA'}
                  </span>
                  {b.format !== 'video' && size && <span className="sb-td-size">{size.ratio}</span>}
                </td>
                <td>{b.format === 'video' ? `${b.scenes?.length || 0}씬` : `${b.variants?.length || 0}개`}</td>
                <td>
                  <select
                    className="sb-status-select"
                    style={{ color: status.color, background: status.bg }}
                    value={b.status || 'planning'}
                    onClick={e => e.stopPropagation()}
                    onChange={e => onStatusChange(b.id, e.target.value)}
                  >
                    {STATUSES.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </td>
                <td className={`sb-td-due ${b.dueDate ? '' : 'empty'}`}>{fmtDueDate(b.dueDate)}</td>
                <td className="sb-td-date">{fmtDate(b.createdAt)}</td>
                <td>
                  <button className="sb-row-del" onClick={e => { e.stopPropagation(); onDelete(b.id) }}>삭제</button>
                </td>
              </tr>
            )
          })}
          {sorted.length === 0 && (
            <tr><td colSpan={8} className="sb-table-empty">스토리보드가 없습니다</td></tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

// ── 메인 ──
export default function Storyboard({ selectedApp }) {
  const appId = selectedApp?.id || ''
  const [boards, setBoards] = useState(() => loadBoards(appId))
  const [mode, setMode] = useState('list')
  const [editingId, setEditingId] = useState(null)
  const [viewType, setViewType] = useState('kanban')

  // 앱 전환 시 해당 앱의 보드 로드
  useEffect(() => {
    setBoards(loadBoards(appId))
    setMode('list')
    setEditingId(null)
  }, [appId])

  useEffect(() => { saveBoards(appId, boards) }, [appId, boards])

  const handleCreate = () => { setMode('new'); setEditingId(null) }
  const handleOpen = (id) => { setMode('edit'); setEditingId(id) }
  const handleSave = (board) => {
    if (mode === 'new') setBoards(prev => [board, ...prev])
    else setBoards(prev => prev.map(b => b.id === board.id ? board : b))
    setMode('list'); setEditingId(null)
  }
  const handleCancel = () => { setMode('list'); setEditingId(null) }
  const handleDelete = (id) => { setBoards(prev => prev.filter(b => b.id !== id)) }
  const handleStatusChange = (id, status) => { setBoards(prev => prev.map(b => b.id === id ? { ...b, status } : b)) }
  const handleReorder = (newBoards) => { setBoards(newBoards) }

  if (!selectedApp) {
    return (
      <div className="sb">
        <div className="sb-list-empty">
          <div className="sb-list-empty-icon">🎬</div>
          <h3>앱을 먼저 선택해주세요</h3>
          <p>우측 상단에서 앱을 선택하면 해당 앱의 스토리보드를 관리할 수 있습니다.</p>
        </div>
      </div>
    )
  }

  if (mode === 'new') return <div className="sb"><BoardEditor initial={null} onSave={handleSave} onCancel={handleCancel} /></div>

  if (mode === 'edit' && editingId) {
    const board = boards.find(b => b.id === editingId)
    if (!board) { setMode('list'); return null }
    return <div className="sb"><BoardEditor initial={board} onSave={handleSave} onCancel={handleCancel} /></div>
  }

  return (
    <div className="sb">
      <div className="sb-list-header">
        <h2>스토리보드</h2>
        <div className="sb-header-right">
          <div className="sb-view-toggle">
            <button className={`sb-view-btn ${viewType === 'kanban' ? 'active' : ''}`} onClick={() => setViewType('kanban')}>보드</button>
            <button className={`sb-view-btn ${viewType === 'sheet' ? 'active' : ''}`} onClick={() => setViewType('sheet')}>시트</button>
          </div>
          <button className="sb-create-btn" onClick={handleCreate}>+ 새 스토리보드</button>
        </div>
      </div>

      {viewType === 'kanban' ? (
        <KanbanBoard boards={boards} onOpen={handleOpen} onCreate={handleCreate} onDelete={handleDelete} onStatusChange={handleStatusChange} />
      ) : (
        <SheetView boards={boards} onOpen={handleOpen} onCreate={handleCreate} onDelete={handleDelete} onStatusChange={handleStatusChange} onReorder={handleReorder} />
      )}
    </div>
  )
}
