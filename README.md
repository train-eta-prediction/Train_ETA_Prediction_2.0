# পথসারথি (Pathasarthy) — Train ETA Prediction 2.0

> **A live, intelligent railway forecasting platform that predicts *when* a train will actually arrive — not just how late it currently is — by learning from real-time movement, historical journey patterns, and operational conditions.**

**🔗 Live Demo:** [train-eta-prediction-2-0.vercel.app](https://train-eta-prediction-2-0.vercel.app/)

---

## 📌 Overview

Railway delays evolve constantly — congestion, signal holds, speed restrictions, weather, and extended halts all reshape a train's journey minute by minute.

A traditional system stops at:

> **"Train delayed by 20 minutes."**

পথসারথি (Pathasarthy) answers the question travelers actually care about:

> **"When will this train really reach my station — and how confident should I be?"**

### Example

```text
Current Location : Bardhaman
Current Delay    : +18 minutes
Current Speed    : 72 km/h
```

পথসারথি (Pathasarthy) forecasts:

```text
Station       Scheduled ETA     Predicted ETA     Confidence
----------------------------------------------------------------
Durgapur      13:00             13:27             92%
Asansol       14:00             14:34             84%
Dhanbad       15:30             16:12             68%
```

Every new movement update triggers an automatic recalculation.

---

## 🎯 Problem Statement

A train running 10 minutes late might recover time, lose more of it to congestion, hit a signal delay, sit through a speed restriction, overrun a station halt, or be slowed by weather. Simply adding today's delay to every future scheduled time is a weak assumption — and it's the assumption most public train-tracking tools still make.

**পথসারথি (Pathasarthy) is built to:**

* Track live train status across a corridor
* Learn from historical running patterns
* Forecast future delay and ETA at every upcoming station
* Recompute predictions the moment new data arrives
* Quantify how confident each prediction is
* Flag delay risk before it becomes visible on the platform
* Explain *why* an ETA moved, not just *that* it moved

---

## ✨ What Makes This a Rebuild, Not Just a Refresh

The original prototype proved the core forecasting concept. This version pushes it further:

| Area | v1 (Original) | v2.0 (This Rebuild) |
|---|---|---|
| **Deployment** | Local/demo only | Live, publicly hosted on Vercel |
| **ETA logic** | Single-shot prediction | Continuously re-forecasts as new telemetry streams in |
| **Explainability** | Conceptual | Per-factor delay attribution shown alongside every ETA change |
| **Risk signaling** | Static thresholds | Confidence-weighted risk tiers (🟢🟡🟠🔴) that widen with forecast horizon |
| **UI** | Dashboard mockup | Interactive live map + timeline, built for a real deployed frontend |
| **Scope** | Conceptual corridor | Runnable single-corridor simulation (5–10 trains, 5–10 stations) end-to-end |

---

## 🏗️ System Architecture

```text
┌──────────────────────────────────────────────────┐
│                   DATA SOURCES                   │
├──────────────────────────────────────────────────┤
│ Live Train Feed │ Historical Runs │ Weather/Context│
└────────┬────────┴────────┬────────┴───────┬───────┘
         │                 │                │
         └─────────────────┼────────────────┘
                            ▼
                  ┌──────────────────┐
                  │ Data Processing   │
                  └────────┬─────────┘
                           ▼
                  ┌──────────────────┐
                  │ Feature          │
                  │ Engineering      │
                  └────────┬─────────┘
                           ▼
                  ┌──────────────────┐
                  │ XGBoost ETA Model│
                  └────────┬─────────┘
                           ▼
              ┌─────────────────────────┐
              │ Delay Forecast + Risk   │
              │ + Explainability Layer  │
              └────────────┬────────────┘
                           ▼
                  ┌──────────────────┐
                  │ FastAPI Backend   │
                  └────────┬─────────┘
                           ▼
                  ┌──────────────────┐
                  │ React Dashboard   │
                  │ (Live on Vercel)  │
                  └──────────────────┘
```

---

## 🔑 Key Features

### 1. 🚆 Real-Time Train Tracking
Maintains live state per train: number, current & next station, speed, delay, route, and last-update timestamp.

### 2. 🤖 ML-Based ETA Prediction
Instead of assuming delay stays constant, an XGBoost model forecasts *future* delay from:

```text
current_delay · current_speed · distance_to_next_station
historical_section_time · previous_station_delay
day_of_week · hour · weather · congestion
scheduled_halt · actual_halt
```

```text
Predicted ETA = Scheduled ETA + Predicted Future Delay
```

### 3. 📊 Historical Pattern Learning
Surfaces recurring patterns — average section travel times, day-of-week variation, peak-hour drag, seasonal effects — and feeds them back into the model as features.

### 4. 🚦 Delay Propagation Modeling
Delay isn't static; it compounds:

```text
Current Delay +10 min → Congestion +5 min → Station Halt +3 min → Future Delay +18 min
```

### 5. 📈 Dynamic, Streaming ETA Updates
Every new observation reruns the forecast:

```text
Initial:            Durgapur 13:30 · Asansol 14:35
Congestion detected: Durgapur 13:38 · Asansol 14:47
Train recovers time: Durgapur 13:34 · Asansol 14:42
```

### 6. 🎯 Confidence Scoring
Uncertainty compounds with distance into the future:

```text
Durgapur → 13:27 (92% confidence)
Asansol  → 14:34 (84% confidence)
Dhanbad  → 16:12 (68% confidence)
```

### 7. ⚠️ Delay Risk Classification
```text
🟢 LOW      🟡 MEDIUM      🟠 HIGH      🔴 CRITICAL
```
Derived from current delay, historical delay behavior, congestion, weather, speed restrictions, and route characteristics.

### 8. 🔍 Explainable Predictions
No black box — every ETA shift is broken into contributing factors:

```text
ETA changed by +12 minutes

🔴 Network congestion      +7 min
🟠 Speed restriction       +4 min
🟢 Historical recovery     -2 min
🟠 Extended station halt   +3 min
                           ───────
                            +12 min
```

---

## 🧠 Machine Learning Approach

**Model:** XGBoost — strong on structured/tabular operational data with nonlinear delay dynamics.

**Baseline comparison** (naive: `Scheduled ETA + Current Delay`) vs. **ML prediction**:

```text
Actual Arrival       : 13:31
Baseline Prediction  : 13:40   (error: 9 min)
ML Prediction        : 13:34   (error: 3 min)
```

**Evaluation metrics:** MAE (primary, easiest to communicate), RMSE, MAPE, R².

> MAE = 4.8 minutes → predictions are off by ~4.8 minutes on average.

---

## 🗃️ Dataset Structure

| Column | Description |
|---|---|
| `train_id` | Unique train identifier |
| `station_id` | Station identifier |
| `timestamp` | Time of observation |
| `latitude` / `longitude` | Current position |
| `current_speed` | Current train speed |
| `current_delay` | Current delay (minutes) |
| `scheduled_arrival` / `actual_arrival` | Scheduled vs. actual arrival |
| `distance_to_station` | Distance to upcoming station |
| `historical_section_time` | Historical average travel time |
| `previous_station_delay` | Delay at previous station |
| `day_of_week` / `hour` | Time context |
| `weather` | Weather condition |
| `congestion` | Network congestion indicator |
| `future_delay` | Target variable |

---

## 💻 Technology Stack

**Frontend:** React · TypeScript · Tailwind CSS · Leaflet/Mapbox · Recharts · deployed on **Vercel**
**Backend:** Python · FastAPI · Pydantic
**Machine Learning:** Pandas · NumPy · Scikit-learn · XGBoost
**Database:** SQLite (prototype) → PostgreSQL + Redis (production path)

---

## 📁 Project Structure

```text
train-eta-prediction/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
├── backend/
│   ├── main.py
│   ├── routes/
│   ├── models/
│   ├── services/
│   └── requirements.txt
├── ml/
│   ├── dataset/
│   ├── preprocessing.py
│   ├── train.py
│   ├── predict.py
│   └── model.pkl
├── data/
│   ├── historical_trains.csv
│   └── simulated_live_data.csv
├── notebooks/
│   └── model_analysis.ipynb
├── README.md
└── requirements.txt
```

---

## 🚀 Prototype Scope

Focused on a single corridor to keep the demo realistic and fully runnable:

```text
Howrah → Bardhaman → Durgapur → Asansol → Dhanbad
```

Supports 5–10 trains, 5–10 stations, simulated live movement, historical running data, ML-based ETA prediction, delay propagation, and a dynamically updating dashboard — all reachable through the live deployment above.

---

## 🖥️ Dashboard Preview

```text
┌──────────────────────────────────────────────────┐
│          🚆 পথসারথি (Pathasarthy) — TRAIN ETA INTELLIGENCE     │
├──────────────────────────────────────────────────┤
│ Search Train: [ 12345                    ] 🔍      │
│                                                    │
│ Train 12345 · Howrah → New Delhi                  │
│ Current Speed  72 km/h   Current Delay  +18 min    │
│ ETA Confidence 91%                                 │
├──────────────────────────────────────────────────┤
│ Station     Scheduled     Predicted     Confidence │
│ Bardhaman   11:30         11:48         95%        │
│ Durgapur    13:00         13:27         92%        │
│ Asansol     14:00         14:34         84%        │
│ Dhanbad     15:30         16:12         68%        │
└──────────────────────────────────────────────────┘
```

Also includes a live railway map with train position, delay graph, ETA timeline, and per-factor prediction explanations.

---

## 🔥 Live Demo Walkthrough

1. **Normal operation** — Train 12345, +2 min delay, Durgapur ETA 13:05
2. **🚨 Congestion detected** — delay jumps to +14 min, Durgapur ETA shifts to 13:17
3. **⚠️ Speed restriction** — Durgapur ETA moves to 13:25
4. **🚆 Speed recovery** — Durgapur ETA pulls back to 13:21

This sequence is what makes পথসারথি (Pathasarthy) a *continuous forecasting platform*, not a fixed delay readout — try it live at [train-eta-prediction-2-0.vercel.app](https://train-eta-prediction-2-0.vercel.app/).

---

## 📊 Who This Helps

**Passengers** — more accurate arrival info, better journey and connection planning, less uncertainty.
**Railway operators** — early warning on delay risk, operational visibility, propagation analysis.
**Station management** — better passenger-flow and platform planning.

---

## 🔮 Future Enhancements

* Real railway GPS feeds and large-scale network modeling
* Real-time signal and track-occupancy data
* Platform availability integration
* Graph Neural Networks for network-wide delay propagation
* Transformer-based time-series forecasting
* Connection-aware ETA prediction and automated alerts
* Native mobile app with multilingual support

---

## 🔐 Data & Deployment Notes

The hosted demo runs on publicly available and synthetic data with simulated real-time streams — no sensitive operational railway data is required to demonstrate the core ML concept.

---

## 👥 Team Roles

**AI/ML Developer** — dataset prep, feature engineering, XGBoost model, evaluation
**Backend Developer** — FastAPI, real-time processing, prediction API, database
**Frontend Developer** — React, TypeScript, dashboard, map, ETA visualization
**Integration/Presentation** — live simulation, API integration, testing, demo

---

## 🎯 One-Sentence Summary

> পথসারথি (Pathasarthy) continuously combines live train movement, historical running patterns, and operational context to forecast *future* arrival times and delays — with confidence and explainability — at every upcoming station.

**🔗 Try it live:** [https://train-eta-prediction-2-0.vercel.app/](https://train-eta-prediction-2-0.vercel.app/)