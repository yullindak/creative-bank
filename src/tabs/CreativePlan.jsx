import { useState } from 'react'
import './CreativePlan.css'

// 우파루 오딧세이 페르소나 데이터
const PERSONA_DATA = {
  uparoo: [
    {
      id: 'collector',
      name: '수집형 전략가',
      emoji: '🔬',
      target: '18~34세 남녀',
      color: '#6366f1',
      usp: '가챠가 아닌 조합 — 600종 우파루, 1000+ 조합법',
      differentiator: '경쟁 게임은 가챠 중심 → 우파루만 "직접 조합해서 만드는" 수집',
      gameElements: ['우파루 크로스', '속성 조합(11종)', '희귀/기간한정 우파루', '도감 완성'],
      keywords: ['컬렉션', '레어템', '속성 조합', '도감', '크로스'],
      message: '"속성 조합으로 나만의 우파루 팀을 완성하세요!"',
      creativeDirection: ['조합 과정 클로즈업', '"이 조합 해봤어?" 궁금증 유발', '희귀 우파루 등장 이펙트'],
      cta: '지금 다운로드하고 속성 조합의 재미를 느껴보세요!',
      daExample: { mainCopy: '600종의 우파루, 전부 모을 수 있을까?', subCopy: '1,000가지 조합법으로 나만의 희귀 우파루를 발견하세요' },
      videoScenes: ['새로운 우파루 뽑기 등장', '물/불/바람 속성 조합 전투 연출', '희귀 캐릭터 확률 강조 + 이벤트', '다운로드 CTA'],
    },
    {
      id: 'grower',
      name: '성장형 도전가',
      emoji: '⚔️',
      target: '18~29세 남녀',
      color: '#f59e0b',
      usp: '3대3 속성 상성 전투 + 원정/경기장 랭킹',
      differentiator: 'SNG인데 전투 콘텐츠가 있음 — 캐주얼하면서도 전략적 깊이',
      gameElements: ['레벨업', '속성 상성표', '팀 편성', '원정 스테이지', '인연 시스템'],
      keywords: ['빠른 성장', '목표 지향', '레벨업', '랭킹', '상성 전투'],
      message: '"우파루를 키워 최강의 팀을 만들어보세요!"',
      creativeDirection: ['레벨업 전후 비교', '상성 역전 승리 순간', '랭킹 상승 연출'],
      cta: '지금 시작하고 당신의 팀을 완성하세요!',
      daExample: { mainCopy: '속성 상성을 이용한 역전의 한 수!', subCopy: '3대3 전략 전투로 최강 팀을 완성하세요' },
      videoScenes: ['캐릭터 레벨업 전후 비교', '강화된 팀의 전투 승리 장면', '랭킹 상승 연출', '다운로드 CTA'],
    },
    {
      id: 'healer',
      name: '힐링형 플레이어',
      emoji: '🌿',
      target: '25~34세 여성',
      color: '#10b981',
      usp: '하루 5분 서브게임 — 짧은 플레이타임, 과금 필수 아님',
      differentiator: '전작 우파루 마운틴의 아기자기한 감성 계승 + 부담 없는 SNG',
      gameElements: ['귀여운 우파루 모션', '자동 성장', '밭 수확', '아기 우파루(시간의 샘)'],
      keywords: ['힐링', '귀여움', '방치형', '서브게임', '무과금'],
      message: '"자동으로 성장하는 당신만의 힐링 마을!"',
      creativeDirection: ['귀여운 우파루 상호작용', '"오늘도 바쁜 하루" 공감 → 힐링 전환', '아기 우파루'],
      cta: '지금 다운로드하고 편안한 힐링을 경험하세요!',
      daExample: { mainCopy: '메인 게임에 지쳤다면?', subCopy: '하루 5분, 부담 없이 즐기는 힐링 서브게임' },
      videoScenes: ['방치형 자원 축적', '꾸미기로 완성된 마을', '귀여운 캐릭터 상호작용', '다운로드 CTA'],
    },
    {
      id: 'decorator',
      name: '꾸미기형 플레이어',
      emoji: '🏡',
      target: '20~30세 여성',
      color: '#ec4899',
      usp: '마을 꾸미기 자유도 — 서식지 배치, 장식, 마을 확장(5단계)',
      differentiator: '수집한 우파루가 마을에 실제로 살아움직임 — 수집과 꾸미기가 연결됨',
      gameElements: ['속성별 서식지(8종+)', '장식 아이템', '마을 확장', '이벤트 한정 장식', '건물 업그레이드'],
      keywords: ['마을 꾸미기', '서식지', '장식', '디자인', '무에서 유'],
      message: '"나만의 우파루 마을을 키워보세요!"',
      creativeDirection: ['레벨1 → 배속 성장 → 풍성한 고인물 마을', '자유 배치 시스템', '이벤트 한정 장식'],
      cta: '지금 다운로드해서 당신의 마을을 키워보세요!',
      daExample: { mainCopy: '텅 빈 마을이 이렇게 변합니다', subCopy: '서식지, 장식, 건물로 나만의 마을을 완성하세요' },
      videoScenes: ['레벨1 평범한 마을', '배속으로 마을이 풍성해지는 과정', '고인물 마을 완성샷', '다운로드 CTA'],
    },
  ],
}

