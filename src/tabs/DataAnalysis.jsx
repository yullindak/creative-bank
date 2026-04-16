import { useState, useCallback } from 'react'
import Papa from 'papaparse'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import './DataAnalysis.css'

const METRIC_LABELS = {
  ctr: 'CTR (%)',
  cpc: 'CPC (원)',
  cpm: 'CPM (원)',
  cvr: 'CVR (설치) (%)',
  cpi: 'CPI (원)',
  cpa: 'CPA (원)',
}

function computeMetrics(rows) {
  const groups = {}

  rows.forEach(row => {
    const campaign = row['캠페인명'] || row['campaign'] || ''
    const group = row['그룹명'] || row['group'] || ''
    const key = campaign || group || 'Unknown'

    if (!groups[key]) {
      groups[key] = { name: key, cost: 0, impressions: 0, clicks: 0, installs: 0, actions: 0 }
    }

    const g = groups[key]
    g.cost += parseNum(row['비용'] || row['cost'])
    g.impressions += parseNum(row['노출'] || row['impressions'])
    g.clicks += parseNum(row['클릭수'] || row['clicks'])
    g.installs += parseNum(row['설치수'] || row['installs'])
    g.actions += parseNum(row['액션수'] || row['actions'])
  })

  return Object.values(groups).map(g => ({
    name: g.name,
    cost: g.cost,
    impressions: g.impressions,
    clicks: g.clicks,
    installs: g.installs,
    actions: g.actions,
    ctr: g.impressions > 0 ? ((g.clicks / g.impressions) * 100).toFixed(2) : 0,
    cpc: g.clicks > 0 ? Math.round(g.cost / g.clicks) : 0,
    cpm: g.impressions > 0 ? Math.round((g.cost / g.impressions) * 1000) : 0,
    cvr: g.clicks > 0 ? ((g.installs / g.clicks) * 100).toFixed(2) : 0,
    cpi: g.installs > 0 ? Math.round(g.cost / g.installs) : 0,
    cpa: g.actions > 0 ? Math.round(g.cost / g.actions) : 0,
  }))
}

function parseNum(val) {
  if (!val) return 0
  const n = Number(String(val).replace(/,/g, ''))
  return isNaN(n) ? 0 : n
}

