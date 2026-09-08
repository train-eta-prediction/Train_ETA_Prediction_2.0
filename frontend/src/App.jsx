import axios from 'axios'
import { useMemo, useState } from 'react'
import './App.css'

const trains = [
  { train_id: 'T100', origin_station: 'Howrah', destination_station: 'Bardhaman', day_of_week: 'Monday', weather: 'Clear', congestion_level: 'Low', current_delay_min: 10, distance_km: 95, hour_of_day: 6, is_weekend: false, is_holiday: false, scheduled_departure: '05:00', scheduled_arrival: '06:30' },
  { train_id: 'T101', origin_station: 'Bardhaman', destination_station: 'Durgapur', day_of_week: 'Tuesday', weather: 'Rain', congestion_level: 'High', current_delay_min: 28, distance_km: 55, hour_of_day: 8, is_weekend: false, is_holiday: false, scheduled_departure: '07:15', scheduled_arrival: '08:05' },
  { train_id: 'T102', origin_station: 'Durgapur', destination_station: 'Asansol', day_of_week: 'Wednesday', weather: 'Fog', congestion_level: 'Medium', current_delay_min: 18, distance_km: 40, hour_of_day: 7, is_weekend: false, is_holiday: false, scheduled_departure: '06:40', scheduled_arrival: '07:20' },
  { train_id: 'T103', origin_station: 'Asansol', destination_station: 'Dhanbad', day_of_week: 'Saturday', weather: 'Clear', congestion_level: 'Medium', current_delay_min: 7, distance_km: 60, hour_of_day: 14, is_weekend: true, is_holiday: false, scheduled_departure: '13:10', scheduled_arrival: '14:10' },
  { train_id: 'T104', origin_station: 'Howrah', destination_station: 'Bardhaman', day_of_week: 'Sunday', weather: 'Rain', congestion_level: 'Low', current_delay_min: 34, distance_km: 95, hour_of_day: 18, is_weekend: true, is_holiday: false, scheduled_departure: '17:30', scheduled_arrival: '19:00' },
  { train_id: 'T105', origin_station: 'Bardhaman', destination_station: 'Durgapur', day_of_week: 'Friday', weather: 'Clear', congestion_level: 'High', current_delay_min: 43, distance_km: 55, hour_of_day: 9, is_weekend: false, is_holiday: false, scheduled_departure: '08:25', scheduled_arrival: '09:15' },
]

const weatherIcon = { Clear: '○', Rain: '∿', Fog: '≋' }

function severity(delay) {
  if (delay < 15) return { label: 'On schedule', className: 'severity-good' }
  if (delay <= 30) return { label: 'Watch', className: 'severity-watch' }
  return { label: 'Critical', className: 'severity-critical' }
}

