import { useState, useRef } from 'react'
import * as XLSX from 'xlsx'
import './ServiceDirection.css'

// 엑셀 파일을 파싱하여 대시보드 데이터로 변환
function parseExcel(workbook) {
  // 시트 1: 앱 기본정보
  const infoSheet = workbook.Sheets['앱 기본정보']
  const infoRows = XLSX.utils.sheet_to_json(infoSheet, { header: 1 })
  const getInfoValue = (label) => {
    const row = infoRows.find(r => r[0] === label)
    return row ? (row[1] || '') : ''
  }

  const summary = {
    name: getInfoValue('앱 이름'),
    oneLiner: getInfoValue('한 줄 설명'),
    genre: getInfoValue('장르'),
    target: getInfoValue('타겟'),
    links: {
      playStore: getInfoValue('Play Store 링크'),
      appStore: getInfoValue('App Store 링크'),
    },
  }
  const uspFlow = getInfoValue('USP 연결 흐름')

  // 시트 2: USP/RTB
  const uspSheet = workbook.Sheets['USP_RTB']
  const uspRows = XLSX.utils.sheet_to_json(uspSheet, { header: 1 })
  // 헤더 행 찾기
  const headerIdx = uspRows.findIndex(r => r[0] === 'USP 번호')
  const dataRows = headerIdx >= 0 ? uspRows.slice(headerIdx + 1) : []

  const colors = ['#ec4899', '#6366f1', '#10b981', '#f59e0b', '#8b5cf6']
  const emojis = ['🦕', '🔬', '🏡', '⚔️', '🎨']

  // 시트 3: 카피예시
  const copySheet = workbook.Sheets['카피예시']
  let copyMap = {}
  if (copySheet) {
    const copyRows = XLSX.utils.sheet_to_json(copySheet, { header: 1 })
    const copyHeaderIdx = copyRows.findIndex(r => r[0] === 'USP 이름')
    if (copyHeaderIdx >= 0) {
      copyRows.slice(copyHeaderIdx + 1).forEach(r => {
        if (r[0] && r[2]) {
          if (!copyMap[r[0]]) copyMap[r[0]] = []
          copyMap[r[0]].push({ type: r[1] || '', copy: r[2] })
        }
      })
    }
  }

  const usps = dataRows
    .filter(r => r[1]) // USP 이름이 있는 행만
    .map((r, i) => ({
      id: `usp-${i}`,
      title: r[1] || '',
      subtitle: r[2] || '',
      color: colors[i % colors.length],
      emoji: emojis[i % emojis.length],
      rtb: (r[6] || '').split('|').map(s => s.trim()).filter(Boolean),
      message: r[3] || '',
      visualCode: (r[7] || '').split('|').map(s => s.trim()).filter(Boolean),
      whatToSay: r[4] || '',
      howToSay: r[5] || '',
      copyExamples: copyMap[r[1]] || [],
    }))

  return { summary, uspFlow, usps }
}

