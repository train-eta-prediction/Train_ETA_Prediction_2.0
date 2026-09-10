// pages/About.jsx
export default function About() {
  return (
    <main className="ops-shell">
      <div className="ops-grid" aria-hidden="true" />

      <section className="hero">
        <div>
          <p className="eyebrow">SYSTEM &nbsp;<span className="cyan">/</span>&nbsp; ABOUT</p>
          <h1>পথসারথি <span>Pathasarthy</span></h1>
          <p className="hero-copy">
            AI-powered real-time train delay &amp; ETA prediction for the
            Howrah → Bardhaman → Durgapur → Asansol → Dhanbad corridor —
            forecasting delay at destination, not just reporting it.
          </p>
        </div>
        <div className="hero-side">
          <div className="signal-bars">
            <i /><i /><i /><i />
          </div>
          
        </div>
      </section>

      <div className="metrics">
        <div className="metric">
          <span className="metric-label">MODEL</span>
          <strong>XGBoost</strong>
          <span className="metric-note">gradient boosted trees</span>
        </div>
        <div className="metric">
          <span className="metric-label">ACCURACY GAIN</span>
          <strong className="green">−71%</strong>
          <span className="metric-note">MAE vs naive baseline</span>
        </div>
        <div className="metric">
          <span className="metric-label">DATASET</span>
          <strong>2,880 <small>rows</small></strong>
          <span className="metric-note">8 trains × 90 days × 4 segments</span>
        </div>
        <div className="metric">
          <span className="metric-label">STATUS</span>
          <strong style={{ fontSize: 16 }}>
            <span className="status-dot" /> LIVE
          </strong>
          <span className="metric-note">Render + Vercel</span>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <p className="eyebrow">THE PROBLEM</p>
          <h2>Current delay isn't a forecast</h2>
        </div>
      </div>
      <p className="hero-copy" style={{ maxWidth: 700, paddingBottom: 10 }}>
        Traditional tracking only shows how late a train is <em>right now</em>.
        Passengers and operators have no forward-looking estimate of what the
        delay will actually be on arrival — so Pathasarthy predicts it, using
        live weather, congestion, holiday, and per-train punctuality signals.
      </p>

      <div className="section-heading">
        <div>
          <p className="eyebrow">ARCHITECTURE</p>
          <h2>How a prediction is made</h2>
        </div>
      </div>
      <div className="flow-strip">
        <div className="flow-node">
          <span className="flow-index mono">01</span>
          <strong>Synthetic Dataset</strong>
          <span className="metric-note">weather · congestion · holidays · train identity</span>
        </div>
        <span className="flow-arrow cyan">→</span>
        <div className="flow-node">
          <span className="flow-index mono">02</span>
          <strong>XGBoost Model</strong>
          <span className="metric-note">trained, serialized as .pkl</span>
        </div>
        <span className="flow-arrow cyan">→</span>
        <div className="flow-node">
          <span className="flow-index mono">03</span>
          <strong>FastAPI</strong>
          <span className="metric-note">/predict-eta endpoint</span>
        </div>
        <span className="flow-arrow cyan">→</span>
        <div className="flow-node">
          <span className="flow-index mono">04</span>
          <strong>React Dashboard</strong>
          <span className="metric-note">live control-room UI</span>
        </div>
      </div>

      <div className="section-heading">
        <div>
          <p className="eyebrow">STACK</p>
          <h2>Built with</h2>
        </div>
      </div>
      <div className="chip-row">
        {['Python', 'pandas', 'scikit-learn', 'XGBoost', 'FastAPI', 'Pydantic', 'Uvicorn', 'React', 'Vite', 'Axios', 'Render', 'Vercel'].map(t => (
          <span className="chip" key={t}>{t}</span>
        ))}
      </div>

      <div className="section-heading">
        <div>
          <p className="eyebrow">LINKS</p>
          <h2>Explore the system</h2>
        </div>
      </div>
      <div className="link-row">
        <a className="link-card" href="https://train-eta-prediction-2-0.vercel.app/" target="_blank" rel="noreferrer">
          <span className="metric-label">FRONTEND</span>
          <strong className="cyan">Live Dashboard →</strong>
        </a>
        <a className="link-card" href="https://train-eta-prediction-2-0-1.onrender.com/" target="_blank" rel="noreferrer">
          <span className="metric-label">BACKEND</span>
          <strong className="cyan">API Root →</strong>
        </a>
        <a className="link-card" href="https://train-eta-prediction-2-0-1.onrender.com/docs" target="_blank" rel="noreferrer">
          <span className="metric-label">DOCS</span>
          <strong className="cyan">Swagger UI →</strong>
        </a>
      </div>

      <div className="footer">
        <span>PATHASARTHI <b>/</b> ETA PREDICTION 2.0</span>
        <span>NOT AFFILIATED WITH INDIAN RAILWAYS</span>
      </div>
    </main>
  )
}