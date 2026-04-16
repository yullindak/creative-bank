import { useState, useEffect } from 'react'
import './Brainstorming.css'

// AI 리서치 데이터 (앱별 구조화)
const AI_RESEARCH = {
  uparoo: {
    genre: {
      items: [
        { label: '장르', text: '컬렉션 SNG (소셜 네트워크 게임) / 캐주얼 시뮬레이션' },
        { label: '개발', text: '하이브로 (개발) / NHN (퍼블리싱)' },
        { label: '출시', text: '2023년 10월 5일' },
      ],
      sections: [
        {
          title: '핵심 메커니즘',
          bullets: [
            '우파루 수집(컬렉션): 1,000개 이상의 조합법으로 600여 종 우파루 소환/수집이 핵심 루프',
            '마을 꾸미기: 유니크한 서식지와 장식물로 나만의 마을 건설',
            '3대3 턴제 전투: 전작 대비 추가된 요소 (원정 + 경기장)',
            'SNG 특성: 하루 플레이타임 짧음, 과금 필수 아닌 구조 → 서브 게임에 적합',
          ],
        },
        {
          title: '타겟 유저',
          bullets: [
            "1차: 전작 '우파루 마운틴'(1,100만 DL) 추억하는 20~40대 기존 팬층",
            '2차: 힐링/캐주얼 게임 선호 유저, 짧은 플레이타임의 서브 게임 원하는 유저',
          ],
        },
      ],
    },
    usp: [
      { title: '노스탤지어 + 힐링 감성', points: ['전작 우파루 마운틴의 아기자기한 감성 계승 + 전투/성장 요소 추가', '학창 시절 추억 자극하는 IP 파워가 가장 강력한 차별점'] },
      { title: '방대한 조합 시스템', points: ['600여 종 우파루, 1,000개 이상 조합법', '조합 시 어떤 우파루가 나올지 모르는 기대감 → 수집 욕구 자극'] },
      { title: '부담 없는 캐주얼 플레이', points: ['하루 플레이타임 매우 짧고, 과금 필수 아님', '메인 게임 외 서브 게임으로 부담 없이 즐길 수 있는 포지셔닝'] },
      { title: '초기 시장 성과', points: ['출시 2주 만에 앱스토어 인기게임 1위, 캐주얼 매출 1위', '구글플레이 시뮬레이션 매출 1위, iOS 매출 5위'] },
    ],
    positive: [
      { keyword: '원작 감성', text: '"우파루 마운틴의 부활", "예전 분위기 그대로 아기자기하게 즐길 수 있다"' },
      { keyword: '힐링', text: '여유롭게 캐릭터 수집하고 마을 꾸며나가는 힐링 요소 호평' },
      { keyword: '낮은 과금', text: '초기 과금 요소 필수 아니어서 좋은 서브 게임으로 인식' },
      { keyword: '높은 지표', text: '1일차 잔존율 평균 65% 이상, 매출/DAU 지속 우상향' },
      { keyword: '접근성', text: '틈틈이 즐기기 좋은 서브 게임으로 추천 사례 다수' },
    ],
    negative: [
      { category: '콘텐츠/게임성', items: [
        { keyword: '전투', text: '단순하고 속도 느림, "구시대적" 평가. SNG 성격 강화 요구' },
        { keyword: '그래픽', text: '원작 충실하지만 최신 게임답지 않다는 반응' },
        { keyword: '진행 속도', text: '서식지 완성 최소 20분, 초반부터 1시간+ 업그레이드 대기' },
        { keyword: '콘텐츠', text: '스토리와 대전모드 외 할 것이 부족하다는 평가' },
      ]},
      { category: '운영 이슈 (2024년)', items: [
        { keyword: '기만 논란', text: '0.5주년 성격 시스템을 "꾸미기"로 설명했으나 실제 스탯 변동' },
        { keyword: '과금 심화', text: '신규 재화 수급처가 유료 패키지에 극편중' },
        { keyword: '버그', text: '업데이트마다 버그, 연장/추가 점검 일상화' },
        { keyword: '유저 이탈', text: '친구 목록 접속 중단, 길드 해체, 커뮤니티 급감' },
      ]},
    ],
  },
  'hangame-poker': {
    genre: {
      items: [
        { label: '장르', text: '모바일 웹보드 (포커 + 카지노)' },
        { label: '개발/퍼블리싱', text: 'NHN' },
        { label: '평점', text: '앱스토어 4.5/5 (14,250+ 리뷰)' },
      ],
      sections: [
        { title: '핵심 메커니즘', bullets: [
          '세븐포커, 로우바둑이, 텍사스홀덤, 하이로우 등 다종목 포커',
          '카지노: 블랙잭, 룰렛, 다이사이, 빅휠, 슬롯, 바카라',
          '모션 아바타 시스템, 럭키랜드 카지노 섹션',
        ]},
        { title: '타겟 유저', bullets: [
          '20~50대 포커/카지노 게임 선호 유저',
          '간편하게 다양한 카드 게임을 즐기고 싶은 유저',
        ]},
      ],
    },
    usp: [
      { title: '다종목 올인원', points: ['포커 + 카지노까지 한 앱에서 다양한 게임 플레이', '세븐포커, 바둑이, 홀덤, 하이로우 + 블랙잭, 룰렛 등'] },
      { title: 'RNG 공정성 인증', points: ['글로벌 공인인증기관 RNG 인증 획득', '공정한 패 분배 시스템 보장'] },
      { title: '아바타 커스터마이징', points: ['고퀄리티 모션 아바타로 개성 표현', '카지노 분위기의 세련된 비주얼'] },
      { title: '풍부한 보상 시스템', points: ['출석 보상, 잭팟 슬롯, 실버/골드/로열 구독 패스', '매일 접속 보너스로 무료 플레이 가능'] },
    ],
    positive: [
      { keyword: '다양한 게임', text: '포커부터 카지노까지 다양한 종목을 한 앱에서 즐길 수 있어 편리' },
      { keyword: '직관적 UI', text: '모바일에 최적화된 깔끔한 인터페이스와 조작감' },
      { keyword: '출석 보상', text: '매일 접속 보너스, 잭팟 슬롯 등 무료 혜택이 풍부' },
      { keyword: '아바타', text: '고퀄리티 모션 아바타로 개성 표현 가능' },
    ],
    negative: [
      { category: '게임 이슈', items: [
        { keyword: '패 조작 의심', text: '좋은 패에도 지속적으로 지는 경험, 불공정 패 분배 의심' },
        { keyword: '과금 유도', text: '머니 소진 후 현금 결제를 유도하는 구조 불만' },
        { keyword: 'UI 변경', text: '업데이트 후 UI가 복잡해져 베팅에 집중하기 어렵다는 의견' },
      ]},
    ],
  },
  'hangame-sutda': {
    genre: {
      items: [
        { label: '장르', text: '모바일 웹보드 (한국 전통 화투 카드게임)' },
        { label: '개발/퍼블리싱', text: 'NHN' },
        { label: '평점', text: '앱스토어 4.3/5 (30,000+ 리뷰)' },
      ],
      sections: [
        { title: '핵심 메커니즘', bullets: [
          '2장 섯다, 3장 섯다, 홀덤 섯다, 베짱 섯다, 맞고, 섯둑이 등 다양한 모드',
          '주간 토너먼트 (금~일 오후 9시)',
          '친구 대전: 닉네임 검색, 음성 채팅 지원',
        ]},
        { title: '타겟 유저', bullets: [
          '30~50대 전통 화투 게임 선호 유저',
          '섯다 경쟁형 플레이를 즐기는 유저',
        ]},
      ],
    },
    usp: [
      { title: '모바일 섯다 점유율 1위', points: ['국내 최대 섯다 유저 풀 보유', '한게임 브랜드 파워와 오랜 서비스 이력'] },
      { title: '독창적 변형 모드', points: ['홀덤 섯다: 홀덤 커뮤니티 카드 + 섯다 결합', '섯둑이 등 기존에 없던 새로운 게임 모드'] },
      { title: '주간 토너먼트', points: ['매주 금~일 경쟁형 토너먼트 운영', '보상 획득 + 랭킹 경쟁 재미'] },
      { title: '크로스 게임 재화', points: ['한게임 포커와 머니 호환', '하나의 경제 시스템으로 두 게임 플레이'] },
    ],
    positive: [
      { keyword: '원조 신뢰감', text: '한게임 브랜드 파워와 오랜 서비스 이력에 대한 안정감' },
      { keyword: '다양한 모드', text: '2장/3장 섯다부터 홀덤섯다까지 변형 모드가 풍부' },
      { keyword: '토너먼트', text: '주말 토너먼트로 경쟁의 재미와 보상 획득 가능' },
      { keyword: '친구 대전', text: '닉네임 검색으로 지인과 바로 대전 가능, 음성 채팅 지원' },
    ],
    negative: [
      { category: '유저 불만', items: [
        { keyword: '패 조작 의심', text: '과금 유저에게 유리한 패가 돌아간다는 강한 불만 (가장 빈번)' },
        { keyword: '과금 유도', text: '머니 소진 시 충전을 유도하는 게임 경제 설계 비판' },
        { keyword: '닉네임 변경 불가', text: '한번 설정한 닉네임을 변경할 수 없어 불편' },
        { keyword: '봇 의심', text: '비정상적 닉네임의 플레이어들이 봇/핵 사용자로 의심' },
      ]},
    ],
  },
  'hangame-poker-classic': {
    genre: {
      items: [
        { label: '장르', text: '모바일/PC 크로스플랫폼 웹보드' },
        { label: '개발/퍼블리싱', text: 'NHN' },
        { label: '평점', text: '앱스토어 4.6/5 (2,600+ 리뷰)' },
      ],
      sections: [
        { title: '핵심 메커니즘', bullets: [
          '7종 포커: 세븐포커, 로우바둑이, 하이로우, 라스베가스홀덤, 맞포커, 파티훌라, LA섯다',
          '카지노: 블랙잭, 바카라, 비디오포커, 룰렛',
          'PC-모바일 완전 연동 (동일 게임룸 매칭)',
        ]},
        { title: '타겟 유저', bullets: [
          'PC 한게임포커 기존 유저층 (20~50대)',
          'PC와 모바일을 오가며 플레이하고 싶은 유저',
        ]},
      ],
    },
    usp: [
      { title: 'PC-모바일 완전 연동', points: ['PC 유저와 동일 게임룸에서 매칭', '집에서는 PC, 외출 시 모바일로 이어서 플레이'] },
      { title: '20년 전통 정통 계승', points: ['PC 한게임포커의 정통을 계승', '가장 많은 포커 종목 (7종)'] },
      { title: '한게임포커 챔피언십(HPC)', points: ['분기별 대규모 토너먼트 운영', '경쟁심 자극 + 대규모 보상'] },
      { title: '길드 시스템', points: ['길드전, 챌린지 배틀 등 소셜 콘텐츠 풍부', '플러스 회원제, 마일리지 등 PC 혜택 그대로 적용'] },
    ],
    positive: [
      { keyword: 'PC 연동', text: '집에서는 PC, 외출 시 모바일로 이어서 플레이 가능' },
      { keyword: '종목 다양성', text: '7종의 포커 + 카지노까지 압도적인 게임 종류' },
      { keyword: '깔끔한 그래픽', text: '카지노 느낌의 깔끔하고 세련된 비주얼' },
      { keyword: '길드 시스템', text: '길드전, 챌린지 배틀 등 소셜 콘텐츠 풍부' },
    ],
    negative: [
      { category: '기술/운영 이슈', items: [
        { keyword: '백그라운드 미지원', text: '문자/영상 확인 시 게임 연결 끊김 — 치명적 불편' },
        { keyword: '점검 시간', text: '정기 업데이트 연장으로 플레이 시간 제한' },
        { keyword: '머니 호환 불가', text: '한게임 포커(오리지널)와 머니 교환/호환 불가' },
      ]},
    ],
  },
  'hangame-holdem': {
    genre: {
      items: [
        { label: '장르', text: '모바일 웹보드 (한국식 5인 텍사스홀덤)' },
        { label: '개발/퍼블리싱', text: 'NHN' },
        { label: '출시', text: '2025년 9월 (신규)' },
      ],
      sections: [
        { title: '핵심 메커니즘', bullets: [
          '5인 테이블, 원터치 베팅 방식',
          '카지노 테이블 스타일 UI (PC판과 차별화)',
          '길드전, 챌린지 배틀, 미니게임',
        ]},
        { title: '타겟 유저', bullets: [
          'MZ세대 캐주얼 홀덤 유저',
          '빠른 게임 진행을 선호하는 유저',
        ]},
      ],
    },
    usp: [
      { title: '원터치 베팅', points: ['빠르고 간편한 베팅으로 캐주얼 유저 접근성 극대화', '여러 판을 빠르게 플레이 가능'] },
      { title: '카지노 테이블 UI', points: ['기존 PC 포커 UI와 완전히 차별화된 비주얼', '카지노 분위기의 몰입감 있는 테이블 디자인'] },
      { title: '5인 테이블 구성', points: ['빠른 게임 전개와 심리전의 균형', '짧은 대기 시간'] },
      { title: 'MZ세대 타겟', points: ['젊은 유저층을 겨냥한 캐주얼+긴장감 있는 홀덤', '출시 초반부터 MZ세대 긍정적 반응'] },
    ],
    positive: [
      { keyword: '빠른 속도', text: '원터치 베팅으로 빠르게 여러 판 플레이 가능' },
      { keyword: '세련된 UI', text: '카지노 느낌의 테이블 디자인이 몰입감 제공' },
      { keyword: '접근성', text: '홀덤 입문자도 쉽게 시작할 수 있는 캐주얼 환경' },
      { keyword: 'MZ 호응', text: '출시 초반부터 MZ세대 유저층의 긍정적 반응' },
    ],
    negative: [
      { category: '게임성/운영', items: [
        { keyword: '운 의존', text: '커뮤니티에서 "운빨 게임"이라는 평가 존재' },
        { keyword: '전략 깊이 부족', text: '진지한 홀덤 플레이어 입장에서 전략적 깊이 부족' },
        { keyword: '유저 풀 부족', text: '신생 앱이라 유저 풀이 아직 크지 않아 매칭 대기 발생' },
        { keyword: '룰 혼란', text: '백스트레이트 룰 등 한국식 룰 변경 후 혼란 야기' },
      ]},
    ],
  },
  'hangame-royal-holdem': {
    genre: {
      items: [
        { label: '장르', text: '모바일 웹보드 (정통 텍사스홀덤/토너먼트)' },
        { label: '개발/퍼블리싱', text: 'NHN' },
        { label: '비고', text: '2023년 더블에이포커로 출시 → 2025년 9월 로얄홀덤으로 리브랜딩' },
      ],
      sections: [
        { title: '핵심 메커니즘', bullets: [
          'TDA(Tournament Directors Association) 정통 룰 기반',
          '토너먼트, 홀덤, 오마하, 싯앤고 등 다양한 모드',
          '개런티드 토너먼트, 바운티 헌터 토너먼트',
        ]},
        { title: '타겟 유저', bullets: [
          '정통 홀덤 경험을 원하는 중급~상급 유저',
          '토너먼트 경쟁형 플레이를 즐기는 유저',
        ]},
      ],
    },
    usp: [
      { title: 'TDA 정통 룰', points: ['글로벌 스탠다드 TDA 룰 기반의 정통 홀덤 경험', '실력 중심 플레이'] },
      { title: '다양한 토너먼트', points: ['개런티드, 바운티헌터, 싯앤고 등 다채로운 대회 형식', '경쟁 콘텐츠 특화'] },
      { title: '오마하 지원', points: ['텍사스홀덤 외 오마하 포커까지 플레이 가능', '국내 보드게임 앱 중 희소한 오마하 지원'] },
      { title: '크로스 게임 재화 교환', points: ['한게임 포커/섯다와 교환소를 통한 재화 교환', '전입 수수료 무료'] },
    ],
    positive: [
      { keyword: '정통 홀덤', text: 'TDA 룰 기반의 정통 토너먼트로 실력 중심 플레이' },
      { keyword: '토너먼트 다양성', text: '개런티드, 바운티, 싯앤고 등 다채로운 대회 방식' },
      { keyword: '리뉴얼 비주얼', text: 'UI/UX 전면 개편, 세련된 캐릭터/카드 스킨' },
      { keyword: '재화 교환', text: '한게임 다른 게임과 머니 교환 가능 (전입 무료)' },
    ],
    negative: [
      { category: '접근성/운영', items: [
        { keyword: '전출 수수료', text: '로얄홀덤에서 다른 게임으로 머니 전출 시 10% 수수료' },
        { keyword: '인지도 부족', text: '더블에이포커에서 리브랜딩 후 기존 유저 혼란' },
        { keyword: '유저 분산', text: '한게임 홀덤과 별도 앱으로 유저 풀 분산 문제' },
        { keyword: '높은 진입 장벽', text: '토너먼트 중심이라 캐주얼 유저에게 부담' },
      ]},
    ],
  },
  'hangame-matgo': {
    genre: {
      items: [
        { label: '장르', text: '모바일 웹보드 (고스톱/맞고)' },
        { label: '개발/퍼블리싱', text: 'NHN' },
        { label: '평점', text: '앱스토어 3.3/5 (7,500+ 리뷰) — 6개 앱 중 최저' },
      ],
      sections: [
        { title: '핵심 메커니즘', bullets: [
          '"대한민국 원조 고스톱" 포지셔닝',
          '스피드 모드, 보너스 카드 시스템, 수류탄 기능',
          '밀기(더블/쿼드러플 베팅), 팡팡미션',
        ]},
        { title: '타겟 유저', bullets: [
          '30~60대 고스톱/맞고 선호 유저',
          'PC방에서 맞고를 즐기던 기존 유저',
        ]},
      ],
    },
    usp: [
      { title: 'PC방 점유율 1위', points: ['한국 3대 온라인 맞고 게임 중 PC방 점유율 최고', '"대한민국 원조 고스톱" 브랜드'] },
      { title: '스피드 모드', points: ['게임 연출 간소화로 고스톱 플레이 속도 대폭 향상', '짧은 시간에 여러 판 플레이 가능'] },
      { title: '섯다 크로스 플레이', points: ['고스톱 머니로 섯다 플레이 가능', '3대 맞고 게임 중 유일한 크로스 게임 기능'] },
      { title: '풍부한 무료 보상', points: ['매일 접속 시 포키 출석부로 최대 1,500만냥 무료 지급', '스트레스 해소형 캐주얼 플레이'] },
    ],
    positive: [
      { keyword: '스트레스 해소', text: '고스톱 치면서 잡념을 잊을 수 있는 힐링 효과' },
      { keyword: '원조 브랜드', text: '한게임의 오랜 맞고 역사에 대한 신뢰' },
      { keyword: '스피드 모드', text: '빠른 진행으로 시간 절약, 짧은 시간에 여러 판 가능' },
      { keyword: '크로스 게임', text: '맞고 머니로 섯다까지 즐길 수 있는 유일한 플랫폼' },
    ],
    negative: [
      { category: '게임/운영 이슈', items: [
        { keyword: 'AI 편향', text: 'AI가 한 사람을 집중적으로 몰아주는 경향에 대한 강한 불만' },
        { keyword: '미니게임 보상', text: '미니게임에서 거의 대부분 최소 금액만 지급' },
        { keyword: '과금 순환', text: '고액방 진입 → 파산 → 현금 충전 유도의 악순환 비판' },
        { keyword: '연패 스트레스', text: '10판 이상 연속으로 이기지 못하는 경험에 대한 좌절감' },
      ]},
    ],
  },
}