const APP_DIRECTION = {
  uparoo: {
    summary: {
      name: '우파루 오딧세이',
      oneLiner: '600종 우파루를 직접 조합해서 수집하고, 나만의 마을을 꾸미는 힐링 수집 게임',
      genre: '컬렉션 SNG / 캐주얼 시뮬레이션',
      target: '18~34세 남녀, 힐링·캐주얼 게임 선호',
      links: {
        playStore: 'https://play.google.com/store/apps/details?id=com.nhn.wooparoo.kr',
        appStore: 'https://apps.apple.com/kr/app/%EC%9A%B0%ED%8C%8C%EB%A3%A8-%EC%98%A4%EB%94%A7%EC%84%B8%EC%9D%B4/id1668036690',
      },
    },
    // USP 간 관계 한 줄 요약
    uspFlow: '귀여운 캐릭터를 → 조합해서 수집하고 → 마을에 배치해서 꾸민다',
    // 앱 스크린샷 (플레이스토어 기반)
    screenshots: [
      { label: '마을', url: 'https://play-lh.googleusercontent.com/sEnergy_placeholder_village' },
      { label: '조합', url: 'https://play-lh.googleusercontent.com/sEnergy_placeholder_combine' },
      { label: '전투', url: 'https://play-lh.googleusercontent.com/sEnergy_placeholder_battle' },
    ],
    usps: [
      {
        id: 'character',
        title: '캐릭터',
        subtitle: '개성과 서사가 있는 600종 우파루',
        color: '#ec4899',
        emoji: '🦕',
        rtb: [
          '캐릭터마다 고유 설정/성격/외형',
          '속성별 다른 서식지와 생태',
          '시즌/이벤트 한정 캐릭터',
          '600종이라는 방대한 캐릭터 볼륨',
        ],
        message: '"논리는 없지만 귀여움은 확실한"',
        visualCode: [
          '캐릭터 단독 포커싱 + 모션/표정 연출',
          '캐릭터 서사 기반 상황극',
          '여러 캐릭터가 함께 등장하는 앙상블',
        ],
        whatToSay: '각 우파루에는 저마다의 성격과 이야기가 있다. 바나멍은 자기가 바나나인 줄 알고, 스켈은 강해 보이지만 겁쟁이고. 이 엉뚱한 캐릭터들을 알아갈수록 빠져드는 매력.',
        howToSay: '캐릭터 하나에 집중하는 숏폼. "이 친구 좀 이상한데?" 같은 호기심 유발 톤. 캐릭터 성격이 드러나는 짧은 에피소드형 연출. 병맛/엉뚱함이 후킹.',
        copyExamples: [
          { type: '후킹', copy: '요즘 게임들, 너무 어렵죠?' },
          { type: '캐릭터 소개', copy: '바나나일까요, 강아지일까요?' },
          { type: '반전', copy: '그는 본인이 개라는 사실을 평생 모를 예정입니다.' },
          { type: 'CTA', copy: '생각을 비우고 우파루를 채우세요' },
        ],
      },
      {
        id: 'collection',
        title: '컬렉션',
        subtitle: '조합해서 뭐가 나올지 모르는 재미',
        color: '#6366f1',
        emoji: '🔬',
        rtb: [
          '1,000+ 조합법',
          '11종 속성 시스템',
          '희귀/기간한정 우파루',
          '조합 결과의 랜덤성',
          '가챠가 아닌 직접 조합 — 경쟁사 대비 차별점',
        ],
        message: '"이 조합 해봤어?"',
        visualCode: [
          '조합 시도 → 결과 서프라이즈 연출',
          '도감 빈칸이 채워지는 순간',
          '희귀 우파루 등장 이펙트',
        ],
        whatToSay: '두 우파루를 넣으면 어떤 우파루가 나올지 모른다. 1,000개가 넘는 조합법 중 아직 발견 못한 게 있을 수 있다. "나만 모르는 조합법"이 존재할 수도.',
        howToSay: '"이 조합 해봤어?" 같은 도전/궁금증 유발 톤. 조합 결과를 끝까지 안 보여주는 서스펜스. 도감 빈칸이 하나씩 채워지는 성취감 연출.',
        copyExamples: [
          { type: '궁금증', copy: '이 두 마리를 합치면 뭐가 나올까?' },
          { type: '기대감', copy: '다음 우파루는 어떤 모습일까?' },
          { type: '서프라이즈', copy: '???종 우파루가 소환되었습니다!' },
          { type: 'CTA', copy: '지금 다운로드하고 속성 조합의 재미를 느껴보세요' },
        ],
      },
      {
        id: 'decorate',
        title: '꾸미기',
        subtitle: '내 손으로 만드는 나만의 마을',
        color: '#10b981',
        emoji: '🏡',
        rtb: [
          '5단계 마을 확장',
          '8종+ 속성별 서식지',
          '장식/건물 자유 배치',
          '농작물 재배',
          '이벤트 한정 장식 아이템',
        ],
        message: '"텅 빈 마을이 이렇게 변합니다"',
        visualCode: [
          'Before→After 마을 변화',
          '배속 타임랩스로 성장 과정',
          '풍성한 고인물 마을 완성샷',
        ],
        whatToSay: '처음엔 아무것도 없는 빈 땅에서 시작한다. 서식지를 짓고, 장식을 놓고, 우파루를 배치하면 나만의 마을이 만들어진다. 시간이 쌓일수록 풍성해지는 내 마을.',
        howToSay: '빈 마을→풍성한 마을의 극적 변화를 보여주는 Before/After. 배속 타임랩스로 성장 과정 압축. "와 이게 내 마을?" 같은 감탄형 톤.',
        copyExamples: [
          { type: '변화', copy: 'Day 1 vs Day 30, 같은 마을 맞나요?' },
          { type: '자유도', copy: '서식지도, 장식도, 배치도 전부 내 마음대로' },
          { type: '성취감', copy: '레벨 1 빈 마을이 이렇게 바뀝니다' },
          { type: 'CTA', copy: '지금 다운로드해서 당신의 마을을 키워보세요' },
        ],
      },
    ],
  },
}

