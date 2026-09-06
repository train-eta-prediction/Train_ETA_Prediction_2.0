import { useState } from 'react'
import axios from 'axios'
import './App.css'

// Hardcoded sample trains for the demo (matches your synthetic data corridor)
const sampleTrains = [
  {
    train_id: "T100",
    origin_station: "Howrah",
    destination_station: "Bardhaman",
    scheduled_departure: "05:00",
    scheduled_arrival: "06:30",
    day_of_week: "Monday",
    weather: "Clear",
    congestion_level: "Low",
    current_delay_min: 10,
    distance_km: 95,
    hour_of_day: 5,
    is_weekend: false,
    is_holiday: false
  },
  {
    train_id: "T101",
    origin_station: "Bardhaman",
    destination_station: "Durgapur",
    scheduled_departure: "07:00",
    scheduled_arrival: "08:30",
    day_of_week: "Monday",
    weather: "Rain",
    congestion_level: "Medium",
    current_delay_min: 15,
    distance_km: 55,
    hour_of_day: 7,
    is_weekend: false,
    is_holiday: false
  }
]

function App() {
  const [predictions, setPredictions] = useState({})
  const [loading, setLoading] = useState({})

  const getPrediction = async (train) => {
    setLoading(prev => ({ ...prev, [train.train_id]: true }))
    try {
      const response = await axios.post('http://127.0.0.1:8000/predict-eta', train)
      setPredictions(prev => ({ ...prev, [train.train_id]: response.data }))
    } catch (error) {
      console.error("Prediction failed:", error)
      alert("Failed to get prediction. Is the backend running?")
    }
    setLoading(prev => ({ ...prev, [train.train_id]: false }))
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🚆 Train ETA Prediction Dashboard</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
        <thead>
          <tr style={{ borderBottom: '2px solid #444', textAlign: 'left' }}>
            <th style={{ padding: '8px' }}>Train</th>
            <th style={{ padding: '8px' }}>Route</th>
            <th style={{ padding: '8px' }}>Scheduled Arrival</th>
            <th style={{ padding: '8px' }}>Current Delay</th>
            <th style={{ padding: '8px' }}>Predicted Delay</th>
            <th style={{ padding: '8px' }}>Action</th>
          </tr>
        </thead>
        <tbody>
          {sampleTrains.map(train => (
            <tr key={train.train_id} style={{ borderBottom: '1px solid #333' }}>
              <td style={{ padding: '8px' }}>{train.train_id}</td>
              <td style={{ padding: '8px' }}>{train.origin_station} → {train.destination_station}</td>
              <td style={{ padding: '8px' }}>{train.scheduled_arrival}</td>
              <td style={{ padding: '8px' }}>{train.current_delay_min} min</td>
              <td style={{ padding: '8px' }}>
                {predictions[train.train_id]
                  ? predictions[train.train_id].predicted_delay_hms
                  : '—'}
              </td>
              <td style={{ padding: '8px' }}>
                <button onClick={() => getPrediction(train)} disabled={loading[train.train_id]}>
                  {loading[train.train_id] ? 'Predicting...' : 'Predict ETA'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default App