function FormattedGenre({ data }) {
  return (
    <div className="formatted-content">
      <div className="info-pills">
        {data.items.map((item, i) => (
          <div key={i} className="info-pill">
            <span className="pill-label">{item.label}</span>
            <span className="pill-value">{item.text}</span>
          </div>
        ))}
      </div>
      {data.sections.map((sec, i) => (
        <div key={i} className="info-section">
          <div className="section-title">{sec.title}</div>
          <ul>
            {sec.bullets.map((b, j) => <li key={j}>{b}</li>)}
          </ul>
        </div>
      ))}
    </div>
  )
}

function FormattedUSP({ data }) {
  return (
    <div className="formatted-content">
      {data.map((item, i) => (
        <div key={i} className="usp-item">
          <div className="usp-number">{i + 1}</div>
          <div className="usp-body">
            <div className="usp-title">{item.title}</div>
            <ul>
              {item.points.map((p, j) => <li key={j}>{p}</li>)}
            </ul>
          </div>
        </div>
      ))}
    </div>
  )
}

function FormattedPositive({ data }) {
  return (
    <div className="formatted-content">
      {data.map((item, i) => (
        <div key={i} className="reaction-item positive-item">
          <span className="reaction-keyword positive-kw">{item.keyword}</span>
          <span className="reaction-text">{item.text}</span>
        </div>
      ))}
    </div>
  )
}

