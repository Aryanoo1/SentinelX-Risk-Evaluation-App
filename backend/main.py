from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict

app = FastAPI(title="SentinelX Risk Evaluation API", version="1.0.0")

# Enable CORS for frontend clients (supports localhost with credentials)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:3001",
        "http://127.0.0.1:3001",
    ],
    allow_origin_regex=r"https?://.*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Transaction(BaseModel):
    user_id: str
    amount: float
    merchant_category: str
    location_delta_km: float
    keystroke_flight_time_ms: float
    is_deepfake_suspected: bool

class ShapImpact(BaseModel):
    factor: str
    impact: str

class EvaluationResponse(BaseModel):
    risk_score: float
    is_mule_ring: bool = False
    graph_cluster: List[str] = []
    explainability_shap: List[ShapImpact] = []
    auto_sar_draft: str = ""
    customer_nudge: str = ""

def _risk_components(tx: Transaction) -> Dict[str, float]:
    """Calculate raw component contributions (0-1) for each feature."""
    # Normalise each factor to a 0-1 range.
    amount_score = min(max(tx.amount, 0.0) / 5000.0, 1.0)  # >$5,000 high risk
    # Keystroke dynamics: flight times under 80ms suggest automated script/botting.
    velocity_score = min(80.0 / max(tx.keystroke_flight_time_ms, 1.0), 1.0)
    location_score = min(max(tx.location_delta_km, 0.0) / 2000.0, 1.0)  # >2,000 km unusual
    deepfake_score = 0.4 if tx.is_deepfake_suspected else 0.0

    # Bounded weighted sum
    total = min(
        0.4 * amount_score +
        0.25 * velocity_score +
        0.2 * location_score +
        deepfake_score,
        1.0
    )
    return {
        "amount": amount_score,
        "velocity": velocity_score,
        "location": location_score,
        "deepfake": deepfake_score,
        "total": total,
    }

def _shap_explain(comps: Dict[str, float]) -> List[ShapImpact]:
    impacts = []
    for factor in ["location", "amount", "velocity", "deepfake"]:
        pct = int(round(comps[factor] * 100))
        if pct > 0:
            impacts.append(ShapImpact(factor=factor.replace("_", " ").title(), impact=f"+{pct}%"))
    return impacts

def _generate_sar(tx: Transaction, risk: float, shap_impacts: List[ShapImpact]) -> str:
    factors_str = ', '.join([i.factor for i in shap_impacts]) or "Multiple risk anomalies"
    return (
        f"SUSPICIOUS ACTIVITY REPORT (SAR)\n"
        f"-----------------------------------\n"
        f"User ID: {tx.user_id}\n"
        f"Transaction Amount: ${tx.amount:,.2f}\n"
        f"Merchant Category: {tx.merchant_category}\n"
        f"Location Delta: {tx.location_delta_km:.1f} km\n"
        f"Keystroke Flight Time: {tx.keystroke_flight_time_ms:.0f} ms\n"
        f"Deepfake Suspected: {'YES' if tx.is_deepfake_suspected else 'NO'}\n"
        f"Calculated Risk Score: {risk:.2f}\n\n"
        f"Narrative: The transaction exhibits multiple high-risk indicators including "
        f"{factors_str}. "
        f"Further investigation is recommended."
    )

def _mule_ring_example() -> List[str]:
    return ["User_A", "Shell_Co_Ltd", "Mule_Wallet_99"]

@app.get("/")
async def root():
    return {"status": "ok", "service": "SentinelX Risk Evaluation API", "version": "1.0.0"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/api/v1/evaluate-transaction", response_model=EvaluationResponse)
async def evaluate_transaction(tx: Transaction):
    comps = _risk_components(tx)
    risk = round(comps["total"], 2)
    is_mule = risk > 0.75
    graph = _mule_ring_example() if is_mule else []
    shap = _shap_explain(comps)
    sar = _generate_sar(tx, risk, shap) if (risk > 0.80 or is_mule) else ""

    # Customer nudge logic - context-aware heuristics
    if risk > 0.7:
        nudge = "Security Alert: Unusual high-risk transaction detected. Tap to freeze card."
    elif tx.amount > 3000:
        nudge = "Spending Insight: Large purchase - consider budgeting to avoid overspend."
    else:
        nudge = "All clear - your transaction looks normal."

    return EvaluationResponse(
        risk_score=risk,
        is_mule_ring=is_mule,
        graph_cluster=graph,
        explainability_shap=shap,
        auto_sar_draft=sar,
        customer_nudge=nudge,
    )
