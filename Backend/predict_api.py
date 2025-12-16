from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/predict")
def predict(vehicleId: str = Query(...)):
    
    if vehicleId == "XYZ789":
        return {
            "vehicleId": "XYZ789",
            "status": "ALERT",
            "isServiceNeeded": True,
            "predictions": [
                {
                    "component": "Front Brake Pads",
                    "issue": "Brake Pad Wear",
                    "prediction": {
                        "failureTimeEstimate_days": 14,
                        "certainty_percent": 92
                    }
                }
            ],
            "recommendedAction": "Schedule service for listed components.",
            "lastUpdated": "2025-12-16T21:00:00Z"
        }

    elif vehicleId == "LMN456":
        return {
            "vehicleId": "LMN456",
            "status": "OK",
            "isServiceNeeded": False,
            "predictions": [],
            "recommendedAction": "All systems functioning normally.",
            "lastUpdated": "2025-12-16T21:05:00Z"
        }

    elif vehicleId == "PQR999":
        return {
            "vehicleId": "PQR999",
            "status": "ALERT",
            "isServiceNeeded": True,
            "predictions": [
                {
                    "component": "Battery",
                    "issue": "Low Charge Capacity",
                    "prediction": {
                        "failureTimeEstimate_days": 10,
                        "certainty_percent": 85
                    }
                }
            ],
            "recommendedAction": "Battery health check advised.",
            "lastUpdated": "2025-12-16T21:10:00Z"
        }

    else:
        return {
            "vehicleId": vehicleId,
            "status": "UNKNOWN",
            "isServiceNeeded": False,
            "predictions": [],
            "recommendedAction": "Vehicle ID not recognized.",
            "lastUpdated": "2025-12-16T21:15:00Z"
        }
