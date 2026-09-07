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