"""AgriDirect recommendation microservice.

The same transparent rule used by the web and Java contract:
recommended = (nearby_mandi_average * 0.60) + (demand_signal * 0.40)
"""
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="AgriDirect Recommendation Service")

class RecommendationRequest(BaseModel):
    nearby_mandi_prices: list[float]
    matched_demand_kg: float
    listed_quantity_kg: float
    grade_fit: float = 1.0

@app.post("/recommend")
def recommend(payload: RecommendationRequest):
    mandi_average = sum(payload.nearby_mandi_prices) / len(payload.nearby_mandi_prices)
    demand_ratio = min(payload.matched_demand_kg / max(payload.listed_quantity_kg, 1), 1.0)
    demand_signal = mandi_average * (1 + (0.20 * demand_ratio * payload.grade_fit))
    recommended = mandi_average * 0.60 + demand_signal * 0.40
    return {"mandi_average": round(mandi_average, 2), "demand_signal": round(demand_signal, 2), "recommended_range": [round(recommended - 2), round(recommended + 2)], "formula": "(nearby_mandi_average * 0.60) + (demand_signal * 0.40)"}

@app.post("/match")
def match(buyers: list[dict]):
    """Rank demand by offer price, proximity, and grade fit."""
    return sorted(buyers, key=lambda buyer: buyer["offer_price"] * .60 + buyer["proximity_score"] * .25 + buyer.get("grade_fit", 1) * 15, reverse=True)