export default function DataAnalysis() {
  const [data, setData] = useState(null)
  const [metrics, setMetrics] = useState([])
  const [selectedMetric, setSelectedMetric] = useState('ctr')
  const [rawRows, setRawRows] = useState([])

  const handleFile = useCallback((e) => {
    const file = e.target.files[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setRawRows(result.data)
        const computed = computeMetrics(result.data)
        setMetrics(computed)
        setData(result.data)
      },
    })
  }, [])

  const handleDrop = useCallback((e) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (!file) return

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        setRawRows(result.data)
        const computed = computeMetrics(result.data)
        setMetrics(computed)
        setData(result.data)
      },
    })
  }, [])

  const totalRow = metrics.length > 0 ? {
    name: '전체',
    cost: metrics.reduce((s, m) => s + m.cost, 0),
    impressions: metrics.reduce((s, m) => s + m.impressions, 0),
    clicks: metrics.reduce((s, m) => s + m.clicks, 0),
    installs: metrics.reduce((s, m) => s + m.installs, 0),
    actions: metrics.reduce((s, m) => s + m.actions, 0),
  } : null

  if (totalRow) {
    totalRow.ctr = totalRow.impressions > 0 ? ((totalRow.clicks / totalRow.impressions) * 100).toFixed(2) : 0
    totalRow.cpc = totalRow.clicks > 0 ? Math.round(totalRow.cost / totalRow.clicks) : 0
    totalRow.cpm = totalRow.impressions > 0 ? Math.round((totalRow.cost / totalRow.impressions) * 1000) : 0
    totalRow.cvr = totalRow.clicks > 0 ? ((totalRow.installs / totalRow.clicks) * 100).toFixed(2) : 0
    totalRow.cpi = totalRow.installs > 0 ? Math.round(totalRow.cost / totalRow.installs) : 0
    totalRow.cpa = totalRow.actions > 0 ? Math.round(totalRow.cost / totalRow.actions) : 0
  }

  return (
    <div className="data-analysis">
      {!data ? (
        <div
          className="upload-zone"
          onDrop={handleDrop}
          onDragOver={e => e.preventDefault()}
        >
          <div className="upload-icon">📊</div>
          <h3>RAW 데이터 업로드</h3>
          <p>CSV 파일을 드래그하거나 클릭하여 업로드하세요</p>
          <p className="upload-hint">
            필수 컬럼: 캠페인명, 그룹명, 소재명, 비용, 노출, 클릭수, 설치수, 액션수
          </p>
          <label className="upload-btn">
            파일 선택
            <input type="file" accept=".csv,.tsv,.txt" onChange={handleFile} hidden />
          </label>
        </div>
      ) : (
        <>
          <div className="data-header">
            <h2>캠페인 성과 분석</h2>
            <div className="data-actions">
              <span className="row-count">{rawRows.length}개 행 로드됨</span>
              <label className="reupload-btn">
                다시 업로드
                <input type="file" accept=".csv,.tsv,.txt" onChange={handleFile} hidden />
              </label>
            </div>
          </div>

          {/* Summary cards */}
          {totalRow && (
            <div className="summary-cards">
              <div className="summary-card">
                <div className="card-label">총 비용</div>
                <div className="card-value">{totalRow.cost.toLocaleString()}원</div>
              </div>
              <div className="summary-card">
                <div className="card-label">총 노출</div>
                <div className="card-value">{totalRow.impressions.toLocaleString()}</div>
              </div>
              <div className="summary-card">
                <div className="card-label">총 클릭</div>
                <div className="card-value">{totalRow.clicks.toLocaleString()}</div>
              </div>
              <div className="summary-card">
                <div className="card-label">평균 CTR</div>
                <div className="card-value">{totalRow.ctr}%</div>
              </div>
              <div className="summary-card">
                <div className="card-label">평균 CPC</div>
                <div className="card-value">{totalRow.cpc.toLocaleString()}원</div>
              </div>
              <div className="summary-card">
                <div className="card-label">평균 CPI</div>
                <div className="card-value">{totalRow.cpi.toLocaleString()}원</div>
              </div>
            </div>
          )}

          {/* Chart */}
          <div className="chart-section">
            <div className="chart-header">
              <h3>캠페인별 성과 비교</h3>
              <div className="metric-selector">
                {Object.entries(METRIC_LABELS).map(([key, label]) => (
                  <button
                    key={key}
                    className={`metric-btn ${selectedMetric === key ? 'active' : ''}`}
                    onClick={() => setSelectedMetric(key)}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={metrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey={selectedMetric} fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Table */}
          <div className="metrics-table-wrap">
            <table className="metrics-table">
              <thead>
                <tr>
                  <th>캠페인</th>
                  <th>비용</th>
                  <th>노출</th>
                  <th>클릭</th>
                  <th>설치</th>
                  <th>CTR</th>
                  <th>CPC</th>
                  <th>CPM</th>
                  <th>CVR(I)</th>
                  <th>CPI</th>
                  <th>CPA</th>
                </tr>
              </thead>
              <tbody>
                {metrics.map((m, i) => (
                  <tr key={i}>
                    <td className="campaign-name">{m.name}</td>
                    <td>{m.cost.toLocaleString()}</td>
                    <td>{m.impressions.toLocaleString()}</td>
                    <td>{m.clicks.toLocaleString()}</td>
                    <td>{m.installs.toLocaleString()}</td>
                    <td className="highlight">{m.ctr}%</td>
                    <td>{m.cpc.toLocaleString()}</td>
                    <td>{m.cpm.toLocaleString()}</td>
                    <td>{m.cvr}%</td>
                    <td>{m.cpi.toLocaleString()}</td>
                    <td>{m.cpa.toLocaleString()}</td>
                  </tr>
                ))}
                {totalRow && (
                  <tr className="total-row">
                    <td className="campaign-name">전체</td>
                    <td>{totalRow.cost.toLocaleString()}</td>
                    <td>{totalRow.impressions.toLocaleString()}</td>
                    <td>{totalRow.clicks.toLocaleString()}</td>
                    <td>{totalRow.installs.toLocaleString()}</td>
                    <td className="highlight">{totalRow.ctr}%</td>
                    <td>{totalRow.cpc.toLocaleString()}</td>
                    <td>{totalRow.cpm.toLocaleString()}</td>
                    <td>{totalRow.cvr}%</td>
                    <td>{totalRow.cpi.toLocaleString()}</td>
                    <td>{totalRow.cpa.toLocaleString()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}