export default function App() {
  const [loading, setLoading] = useState(null)
  const [predictions, setPredictions] = useState({})
  const [errors, setErrors] = useState({})
  const activeCount = Object.keys(predictions).length
  const averageDelay = useMemo(() => Math.round(trains.reduce((sum, train) => sum + train.current_delay_min, 0) / trains.length), [])

  async function predictEta(train) {
    setLoading(train.train_id)
    setErrors((current) => ({ ...current, [train.train_id]: '' }))
    try {
      const { data } = await axios.post('https://train-eta-prediction-2-0-1.onrender.com/predict-eta', train)
      setPredictions((current) => ({ ...current, [train.train_id]: data }))
    } catch {
      setErrors((current) => ({ ...current, [train.train_id]: 'Prediction service unavailable. Check the local backend.' }))
    } finally {
      setLoading(null)
    }
  }

  return (
    <main className="ops-shell">
      <div className="ops-grid" aria-hidden="true" />
      <header className="topbar">
        <div className="brand-lockup"><div className="brand-mark">↗</div><div><p className="eyebrow">RAILWAY OPERATIONS</p><p className="brand-name">পথসারথি</p></div></div>
        <div className="system-state"><span className="pulse-dot" /> <span>SYSTEM NOMINAL</span><span className="topbar-divider" /> <span className="mono">07 SEP 2026 · 06:42:18 UTC</span></div>
      </header>

      <section className="hero"><div><p className="eyebrow cyan">LIVE CONTROL SURFACE <span className="live-line" /></p><h1>পথসারথি |<span>Train ETA Prediction</span></h1><p className="hero-copy">Real-time arrival intelligence across the eastern rail network.</p></div><div className="hero-side"><span className="signal-bars"><i /><i /><i /><i /></span><span>NETWORK<br /><strong>CONNECTED</strong></span></div></section>

      <section className="metrics" aria-label="Network summary">
        <div className="metric"><span className="metric-label">MONITORED SERVICES</span><strong>{String(trains.length).padStart(2, '0')}</strong><span className="metric-note cyan">ACTIVE ROUTES</span></div>
        <div className="metric"><span className="metric-label">AVG. CURRENT DELAY</span><strong>{averageDelay}<small> min</small></strong><span className="metric-note amber">LIVE TELEMETRY</span></div>
        <div className="metric"><span className="metric-label">PREDICTIONS RUN</span><strong>{String(activeCount).padStart(2, '0')}</strong><span className="metric-note green">SESSION TOTAL</span></div>
        <div className="metric metric-status"><span className="metric-label">MODEL STATUS</span><strong><span className="status-dot" /> READY</strong><span className="metric-note green">LATENCY 42ms</span></div>
      </section>

      <div className="section-heading"><div><p className="eyebrow">SERVICE MONITOR</p><h2>Active train telemetry</h2></div><div className="legend"><span><i className="legend-dot good" /> ON SCHEDULE</span><span><i className="legend-dot watch" /> WATCH</span><span><i className="legend-dot critical" /> CRITICAL</span></div></div>

      <section className="train-grid" aria-label="Active train telemetry">
        {trains.map((train) => {
          const prediction = predictions[train.train_id]
          const error = errors[train.train_id]
          const isLoading = loading === train.train_id
          const currentSeverity = severity(train.current_delay_min)
          return <article className="train-card" key={train.train_id}>
            <div className="card-head"><div className="train-id"><span className={`status-dot ${currentSeverity.className}`} /> <span className="mono">{train.train_id}</span></div><span className={`severity ${currentSeverity.className}`}>{currentSeverity.label}</span></div>
            <div className="route"><strong>{train.origin_station}</strong><span className="route-line"><i />→<i /></span><strong>{train.destination_station}</strong></div>
            <div className="schedule"><div><span>DEPARTURE</span><strong className="mono">{train.scheduled_departure}</strong></div><div className="schedule-arrow">/</div><div><span>ARRIVAL</span><strong className="mono">{train.scheduled_arrival}</strong></div></div>
            <div className="card-details"><div><span>CURRENT DELAY</span><strong className="delay-value">+{train.current_delay_min}<small> min</small></strong></div><div><span>WEATHER</span><strong className="weather"><b>{weatherIcon[train.weather]}</b>{train.weather}</strong></div><div><span>CONGESTION</span><strong className={`congestion ${train.congestion_level.toLowerCase()}`}>{train.congestion_level}</strong></div></div>
            {prediction && <div className="prediction"><span>PREDICTED DELAY</span><div><strong>{prediction.predicted_delay_hms}</strong><span className={`severity ${severity(prediction.predicted_delay_min).className}`}>{severity(prediction.predicted_delay_min).label}</span></div></div>}
            {error && <p className="error-message" role="alert">{error}</p>}
            <button className="predict-button" onClick={() => predictEta(train)} disabled={isLoading}>{isLoading ? <><span className="spinner" /> QUERYING MODEL</> : prediction ? '↻  RUN AGAIN' : 'PREDICT ETA  →'}</button>
            <div className="card-footer"><span>{train.distance_km} KM ROUTE</span><span>{train.day_of_week.toUpperCase()}</span></div>
          </article>
        })}
      </section>
      <footer className="footer"><span><span className="pulse-dot" /> AUTO-REFRESH ENABLED</span><span>DATA SOURCE: REGIONAL RAIL NETWORK <b>·</b> MODEL V2.4.1</span></footer>
    </main>
  )
}