function FormattedNegative({ data }) {
  return (
    <div className="formatted-content">
      {data.map((cat, i) => (
        <div key={i} className="neg-category">
          <div className="neg-category-title">{cat.category}</div>
          {cat.items.map((item, j) => (
            <div key={j} className="reaction-item negative-item">
              <span className="reaction-keyword negative-kw">{item.keyword}</span>
              <span className="reaction-text">{item.text}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

// 텍스트에 삭제/제거 의도가 있는지 판별
const REMOVE_WORDS = ['빼', '제거', '삭제', '없애', '지워', '뺄', '뺀']
function isRemoveCommand(text) {
  return REMOVE_WORDS.some(w => text.includes(w))
}

// 삭제 명령에서 대상 키워드 추출
function extractRemoveTarget(text) {
  let t = text.trim()
  // 삭제 관련 단어 이후를 전부 자름
  for (const w of REMOVE_WORDS) {
    const idx = t.indexOf(w)
    if (idx > 0) {
      t = t.substring(0, idx)
      break
    }
  }
  // 조사/부호 정리
  t = t.replace(/[.。,，!?\s]+$/g, '').replace(/(은|는|을|를|이|가|도|요|에서|에)\s*$/g, '').trim()
  return t.length > 1 ? t : null
}

// AI가 기획자 입력을 분석하여 깔끔한 USP 제목+포인트로 리파인
function refineUSPInput(rawText, index) {
  const text = rawText.trim()

  const keywordPatterns = [
    // 시장 지위/브랜드
    { match: /1위|점유율|최고|최대|No\.?1|넘버원|탑/, title: '시장 지위/브랜드 파워', points: ['시장 점유율 1위 — 유저 수 기반의 사회적 증거(Social Proof) 활용', '브랜드 인지도와 신뢰감을 소구하는 크리에이티브 방향'] },
    { match: /원조|전통|오래|역사|레전드|클래식|정통/, title: '원조/전통 브랜드', points: ['오랜 서비스 역사가 주는 신뢰감과 안정감 소구', '"원조" 포지셔닝으로 후발 주자와 차별화'] },
    // 게임 특성
    { match: /캐릭터|귀여움|귀여운|캐릭|비주얼|디자인|그래픽/, title: '캐릭터/비주얼 매력', points: ['다양한 캐릭터별 고유 비주얼과 개성 강조', '귀여움/매력 요소를 활용한 감성적 소구'] },
    { match: /마을\s*꾸미기|꾸미기|커스텀|인테리어|꾸밈|데코/, title: '커스터마이징/꾸미기', points: ['유저 자기표현 욕구를 충족하는 커스터마이징 요소', '꾸미기 콘텐츠를 통한 장기 리텐션 확보'] },
    { match: /다양|종류|종목|많은|여러|풍부한 게임/, title: '다양한 게임 종목', points: ['한 앱에서 다양한 게임 모드를 즐길 수 있는 올인원 경험', '선택의 폭이 넓어 여러 취향의 유저를 커버'] },
    { match: /수집|컬렉션|모으|도감|조합/, title: '수집/컬렉션 재미', points: ['다양한 아이템/캐릭터 수집의 성취감 소구', '도감 완성, 조합 등 수집 욕구 자극'] },
    // 소셜/커뮤니티
    { match: /커뮤니티|소셜|친구|길드|같이|소통|대전/, title: '소셜/커뮤니티', points: ['유저 간 소통과 협력/경쟁 플레이 요소', '커뮤니티 기반의 자연스러운 바이럴 효과'] },
    { match: /스트리머|방송|유튜브|인플루언서|BJ|크리에이터/, title: '인플루언서 마케팅', points: ['스트리머/유튜버를 통한 자연스러운 노출', '방송 시청자 → 게임 유입 전환 파이프라인'] },
    // 경쟁/랭킹
    { match: /경쟁|랭킹|순위|대회|토너먼트|PvP|챔피언/, title: '경쟁/토너먼트', points: ['유저 간 경쟁 심리를 자극하는 랭킹/대회 콘텐츠', '토너먼트를 통한 핵심 유저 리텐션과 화제성'] },
    // 캐주얼/접근성
    { match: /빠른|스피드|간편|짧은|5분|가볍|쉬운|접근/, title: '간편한 접근성', points: ['짧은 세션으로 출퇴근/점심시간 틈새 플레이 가능', '캐주얼 유저 타겟에 적합한 낮은 진입 장벽'] },
    { match: /힐링|여유|편안|휴식|릴렉스|스트레스/, title: '힐링/스트레스 해소', points: ['바쁜 일상 속 여유로운 게임 경험 소구', '스트레스 해소형 캐주얼 플레이 강조'] },
    // 보상/이벤트
    { match: /보상|무료|출석|혜택|리워드|공짜|이벤트|시즌/, title: '보상/이벤트 혜택', points: ['출석/이벤트 보상으로 무과금 유저 진입 장벽 완화', '보상 중심 광고 소재로 높은 CTR 기대'] },
    // 기술/시스템
    { match: /공정|RNG|확률|투명|인증/, title: '공정성 인증', points: ['공정한 게임 환경을 강조하는 신뢰 소구', 'RNG 인증 등 투명한 시스템 어필'] },
    { match: /전략|스킬|실력|두뇌|고수/, title: '전략적 플레이', points: ['실력 기반의 전략적 게임 플레이 강조', '고급 유저의 만족도와 장기 리텐션 확보'] },
    { match: /연동|크로스|PC|모바일|호환/, title: 'PC-모바일 연동', points: ['PC와 모바일 간 심리스한 크로스 플레이', '언제 어디서든 이어서 플레이하는 편의성'] },
    // 복귀/노스탤지어
    { match: /복귀|돌아|옛날|추억|그때|향수|노스탤/, title: '노스탤지어/복귀 소구', points: ['과거 플레이 경험을 환기하는 추억 소구', '복귀 보상과 연계한 윈백(win-back) 캠페인'] },
    // 아바타/개성
    { match: /아바타|스킨|외형|개성|표현/, title: '아바타/자기표현', points: ['아바타/스킨을 통한 유저 개성 표현 요소', '커스터마이징 기반의 과금 유도 + 감성 소구'] },
  ]

  for (const pattern of keywordPatterns) {
    if (pattern.match.test(text)) {
      return { id: `usp-refined-${index}`, title: pattern.title, points: pattern.points }
    }
  }

  // 매칭 안 되면 원문을 정리하여 깔끔한 제목 + 포인트 생성
  const cleaned = text
    .replace(/(것 같습니다|것 같아요|할 수 있을|될 수 있을|라는 게|라는 것|이라는 게|인 것 같|거 같|같아요|같습니다|있어요|있습니다|입니다|합니다|에요|해요|요\.|도 있|USP도|USP가|USP에|USP로|가능할|좋겠|도 될|도 좋을|해주세요|추가|포함|넣어)/g, '')
    .replace(/[.。,，!?\s]+$/g, '')
    .trim()

  return {
    id: `usp-refined-${index}`,
    title: cleaned || text.substring(0, 30),
    points: [
      `기획자 제안: ${text}`,
      '해당 포인트를 활용한 크리에이티브 소재 기획 가능',
    ],
  }
}

// AI가 추가 입력을 반영하여 USP/반응 데이터를 재구성
function processWithAI(research, additionalInputs, notes) {
  if (!research) return { usp: [], aiSummary: '' }

  let processedUSP = research.usp.map((item, i) => ({
    id: `usp-${i}`,
    title: item.title,
    points: [...item.points],
  }))

  let changes = []

  // 모든 추가 입력을 하나로 모아서 처리
  const allLines = [
    ...(additionalInputs.usp || '').split('\n'),
    ...(additionalInputs.genre || '').split('\n'),
    ...(additionalInputs.positive || '').split('\n'),
    ...(additionalInputs.negative || '').split('\n'),
  ].map(l => l.trim()).filter(l => l.length > 2)

  // PASS 1: 삭제 명령 먼저 전부 처리
  allLines.forEach(line => {
    if (isRemoveCommand(line)) {
      const target = extractRemoveTarget(line)
      if (target) {
        const before = processedUSP.length
        processedUSP = processedUSP.filter(u =>
          !u.title.includes(target) && !u.points.some(p => p.includes(target))
        )
        if (processedUSP.length < before) {
          changes.push(`"${target}" USP 제거`)
        }
      }
    }
  })

  // PASS 2: 추가/제안 처리 (삭제 명령이 아닌 것만)
  const addLines = allLines.filter(line => !isRemoveCommand(line))
  addLines.forEach((line, i) => {
    // USP 관련 제안이거나 장르/긍정에서 USP 힌트가 있는 경우
    if (line.length > 5) {
      const refined = refineUSPInput(line, i)
      const isDuplicate = processedUSP.some(u => u.title === refined.title)
      if (!isDuplicate) {
        processedUSP.push(refined)
        changes.push(`"${refined.title}" USP 추가`)
      }
    }
  })

  // AI 종합 요약
  const extraParts = []
  if (notes?.trim()) extraParts.push('메모 반영')

  const hasChanges = changes.length > 0 || extraParts.length > 0
  let aiSummary
  if (hasChanges) {
    const detail = [...changes, ...extraParts].join(', ')
    aiSummary = `AI 분석 완료: ${detail}. 총 ${processedUSP.length}개 USP로 정리됨.`
  } else {
    aiSummary = `저장 완료! ${processedUSP.length}개 USP가 USP 탭과 스토리보드에 연동됩니다.`
  }

  return { usp: processedUSP, aiSummary }
}

export default function Brainstorming({ selectedApp, onSave, data }) {
  const [notes, setNotes] = useState(data?.notes || '')
  const [isLoaded, setIsLoaded] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveComplete, setSaveComplete] = useState(false)
  const [aiSummary, setAiSummary] = useState(data?.aiSummary || '')
  const [processedResearch, setProcessedResearch] = useState(null)
  const [additionalInputs, setAdditionalInputs] = useState(data?.additionalInputs || {
    genre: '', usp: '', positive: '', negative: '',
  })

  const baseResearch = AI_RESEARCH[selectedApp?.id]
  // 처리된 리서치가 있으면 그걸 보여주고, 없으면 원본
  const research = processedResearch || baseResearch

  const handleSave = () => {
    setIsSaving(true)
    setSaveComplete(false)

    setTimeout(() => {
      const result = processWithAI(baseResearch, additionalInputs, notes)

      // 브레인스토밍 카드 자체도 업데이트 — 처리된 USP로 리서치 데이터 갱신
      if (baseResearch) {
        const updatedResearch = {
          ...baseResearch,
          usp: result.usp.map(u => ({ title: u.title, points: u.points })),
        }
        setProcessedResearch(updatedResearch)
      }

      setAiSummary(result.aiSummary)
      setIsSaving(false)
      setSaveComplete(true)

      // 추가 입력 중 삭제 명령은 처리 후 클리어
      const cleanedInputs = { ...additionalInputs }
      for (const key of ['usp', 'genre', 'positive', 'negative']) {
        if (cleanedInputs[key]) {
          cleanedInputs[key] = cleanedInputs[key].split('\n')
            .filter(line => !isRemoveCommand(line))
            .join('\n')
        }
      }
      setAdditionalInputs(cleanedInputs)

      onSave({
        research: processedResearch || baseResearch,
        notes,
        isLoaded,
        uspList: result.usp,
        additionalInputs: cleanedInputs,
        aiSummary: result.aiSummary,
      })

      setTimeout(() => setSaveComplete(false), 4000)
    }, 1500)
  }

  const handleAutoFill = () => {
    if (!research) return
    setIsLoaded(true)
  }

  const handleReset = () => {
    setNotes('')
    setIsLoaded(false)
    setAiSummary('')
    setSaveComplete(false)
    setProcessedResearch(null)
    setAdditionalInputs({ genre: '', usp: '', positive: '', negative: '' })
  }

  const updateAdditional = (key, value) => {
    setAdditionalInputs(prev => ({ ...prev, [key]: value }))
  }

  useEffect(() => {
    if (data?.isLoaded) setIsLoaded(true)
    if (data?.notes) setNotes(data.notes)
    if (data?.additionalInputs) setAdditionalInputs(data.additionalInputs)
    if (data?.aiSummary) setAiSummary(data.aiSummary)
    // 이전에 처리된 리서치 데이터가 있으면 복원
    if (data?.research && data.research !== baseResearch) {
      setProcessedResearch(data.research)
    }
  }, [data])

  if (!selectedApp) {
    return (
      <div className="brainstorm-empty">
        <div className="empty-icon">💡</div>
        <h3>앱을 먼저 선택해주세요</h3>
        <p>우측 상단에서 분석할 앱을 선택하면 브레인스토밍을 시작할 수 있습니다.</p>
      </div>
    )
  }

  return (
    <div className="brainstorming">
      <div className="brainstorm-header">
        <h2>{selectedApp.icon} {selectedApp.name} 브레인스토밍</h2>
        <div className="header-actions">
          {!isLoaded && research && (
            <button className="ai-fill-btn" onClick={handleAutoFill}>
              🤖 AI 분석 시작
            </button>
          )}
          {isLoaded && <button className="reset-btn" onClick={handleReset}>초기화</button>}
          <button className="save-btn" onClick={handleSave} disabled={isSaving}>
            {isSaving ? '⏳ AI 분석 중...' : '💾 저장'}
          </button>
        </div>
      </div>

      {!isLoaded && research && (
        <div className="ai-banner">
          <span className="ai-banner-icon">🤖</span>
          <div>
            <strong>AI 리서치 데이터가 준비되어 있습니다</strong>
            <p>웹 조사 기반 분석 결과를 자동으로 채울 수 있습니다.</p>
          </div>
          <button className="ai-banner-btn" onClick={handleAutoFill}>분석 시작</button>
        </div>
      )}

      {!isLoaded && !research && (
        <div className="ai-banner no-data">
          <span className="ai-banner-icon">📝</span>
          <div>
            <strong>이 앱은 아직 AI 리서치 데이터가 없습니다</strong>
            <p>아래 카드에 직접 정보를 입력해주세요.</p>
          </div>
        </div>
      )}

      {!isLoaded && !research && (
        <div className="brainstorm-grid">
          <div className="brainstorm-card">
            <div className="card-header">
              <span className="card-tag tag-genre">장르</span>
              <h4>장르 분석</h4>
            </div>
            <textarea placeholder="이 앱의 장르와 특징을 입력하세요..." rows={6} />
          </div>
          <div className="brainstorm-card">
            <div className="card-header">
              <span className="card-tag tag-usp">USP</span>
              <h4>USP</h4>
            </div>
            <textarea placeholder="핵심 매력 포인트를 입력하세요..." rows={6} />
          </div>
          <div className="brainstorm-card">
            <div className="card-header">
              <span className="card-tag tag-positive">긍정</span>
              <h4>긍정적인 반응</h4>
            </div>
            <textarea placeholder="긍정적인 리뷰, 반응을 정리하세요..." rows={6} />
          </div>
          <div className="brainstorm-card">
            <div className="card-header">
              <span className="card-tag tag-negative">부정</span>
              <h4>부정적인 반응</h4>
            </div>
            <textarea placeholder="부정적인 리뷰, 불만사항을 정리하세요..." rows={6} />
          </div>
        </div>
      )}

      {/* 로딩 오버레이 */}
      {isSaving && (
        <div className="saving-overlay">
          <div className="saving-spinner"></div>
          <div className="saving-text">
            <strong>AI가 피드백을 분석하고 있습니다...</strong>
            <p>추가 입력과 소구 방향성을 반영하여 데이터를 재구성합니다.</p>
          </div>
        </div>
      )}

      {/* 저장 완료 메시지 */}
      {saveComplete && (
        <div className="save-complete-banner">
          <span>✅</span>
          <span>{aiSummary}</span>
        </div>
      )}

      {isLoaded && research && (
        <div className="brainstorm-grid">
          <div className="brainstorm-card">
            <div className="card-header">
              <span className="card-tag tag-genre">장르</span>
              <h4>장르 분석</h4>
            </div>
            <FormattedGenre data={research.genre} />
            <div className="additional-input">
              <textarea
                placeholder="추가로 입력하고 싶은 장르/특징 정보가 있으면 여기에..."
                value={additionalInputs.genre}
                onChange={e => updateAdditional('genre', e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <div className="brainstorm-card">
            <div className="card-header">
              <span className="card-tag tag-usp">USP</span>
              <h4>USP (Unique Selling Point)</h4>
            </div>
            <FormattedUSP data={research.usp} />
            <div className="additional-input">
              <textarea
                placeholder="추가 USP나 수정할 내용을 입력하세요..."
                value={additionalInputs.usp}
                onChange={e => updateAdditional('usp', e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <div className="brainstorm-card">
            <div className="card-header">
              <span className="card-tag tag-positive">긍정 반응</span>
              <h4>긍정적인 반응</h4>
            </div>
            <FormattedPositive data={research.positive} />
            <div className="additional-input">
              <textarea
                placeholder="추가 긍정 반응이 있으면 입력하세요..."
                value={additionalInputs.positive}
                onChange={e => updateAdditional('positive', e.target.value)}
                rows={2}
              />
            </div>
          </div>

          <div className="brainstorm-card">
            <div className="card-header">
              <span className="card-tag tag-negative">부정 반응</span>
              <h4>부정적인 반응</h4>
            </div>
            <FormattedNegative data={research.negative} />
            <div className="additional-input">
              <textarea
                placeholder="추가 부정 반응이 있으면 입력하세요..."
                value={additionalInputs.negative}
                onChange={e => updateAdditional('negative', e.target.value)}
                rows={2}
              />
            </div>
          </div>
        </div>
      )}

      <div className="brainstorm-card full-width direction-card">
        <div className="card-header">
          <span className="card-tag tag-direction">방향성</span>
          <h4>추가 메모 사항</h4>
        </div>
        <p className="direction-hint">추가로 참고할 내용을 자유롭게 적어주세요. 스토리보드 생성 시 참고됩니다.</p>
        <textarea
          placeholder="예: 20~30대 여성 타겟으로 노스탤지어 감성 강조 / 경쟁사 A앱은 최근 이런 소재를 사용 중 / 이번 시즌 이벤트와 연계 필요"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          rows={4}
        />
      </div>
    </div>
  )
}
