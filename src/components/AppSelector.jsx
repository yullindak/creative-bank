import { useState } from 'react'
import './AppSelector.css'

const PRESET_APPS = [
  { id: 'uparoo', name: '우파루 오딧세이', genre: 'RPG/수집형', icon: '🦕' },
  { id: 'hangame-poker', name: '한게임 모바일 포커', genre: '보드/카드', icon: '🃏' },
  { id: 'hangame-sutda', name: '한게임 섯다', genre: '보드/카드', icon: '🎴' },
  { id: 'hangame-poker-classic', name: '한게임 포커 클래식', genre: '보드/카드', icon: '♠️' },
  { id: 'hangame-holdem', name: '한게임 홀덤', genre: '보드/카드', icon: '♦️' },
  { id: 'hangame-royal-holdem', name: '한게임 로얄홀덤', genre: '보드/카드', icon: '👑' },
  { id: 'hangame-matgo', name: '한게임 신맞고', genre: '보드/카드', icon: '🎋' },
]

export default function AppSelector({ selected, onSelect }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="app-selector">
      {selected ? (
        <div className="selected-app" onClick={() => setShowModal(true)}>
          <span className="app-icon">{selected.icon}</span>
          <span className="app-name">{selected.name}</span>
          <span className="app-genre">{selected.genre}</span>
          <button className="change-btn">변경</button>
        </div>
      ) : (
        <button className="select-app-btn" onClick={() => setShowModal(true)}>
          앱 선택하기
        </button>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h3>앱 선택</h3>
            <div className="preset-list">
              {PRESET_APPS.map(app => (
                <button
                  key={app.id}
                  className={`preset-item ${selected?.id === app.id ? 'active' : ''}`}
                  onClick={() => { onSelect(app); setShowModal(false) }}
                >
                  <span>{app.icon}</span>
                  <div>
                    <div className="preset-name">{app.name}</div>
                    <div className="preset-genre">{app.genre}</div>
                  </div>
                </button>
              ))}
            </div>
            <button className="close-btn" onClick={() => setShowModal(false)}>닫기</button>
          </div>
        </div>
      )}
    </div>
  )
}
