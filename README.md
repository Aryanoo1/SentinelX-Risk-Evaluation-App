# SentinelX - Intelligent Risk, Fraud & Financial Experiences

SentinelX is a real-time transaction risk scoring and behavioral anomaly detection platform featuring an institutional Compliance Portal and a Consumer Security App.

---

## Architecture Overview

* **Backend (`/backend`)**:
  * **FastAPI & Uvicorn**: High-performance asynchronous REST API.
  * **Behavioral Biometrics**: Keystroke dynamics and flight-time anomaly detection.
  * **Network Topology Detection**: Mule-ring cluster identification and graph structure mapping.
  * **Explainable AI (SHAP)**: Factor-by-factor risk contribution breakdown.
  * **Automated SAR Generation**: One-click FinCEN-compliant Suspicious Activity Report drafting.

* **Frontend (`/frontend`)**:
  * **Next.js 14 (App Router)** & **React 18**: Modern client/server architecture.
  * **TailwindCSS**: Sleek fintech dark-mode aesthetic.
  * **Recharts**: Interactive Sankey diagram for visualizing money mule transaction rings.
  * **Lucide Icons**: Modern icons for actions, biometric indicators, and card controls.

---

## Getting Started

### 1. Prerequisites
* Python 3.10+
* Node.js 18+ and npm

### 2. Backend Setup
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```
API Documentation will be available at: [http://localhost:8000/docs](http://localhost:8000/docs)

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
The application will be live at: [http://localhost:3000](http://localhost:3000)

---

## Routes

* `/` - Portal Hub (Executive overview & launcher)
* `/compliance` - Institutional AML & Fraud Compliance Console
* `/consumer` - Consumer Security & Card Controls App
