# 🚆 AI/ML-Based Real-Time Train ETA Prediction & Delay Forecasting System

> **An intelligent railway ETA forecasting platform that uses real-time train movement, historical journey patterns, operational conditions, and external factors to continuously predict train arrival times at upcoming stations.**

---

## 📌 Overview

Train delays are dynamic and can change throughout a journey due to congestion, signal delays, speed restrictions, weather conditions, extended station halts, and other operational factors.

A traditional system may simply display the current delay:

> **Train delayed by 20 minutes**

However, this does not answer the more useful question:

> **"When will the train actually reach the next stations?"**

This project addresses that problem using **Artificial Intelligence and Machine Learning**.

The system continuously analyzes the train's current status and predicts its **future delay and Estimated Time of Arrival (ETA)** at upcoming stations.

### Example

If a train is currently:

```text
Current Location : Bardhaman
Current Delay    : +18 minutes
Current Speed    : 72 km/h
```

The system can forecast:

```text
Station       Scheduled ETA     Predicted ETA
------------------------------------------------
Durgapur      13:00             13:27
Asansol       14:00             14:34
Dhanbad       15:30             16:12
```

As new train movement data arrives, these predictions are automatically recalculated.

---

# 🎯 Problem Statement

Railway journeys frequently experience delays that are difficult to predict accurately because delay propagation is influenced by multiple factors.

A train that is currently 10 minutes late may:

* recover some of its lost time,
* lose additional time because of congestion,
* experience signal-related delays,
* encounter speed restrictions,
* spend longer than scheduled at a station,
* or be affected by weather and operational conditions.

Therefore, simply adding the current delay to every future station's scheduled arrival time is often inaccurate.

### The objective of this project is to develop an AI/ML-powered system that can:

* Track the current status of trains.
* Analyze historical train running patterns.
* Predict future delays.
* Forecast ETA at upcoming stations.
* Dynamically update predictions when new information arrives.
* Estimate prediction confidence.
* Identify potential delay risks.
* Explain the factors contributing to ETA changes.

---

# 💡 Proposed Solution

The proposed system combines **real-time data processing** with **machine learning-based forecasting**.

```text
                ┌─────────────────────┐
                │   Live Train Data   │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Historical Dataset  │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │  Data Processing    │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │ Feature Engineering │
                └──────────┬──────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   ML ETA Model      │
                │      XGBoost        │
                └──────────┬──────────┘
                           │
                           ▼
              ┌──────────────────────────┐
              │ Future Delay Prediction  │
              │       & ETA Forecast     │
              └────────────┬─────────────┘
                           │
                           ▼
                ┌─────────────────────┐
                │   Backend API       │
                │      FastAPI        │
                └──────────┬──────────┘
                           │
              ┌────────────┴────────────┐
              ▼                         ▼
       Passenger Dashboard        Control Dashboard
```

---

# 🔑 Key Features

## 1. 🚆 Real-Time Train Tracking

The system maintains the current state of each train, including:

* Train number
* Current location
* Current station
* Next station
* Current speed
* Current delay
* Route
* Timestamp of latest update

---

## 2. 🤖 AI/ML-Based ETA Prediction

Instead of assuming that the current delay remains constant, the machine learning model predicts future delay based on multiple factors.

Example input:

```text
Current Delay
Current Speed
Distance to Next Station
Historical Section Travel Time
Previous Station Delay
Day of Week
Time of Day
Weather Conditions
Network Congestion
```

Output:

```text
Predicted Future Delay
```

The predicted ETA can then be calculated as:

```text
Predicted ETA =
Scheduled ETA + Predicted Delay
```

---

# 📊 3. Historical Running Pattern Analysis

Historical train data can reveal patterns such as:

* Average travel time between stations
* Typical delays on particular routes
* Day-of-week variations
* Peak-hour delays
* Station halt variations
* Seasonal effects
* Historical delay propagation

Example:

```text
Section: Bardhaman → Durgapur

Average Travel Time : 85 minutes

Monday              : 88 minutes
Tuesday             : 84 minutes
Friday              : 93 minutes
```

These patterns become useful features for the ML model.

---

# 🌦️ 4. External Factors

The system can optionally incorporate external conditions such as:

