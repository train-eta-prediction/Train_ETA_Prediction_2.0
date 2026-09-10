import joblib
import pandas as pd
from pathlib import Path

# Build an absolute path based on this file's location, so it works
# regardless of where the server process is started from
BASE_DIR = Path(__file__).resolve().parent.parent  # goes up from backend/ to project root
ML_DIR = BASE_DIR / "ml"

model = joblib.load(ML_DIR / "train_delay_model.pkl")
encoders = joblib.load(ML_DIR / "label_encoders.pkl")
feature_cols = joblib.load(ML_DIR / "feature_cols.pkl")

def predict_delay(input_data: dict) -> float:
    """
    input_data should contain raw values, e.g.:
    {
        "train_id": "T100",
        "origin_station": "Howrah",
        "destination_station": "Bardhaman",
        "day_of_week": "Monday",
        "weather": "Clear",
        "congestion_level": "Low",
        "current_delay_min": 10.0,
        "distance_km": 95,
        "hour_of_day": 6,
        "is_weekend": False,
        "is_holiday": False
    }
    """
    row = {}
    categorical_cols = ['train_id', 'origin_station', 'destination_station',
                         'day_of_week', 'weather', 'congestion_level']

    for col in categorical_cols:
        le = encoders[col]
        row[col + '_enc'] = le.transform([input_data[col]])[0]

    row['current_delay_min'] = input_data['current_delay_min']
    row['distance_km'] = input_data['distance_km']
    row['hour_of_day'] = input_data['hour_of_day']
    row['is_weekend'] = input_data['is_weekend']
    row['is_holiday'] = input_data['is_holiday']

    X_new = pd.DataFrame([row])[feature_cols]
    prediction = model.predict(X_new)[0]
    return round(float(prediction), 2)