// App.jsx
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import ModelInsights from './pages/ModelInsights'
import HistoricalData from './pages/HistoricalData'
import About from './pages/About'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <header className="topbar">
        <div className="brand-lockup">
          <div className="brand-mark">🚄</div>
          <p className="brand-name">Pathasarthy</p>
        </div>

        <nav className="main-nav">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Dashboard
          </NavLink>
          <NavLink to="/insights" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Model Insights
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            Historical Data
          </NavLink>
          <NavLink to="/about" className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}>
            About
          </NavLink>
        </nav>

        <div className="system-state">
          <span className="pulse-dot" /> <span>SYSTEM NOMINAL</span>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/insights" element={<ModelInsights />} />
        <Route path="/history" element={<HistoricalData />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App