const SD_STORAGE_KEY = 'cb-service-direction'

function loadSavedDirection() {
  try { return JSON.parse(localStorage.getItem(SD_STORAGE_KEY)) || {} }
  catch { return {} }
}

function saveSavedDirection(data) {
  localStorage.setItem(SD_STORAGE_KEY, JSON.stringify(data))
}

export default function ServiceDirection({ selectedApp }) {
  const [expandedId, setExpandedId] = useState(null)
  const [uploadedStore, setUploadedStore] = useState(loadSavedDirection)
  const fileRef = useRef(null)

  const isDesignView = new URLSearchParams(window.location.search).get('view') === 'design'

  // 현재 앱의 업로드 데이터
  const appId = selectedApp?.id || ''
  const uploadedData = uploadedStore[appId] || null

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (evt) => {
      const wb = XLSX.read(evt.target.result, { type: 'array' })
      const parsed = parseExcel(wb)
      // 메모리에 저장
      setUploadedStore(prev => ({ ...prev, [appId]: parsed }))
    }
    reader.readAsArrayBuffer(file)
    e.target.value = ''
  }

  const handleSaveToLocal = () => {
    saveSavedDirection(uploadedStore)
    alert('저장 완료! 새로고침해도 유지됩니다.')
  }

  const handleReset = () => {
    setUploadedStore(prev => {
      const next = { ...prev }
      delete next[appId]
      saveSavedDirection(next)
      return next
    })
    setExpandedId(null)
  }

  if (!selectedApp) {
    return (
      <div className="sd">
        <div className="sd-empty">
          <div className="sd-empty-icon">🧭</div>
          <h3>앱을 먼저 선택해주세요</h3>
          <p>우측 상단에서 앱을 선택하면 서비스 방향성을 확인할 수 있습니다.</p>
        </div>
      </div>
    )
  }

  // 업로드된 데이터 우선, 없으면 하드코딩 데이터
  const data = uploadedData || APP_DIRECTION[selectedApp.id]
  if (!data) {
    if (isDesignView) {
      return (
        <div className="sd">
          <div className="sd-empty">
            <div className="sd-empty-icon">🧭</div>
            <h3>아직 서비스 방향성이 등록되지 않았습니다</h3>
            <p>마케터에게 문의해주세요.</p>
          </div>
        </div>
      )
    }
    return (
      <div className="sd">
        <div className="sd-upload-prompt">
          <div className="sd-empty-icon">📄</div>
          <h3>서비스 방향성 엑셀을 업로드해주세요</h3>
          <p>템플릿에 맞춰 작성한 엑셀 파일을 업로드하면 대시보드가 자동 생성됩니다.</p>
          <input type="file" accept=".xlsx,.xls" ref={fileRef} onChange={handleFileUpload} style={{ display: 'none' }} />
          <div className="sd-upload-actions">
            <a href="/Creative_Bank_Template.xlsx" download className="sd-template-btn">엑셀 양식 다운로드</a>
            <button className="sd-upload-btn" onClick={() => fileRef.current?.click()}>엑셀 업로드</button>
          </div>
        </div>
      </div>
    )
  }

  const { summary, usps, uspFlow } = data
  const toggle = (id) => setExpandedId(prev => prev === id ? null : id)

  return (
    <div className="sd">
      {/* 업로드 컨트롤 */}
      <input type="file" accept=".xlsx,.xls" ref={fileRef} onChange={handleFileUpload} style={{ display: 'none' }} />

      {/* 앱 핵심 요약 */}
      <section className="sd-summary">
        <div className="sd-summary-top">
          <div>
            <h1 className="sd-app-name">{summary.name}</h1>
            <p className="sd-app-desc">{summary.oneLiner}</p>
          </div>
          <div className="sd-top-actions">
            {summary.links?.playStore && (
              <a href={summary.links.playStore} target="_blank" rel="noopener noreferrer" className="sd-store-link play">Play Store</a>
            )}
            {summary.links?.appStore && (
              <a href={summary.links.appStore} target="_blank" rel="noopener noreferrer" className="sd-store-link apple">App Store</a>
            )}
            {!isDesignView && (
              <>
                <a href="/Creative_Bank_Template.xlsx" download className="sd-action-btn template">양식 다운로드</a>
                <button className="sd-action-btn" onClick={() => fileRef.current?.click()}>
                  {uploadedData ? '다시 업로드' : '엑셀 업로드'}
                </button>
                {uploadedData && (
                  <>
                    <button className="sd-action-btn save" onClick={handleSaveToLocal}>저장</button>
                    <button className="sd-action-btn reset" onClick={handleReset}>초기화</button>
                  </>
                )}
              </>
            )}
          </div>
        </div>
        <div className="sd-meta-line">
          <span>{summary.genre}</span>
          <span className="sd-dot">·</span>
          <span>{summary.target}</span>
        </div>

        {/* 앱 체감 안내 */}
        <div className="sd-store-hint">
          이 앱이 처음이라면 위 스토어 링크에서 스크린샷과 설명을 먼저 확인하세요.
        </div>
      </section>

      {/* USP 흐름 */}
      {uspFlow && (
        <div className="sd-usp-flow">
          <div className="sd-flow-label">USP 연결 흐름</div>
          <div className="sd-flow-text">{uspFlow}</div>
        </div>
      )}

      {/* USP 카드 */}
      <div className="sd-section-title">USP / RTB</div>

      <div className="sd-usps">
        {usps.map((usp) => {
          const isOpen = expandedId === usp.id
          return (
            <div key={usp.id} className={`sd-usp ${isOpen ? 'open' : ''}`} style={{ '--uc': usp.color }}>
              {/* 접힌 헤더 */}
              <div className="sd-usp-header" onClick={() => toggle(usp.id)}>
                <div className="sd-usp-left">
                  <span className="sd-usp-emoji">{usp.emoji}</span>
                  <div>
                    <h3 className="sd-usp-title">{usp.title}</h3>
                    <span className="sd-usp-sub">{usp.subtitle}</span>
                  </div>
                </div>
                <div className="sd-usp-right">
                  <span className="sd-usp-msg">{usp.message}</span>
                  <span className="sd-usp-arrow">{isOpen ? '▲' : '▼'}</span>
                </div>
              </div>

              {/* 펼침 */}
              {isOpen && (
                <div className="sd-usp-detail">
                  {/* WHAT TO SAY / HOW TO SAY */}
                  <div className="sd-say-grid">
                    <div className="sd-say-card what">
                      <div className="sd-say-label">WHAT TO SAY</div>
                      <p>{usp.whatToSay}</p>
                    </div>
                    <div className="sd-say-card how">
                      <div className="sd-say-label">HOW TO SAY</div>
                      <p>{usp.howToSay}</p>
                    </div>
                  </div>

                  {/* 카피 예시 */}
                  {usp.copyExamples && (
                    <div className="sd-block">
                      <div className="sd-block-label">카피 예시</div>
                      <div className="sd-copy-examples">
                        {usp.copyExamples.map((ex, i) => (
                          <div key={i} className="sd-copy-item">
                            <span className="sd-copy-type">{ex.type}</span>
                            <span className="sd-copy-text">{ex.copy}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* RTB + 비주얼 코드 */}
                  <div className="sd-rtb-visual">
                    <div className="sd-block">
                      <div className="sd-block-label">RTB (신뢰 근거)</div>
                      <div className="sd-rtb-list">
                        {usp.rtb.map((item, i) => (
                          <span key={i} className="sd-rtb-item">{item}</span>
                        ))}
                      </div>
                    </div>
                    <div className="sd-block">
                      <div className="sd-block-label">비주얼 코드</div>
                      <ul className="sd-visual-list">
                        {usp.visualCode.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