export default function CreativePlan({ brainstormData, selectedApp }) {
  const [expandedId, setExpandedId] = useState(null)

  const appId = selectedApp?.id || ''
  const personas = PERSONA_DATA[appId] || []
  const isLinked = brainstormData?.isLoaded

  const toggleExpand = (id) => {
    setExpandedId(prev => prev === id ? null : id)
  }

  if (!selectedApp) {
    return (
      <div className="creative-plan">
        <div className="plan-empty">
          <div className="plan-empty-icon">🎯</div>
          <p><strong>앱을 먼저 선택해주세요</strong></p>
        </div>
      </div>
    )
  }

  if (personas.length === 0) {
    return (
      <div className="creative-plan">
        <div className="plan-header">
          <h2>소재 전략</h2>
        </div>
        <div className="plan-empty">
          <div className="plan-empty-icon">🎯</div>
          <p><strong>이 앱의 페르소나 데이터가 아직 준비되지 않았습니다</strong></p>
          <p>브레인스토밍 탭에서 앱 분석을 진행하면 기본 USP를 확인할 수 있습니다.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="creative-plan">
      <div className="plan-header">
        <h2>소재 전략</h2>
        <span className="persona-count">{personas.length}개 페르소나</span>
      </div>

      <div className="persona-grid">
        {personas.map((persona) => (
          <div
            key={persona.id}
            className={`persona-card ${expandedId === persona.id ? 'expanded' : ''}`}
            style={{ '--persona-color': persona.color }}
          >
            <div className="persona-card-header" onClick={() => toggleExpand(persona.id)}>
              <div className="persona-top-row">
                <span className="persona-emoji">{persona.emoji}</span>
                <div className="persona-title-area">
                  <h4 className="persona-name">{persona.name}</h4>
                  <span className="persona-target">{persona.target}</span>
                </div>
                <span className="expand-arrow">{expandedId === persona.id ? '▲' : '▼'}</span>
              </div>
              <div className="persona-usp">{persona.usp}</div>
              <div className="persona-keywords">
                {persona.keywords.map(kw => (
                  <span key={kw} className="persona-keyword">#{kw}</span>
                ))}
              </div>
            </div>

            {expandedId === persona.id && (
              <div className="persona-detail">
                <div className="detail-section">
                  <div className="detail-label">차별점</div>
                  <p className="detail-text">{persona.differentiator}</p>
                </div>

                <div className="detail-section">
                  <div className="detail-label">반응하는 게임 요소</div>
                  <div className="game-elements">
                    {persona.gameElements.map((el, i) => (
                      <span key={i} className="game-element">{el}</span>
                    ))}
                  </div>
                </div>

                <div className="detail-section">
                  <div className="detail-label">메시지 컨셉</div>
                  <p className="detail-message">{persona.message}</p>
                </div>

                <div className="detail-section">
                  <div className="detail-label">소재 방향</div>
                  <ul className="creative-directions">
                    {persona.creativeDirection.map((dir, i) => (
                      <li key={i}>{dir}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <div className="detail-label">CTA</div>
                  <p className="detail-cta">{persona.cta}</p>
                </div>

                <div className="example-previews">
                  <div className="example-preview">
                    <span className="example-badge da">DA</span>
                    <div className="preview-copy">
                      <div className="preview-main">{persona.daExample.mainCopy}</div>
                      <div className="preview-sub">{persona.daExample.subCopy}</div>
                    </div>
                  </div>
                  <div className="example-preview">
                    <span className="example-badge video">영상</span>
                    <div className="preview-scenes">
                      {persona.videoScenes.map((scene, i) => (
                        <span key={i} className="mini-scene">S{i+1}. {scene}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