* Rainfall
* Temperature
* Visibility
* Extreme weather
* Day of week
* Holidays
* Peak traffic periods

These factors can help explain unexpected changes in train movement.

---

# 🚦 5. Delay Propagation

A major feature of the system is the ability to model **delay propagation**.

Example:

```text
Current Delay
     +10 min
        │
        ▼
   Congestion
     +5 min
        │
        ▼
   Station Halt
     +3 min
        │
        ▼
Future Delay
     +18 min
```

The system does not assume that delay remains constant throughout the journey.

---

# 📈 6. Dynamic ETA Updates

Predictions are continuously updated whenever new train data becomes available.

### Initial prediction

```text
Durgapur ETA → 13:30
Asansol ETA  → 14:35
```

### New congestion detected

```text
Durgapur ETA → 13:38
Asansol ETA  → 14:47
```

### Train recovers some time

```text
Durgapur ETA → 13:34
Asansol ETA  → 14:42
```

This makes the system a **dynamic forecasting platform rather than a static delay calculator**.

---

# 🎯 7. Confidence Score

Along with ETA, the system can provide a prediction confidence score.

Example:

```text
Durgapur
ETA        : 13:27
Confidence : 92%

Asansol
ETA        : 14:34
Confidence : 84%

Dhanbad
ETA        : 16:12
Confidence : 68%
```

Confidence may decrease for stations farther into the future because uncertainty accumulates.

---

# ⚠️ 8. Delay Risk Prediction

The system can classify the probability of significant future delay.

Example:

```text
🟢 LOW       → Low delay probability
🟡 MEDIUM    → Moderate delay probability
🟠 HIGH      → High delay probability
🔴 CRITICAL  → Severe delay probability
```

The risk score can consider:

* Current delay
* Historical delay
* Congestion
* Weather
* Speed restrictions
* Current train speed
* Route characteristics

---

# 🔍 9. Explainable Predictions

The system should not behave like a complete black box.

Whenever the ETA changes, the dashboard can display possible contributing factors.

Example:

```text
ETA changed by +12 minutes

🔴 Network congestion      +7 min
🟠 Speed restriction       +4 min
🟢 Historical recovery     -2 min
🟠 Extended station halt   +3 min
                           ───────
                            +12 min
```

This provides **interpretable information for railway operators and passengers**.

---

# 🧠 Machine Learning Approach

## Recommended Model

For the prototype, **XGBoost** is a suitable choice because it performs well on structured/tabular data and can handle nonlinear relationships between operational features and delay.

### Model Input

```text
current_delay
current_speed
distance_to_next_station
historical_section_time
previous_station_delay
day_of_week
hour
weather
congestion
scheduled_halt
actual_halt
```

### Model Output

```text
predicted_future_delay
```

Then:

```text
Predicted ETA =
Scheduled ETA + Predicted Future Delay
```

---

# 🧪 Baseline vs ML Prediction

A simple baseline can be implemented first:

```text
Baseline ETA =
Scheduled ETA + Current Delay
```

The ML model can then be compared against this baseline.

### Example

```text
Actual Arrival       : 13:31

Baseline Prediction  : 13:40
Error                : 9 min

ML Prediction        : 13:34
Error                : 3 min
```

This comparison provides measurable evidence that the ML model improves ETA forecasting.

---

# 📐 Evaluation Metrics

The model can be evaluated using:

### MAE — Mean Absolute Error

Measures the average difference between predicted and actual arrival time.

```text
MAE = Average(|Actual ETA - Predicted ETA|)
```

For example:

> **MAE = 4.8 minutes**

means that the system's prediction is off by approximately 4.8 minutes on average.

### Other metrics

* RMSE
* MAPE
* R² Score

For ETA prediction, **MAE is particularly easy to communicate** during a hackathon presentation.

---

# 🗃️ Dataset Structure

A prototype dataset can contain:

