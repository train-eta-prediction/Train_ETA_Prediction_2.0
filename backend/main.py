from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.schemas import PredictionRequest, PredictionResponse
from backend.model_utils import predict_delay

app = FastAPI(title="Pathasarthy API")

# Allow the frontend (running on a different port) to call this API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # for hackathon simplicity; restrict in production
    allow_methods=["*"],
    allow_headers=["*"],
)

def minutes_to_hms(minutes: float) -> str:
    total_seconds = int(round(minutes * 60))
    hours = total_seconds // 3600
    mins = (total_seconds % 3600) // 60
    secs = total_seconds % 60
    return f"{hours}h {mins}m {secs}s"

@app.get("/")
def root():
    return {"message": "Train ETA Prediction API is running"}

@app.post("/predict-eta", response_model=PredictionResponse)
def predict_eta(request: PredictionRequest):
    input_data = request.model_dump()
    predicted_delay = predict_delay(input_data)

    return PredictionResponse(
        predicted_delay_min=predicted_delay,
        predicted_delay_hms=minutes_to_hms(predicted_delay)
    )


@app.get("/model-insights")
def model_insights():
    return {
        "baseline_mae": 20.16,
        "model_mae": 5.85,
        "improvement_percent": 71.0,
        "feature_importance": [
            {"feature": "Current Delay", "importance": 0.6218},
            {"feature": "Congestion Level", "importance": 0.1146},
            {"feature": "Holiday", "importance": 0.1020},
            {"feature": "Weather", "importance": 0.0601},
            {"feature": "Weekend", "importance": 0.0336},
            {"feature": "Train Identity", "importance": 0.0296},
            {"feature": "Hour of Day", "importance": 0.0108},
            {"feature": "Destination Station", "importance": 0.0104},
            {"feature": "Day of Week", "importance": 0.0064},
            {"feature": "Origin Station", "importance": 0.0055},
            {"feature": "Distance", "importance": 0.0051},
        ]
    }