from pydantic import BaseModel

class PredictionRequest(BaseModel):
    train_id: str
    origin_station: str
    destination_station: str
    day_of_week: str
    weather: str
    congestion_level: str
    current_delay_min: float
    distance_km: float
    hour_of_day: int
    is_weekend: bool
    is_holiday: bool

class PredictionResponse(BaseModel):
    predicted_delay_min: float
    predicted_delay_hms: str