| Column                    | Description                    |
| ------------------------- | ------------------------------ |
| `train_id`                | Unique train identifier        |
| `station_id`              | Station identifier             |
| `timestamp`               | Time of observation            |
| `latitude`                | Current latitude               |
| `longitude`               | Current longitude              |
| `current_speed`           | Current train speed            |
| `current_delay`           | Current delay in minutes       |
| `scheduled_arrival`       | Scheduled arrival time         |
| `actual_arrival`          | Actual arrival time            |
| `distance_to_station`     | Distance to upcoming station   |
| `historical_section_time` | Historical average travel time |
| `previous_station_delay`  | Delay at previous station      |
| `day_of_week`             | Day of operation               |
| `hour`                    | Hour of operation              |
| `weather`                 | Weather condition              |
| `congestion`              | Network congestion indicator   |
| `future_delay`            | Target variable                |

---

# 🔄 Real-Time Processing

The system can simulate or receive a continuous stream of train updates.

```text
12:00 → Train at Location A
       ↓
12:05 → Train at Location B
       ↓
12:10 → Train at Location C
       ↓
12:15 → New delay detected
       ↓
       ML Model
       ↓
Updated ETA
```

Every new observation can trigger a new prediction.

---

# 🏗️ System Architecture

```text
┌──────────────────────────────────────────────────┐
│                   DATA SOURCES                   │
├──────────────────────────────────────────────────┤
│ Live Train Data │ Historical Data │ Weather Data │
└────────┬────────┴─────────┬───────┴───────┬──────┘
         │                  │               │
         └──────────────────┼───────────────┘
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
                  │ XGBoost Model    │
                  └────────┬─────────┘
                           ▼
              ┌─────────────────────────┐
              │ ETA & Delay Prediction  │
              └────────────┬────────────┘
                           ▼
                  ┌──────────────────┐
                  │ FastAPI Backend   │
                  └────────┬─────────┘
                           ▼
                  ┌──────────────────┐
                  │ React Dashboard   │
                  └──────────────────┘
```

---

# 💻 Technology Stack

## Frontend

* React
* TypeScript
* Tailwind CSS
* Leaflet / Mapbox
* Recharts

## Backend

* Python
* FastAPI
* Pydantic

## Machine Learning

* Python
* Pandas
* NumPy
* Scikit-learn
* XGBoost

## Database

### Prototype

* SQLite

### Production-oriented architecture

* PostgreSQL
* Redis

---

# 📁 Suggested Project Structure

```text
train-eta-prediction/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── routes/
│   ├── models/
│   ├── services/
│   └── requirements.txt
│
├── ml/
│   ├── dataset/
│   ├── preprocessing.py
│   ├── train.py
│   ├── predict.py
│   └── model.pkl
│
├── data/
│   ├── historical_trains.csv
│   └── simulated_live_data.csv
│
├── notebooks/
│   └── model_analysis.ipynb
│
├── README.md
└── requirements.txt
```

---

# 🚀 Prototype Scope

For a hackathon, the project should initially focus on a **single railway corridor** instead of attempting to model the entire railway network.

Example:

```text
Howrah
   ↓
Bardhaman
   ↓
Durgapur
   ↓
Asansol
   ↓
Dhanbad
```

The prototype can support:

* 5–10 trains
* 5–10 stations
* Simulated real-time train movement
* Historical running data
* ML-based ETA prediction
* Delay propagation
* Dynamic dashboard updates

This keeps the implementation realistic and achievable within a short hackathon.

---

# 🖥️ Dashboard

The dashboard can provide:

```text
┌──────────────────────────────────────────────────┐
│          🚆 TRAIN ETA INTELLIGENCE               │
├──────────────────────────────────────────────────┤
│                                                  │
│ Search Train: [ 12345                    ] 🔍    │
│                                                  │
│ Train 12345                                      │
│ Howrah → New Delhi                               │
│                                                  │
│ Current Speed     72 km/h                        │
│ Current Delay     +18 min                        │
│ ETA Confidence    91%                            │
│                                                  │
├──────────────────────────────────────────────────┤
│                                                  │
│ Station       Scheduled       Predicted          │
│                                                  │
│ Bardhaman     11:30           11:48              │
│ Durgapur      13:00           13:27              │
│ Asansol       14:00           14:34              │
│ Dhanbad       15:30           16:12              │
│                                                  │
└──────────────────────────────────────────────────┘
```

The interface can additionally display:

* Live railway map
* Train position
* Route
* Delay graph
* ETA timeline
* Prediction confidence
* Delay risk
* Prediction explanations

---

# 🔥 Hackathon Demonstration

