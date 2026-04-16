import { useState } from 'react'
import ServiceDirection from './tabs/ServiceDirection'
import Storyboard from './tabs/Storyboard'
import DataAnalysis from './tabs/DataAnalysis'
import AppSelector from './components/AppSelector'
import './App.css'

const TABS = [
  { id: 'direction', label: '서비스 방향성', icon: '🧭' },
  { id: 'storyboard', label: '스토리보드', icon: '🎬' },
  { id: 'data-analysis', label: '데이터 분석', icon: '📊' },
]

function App() {
  const [activeTab, setActiveTab] = useState('direction')
  const [selectedApp, setSelectedApp] = useState(null)

  const renderTab = () => {
    switch (activeTab) {
      case 'direction':
        return <ServiceDirection selectedApp={selectedApp} />
      case 'storyboard':
        return <Storyboard selectedApp={selectedApp} />
      case 'data-analysis':
        return <DataAnalysis />
      default:
        return null
    }
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Creative Bank</h1>
        <AppSelector selected={selectedApp} onSelect={setSelectedApp} />
      </header>
      <nav className="tab-nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <span className="tab-icon">{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </nav>
      <main className="tab-content">
        {renderTab()}
      </main>
    </div>
  )
}

export default App
