import { useEffect, useState } from 'react'
import axios from 'axios'

const FALLBACK_FEATURES = [
  { name: 'Current Delay', value: 62 },
  { name: 'Congestion', value: 11 },
  { name: 'Holiday', value: 10 },
  { name: 'Weather', value: 6 },
  { name: 'Weekend', value: 3 },
]

function normalizeFeatures(raw) {
  if (!raw) return FALLBACK_FEATURES
  if (Array.isArray(raw)) {
    return raw
      .map(f => ({
        name: f.feature ?? f.name ?? 'unknown',
        value: Math.round((f.importance ?? f.value ?? 0) * ((f.importance ?? f.value ?? 0) <= 1 ? 100 : 1)),
      }))
      .sort((a, b) => b.value - a.value)
  }
  if (typeof raw === 'object') {
    return Object.entries(raw)
      .map(([name, value]) => ({ name, value: Math.round(value <= 1 ? value * 100 : value) }))
      .sort((a, b) => b.value - a.value)
  }
  return FALLBACK_FEATURES
}

export default function ModelInsights() {
  const [data, setData] = useState(null)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    axios.get('https://train-eta-prediction-2-0-1.onrender.com/model-insights')
      .then(res => { setData(res.data); setStatus('ready') })
      .catch(() => setStatus('error'))
  }, [])

  const naiveMae = data?.naive_mae ?? data?.baseline_mae ?? 20.16
  const modelMae = data?.model_mae ?? data?.xgboost_mae ?? 5.85
  const improvement = data?.improvement_pct
    ?? Math.round(((naiveMae - modelMae) / naiveMae) * 100)
  const features = normalizeFeatures(data?.feature_importance ?? data?.top_features)

  return (
    <main className="ops-shell">
      <div className="ops-grid" aria-hidden="true" />

      <section className="hero">
        <div>
          <p className="eyebrow">MODEL &nbsp;<span className="cyan">/</span>&nbsp; INSIGHTS</p>
          <h1>Model <span>Performance</span></h1>
          <p className="hero-copy">
            How the XGBoost delay predictor compares to naive baselines, and which
            signals drive its predictions.
          </p>
        </div>
      </section>

      {status === 'error' && (
        <p className="error-message">Couldn't reach the insights API — showing last known figures.</p>
      )}

      <div className="metrics">
        <div className="metric">
          <span className="metric-label">NAIVE BASELINE</span>
          <strong>{Number(naiveMae).toFixed(2)} <small>min MAE</small></strong>
          <span className="metric-note">delay held constant</span>
        </div>
        <div className="metric">
          <span className="metric-label">XGBOOST MODEL</span>
          <strong className="cyan">{Number(modelMae).toFixed(2)} <small>min MAE</small></strong>
          <span className="metric-note">live conditions</span>
        </div>
        <div className="metric">
          <span className="metric-label">IMPROVEMENT</span>
          <strong className="green">−{improvement}%</strong>
          <span className="metric-note">vs naive baseline</span>
        </div>
        <div className="metric">
          <span className="metric-label">STATUS</span>
          <strong style={{ fontSize: 16 }}>
            <span className="status-dot" /> {status === 'loading' ? 'SYNCING' : 'LIVE'}
          </strong>
          <span className="metric-note">model-insights endpoint</span>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <p className="eyebrow">FEATURE IMPORTANCE</p>
          <h2>What drives each prediction</h2>
        </div>
      </div>

      <div className="feature-bars">
        {features.map(f => (
          <div className="feature-bar" key={f.name}>
            <span className="feature-bar-label">{f.name}</span>
            <div className="feature-bar-track">
              <div className="feature-bar-fill" style={{ width: `${f.value}%` }} />
            </div>
            <span className="feature-bar-value mono">{f.value}%</span>
          </div>
        ))}
      </div>
    </main>
  )
}