A strong demonstration can simulate changing railway conditions.

### Step 1 — Normal operation

```text
Train 12345
Current Delay: +2 min
Durgapur ETA: 13:05
```

### Step 2 — Congestion detected

```text
🚨 NETWORK CONGESTION

Current Delay: +14 min
Durgapur ETA: 13:17
```

### Step 3 — Speed restriction

```text
⚠ SPEED RESTRICTION

Durgapur ETA: 13:25
```

### Step 4 — Train recovers time

```text
🚆 SPEED INCREASE DETECTED

Durgapur ETA: 13:21
```

This demonstrates that the system is **continuously forecasting rather than simply displaying a fixed delay**.

---

# 📊 Expected Benefits

## For Passengers

* More accurate arrival information
* Better journey planning
* Reduced uncertainty
* Improved connection planning

## For Railway Operators

* Early identification of potential delays
* Better operational visibility
* Delay propagation analysis
* Data-driven decision support

## For Station Management

* Better passenger-flow planning
* More accurate platform information
* Improved coordination

---

# 🔮 Future Enhancements

The prototype can eventually be expanded to include:

* Real railway GPS feeds
* Large-scale railway network modeling
* Real-time signal information
* Platform availability
* Track occupancy
* Advanced weather integration
* Graph Neural Networks for railway networks
* Transformer-based time-series forecasting
* Passenger crowd prediction
* Connection-aware ETA prediction
* Automated alerts
* Mobile application
* Multilingual passenger interface

---

# 🔐 Data & Deployment Considerations

A production implementation would require reliable railway operational data and appropriate access controls.

The hackathon prototype can use:

* Publicly available datasets
* Synthetic data
* Simulated real-time streams
* Historical datasets

No sensitive operational railway information is required for demonstrating the core ML concept.

---

# 🎯 Project Objective in One Sentence

> **To build an intelligent real-time railway ETA forecasting system that continuously combines live train movement, historical running patterns, operational conditions, and external factors to predict future arrival times and delays at upcoming stations.**

---

# 🏆 Why This Approach Is Different

A conventional train tracking system answers:

> **"Where is the train now?"**

A basic delay system answers:

> **"How late is the train now?"**

This project aims to answer:

> **"Where will the train be, when will it arrive at upcoming stations, how likely is the prediction to be correct, and why is the ETA changing?"**

That shift from **tracking → prediction → explainable forecasting** is the central concept of the project.

---

# 👥 Team Roles

A small hackathon team can divide the work into:

### AI/ML Developer

* Dataset preparation
* Feature engineering
* XGBoost model
* Model evaluation
* ETA prediction

### Backend Developer

* FastAPI
* Real-time data processing
* Prediction API
* Database

### Frontend Developer

* React
* TypeScript
* Dashboard
* Railway map
* ETA visualization

### Integration / Presentation

* Live simulation
* API integration
* Testing
* Demo
* Presentation

---

# 📌 Final Deliverable

The final prototype should demonstrate:

```text
             LIVE TRAIN
                  │
                  ▼
        Current Train Status
                  │
                  ▼
          Feature Engineering
                  │
                  ▼
            ML Prediction
                  │
          ┌───────┴────────┐
          ▼                ▼
     Future ETA       Delay Risk
          │                │
          └───────┬────────┘
                  ▼
          Explainable Result
                  │
                  ▼
        Real-Time Dashboard
```

### Core Output

```text
Train: 12345

Current Delay: +18 minutes

Upcoming Stations:

Durgapur
ETA: 13:27
Confidence: 92%

Asansol
ETA: 14:34
Confidence: 84%

Dhanbad
ETA: 16:12
Confidence: 68%

Delay Risk: HIGH
```

---

## 🚆 Conclusion

The **AI/ML-Based Real-Time Train ETA Prediction & Delay Forecasting System** transforms railway information from a simple status-reporting mechanism into a predictive intelligence platform.

By combining **real-time train movement, historical patterns, operational conditions, and machine learning**, the system can continuously estimate future arrival times, detect potential delay risks, and provide explainable predictions.

The hackathon prototype focuses on proving the core concept through a limited railway corridor and simulated real-time data, while the architecture is designed to be extensible toward large-scale railway network deployment.
