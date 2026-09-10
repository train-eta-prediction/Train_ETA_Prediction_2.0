import { useEffect, useState } from 'react'
import axios from 'axios'

const LIMIT = 10

export default function HistoricalData() {
  const [rows, setRows] = useState([])
  const [total, setTotal] = useState(null)
  const [page, setPage] = useState(0)
  const [status, setStatus] = useState('loading')

  useEffect(() => {
    setStatus('loading')
    axios.get(`https://train-eta-prediction-2-0-1.onrender.com/historical-data?limit=${LIMIT}&offset=${page * LIMIT}`)
      .then(res => {
        const data = res.data
        const list = Array.isArray(data) ? data : (data.results ?? data.data ?? [])
        setRows(list)
        setTotal(data.total ?? null)
        setStatus('ready')
      })
      .catch(() => setStatus('error'))
  }, [page])

  const columns = rows.length > 0 ? Object.keys(rows[0]) : []
  const hasNext = total !== null ? (page + 1) * LIMIT < total : rows.length === LIMIT

  return (
    <main className="ops-shell">
      <div className="ops-grid" aria-hidden="true" />

      <section className="hero">
        <div>
          <p className="eyebrow">DATASET &nbsp;<span className="cyan">/</span>&nbsp; HISTORICAL</p>
          <h1>Historical <span>Data</span></h1>
          <p className="hero-copy">
            Synthetic training data — 8 trains × 90 days × 4 segments, paginated.
          </p>
        </div>
      </section>

      {status === 'error' && <p className="error-message">Couldn't load historical data. Try again shortly.</p>}

      <div className="table-wrap">
        <table className="data-table">
          <thead>
            <tr>
              {columns.map(col => <th key={col}>{col.replace(/_/g, ' ')}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={i}>
                {columns.map(col => <td key={col} className="mono">{String(row[col])}</td>)}
              </tr>
            ))}
            {status === 'loading' && (
              <tr><td colSpan={columns.length || 1}>Loading…</td></tr>
            )}
            {status === 'ready' && rows.length === 0 && (
              <tr><td colSpan={columns.length || 1}>No rows.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="pagination">
        <button
          className="predict-button"
          style={{ width: 'auto', padding: '9px 18px' }}
          onClick={() => setPage(p => Math.max(0, p - 1))}
          disabled={page === 0}
        >
          ← PREV
        </button>
        <span className="mono">
          PAGE {page + 1}{total !== null ? ` / ${Math.ceil(total / LIMIT)}` : ''}
        </span>
        <button
          className="predict-button"
          style={{ width: 'auto', padding: '9px 18px' }}
          onClick={() => setPage(p => p + 1)}
          disabled={!hasNext}
        >
          NEXT →
        </button>
      </div>
    </main>
  )
}