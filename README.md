
  
# 🛰️ Subsidence Watch
**Real-Time Satellite-Powered Ground Subsidence Monitoring Platform**

[![FastAPI](https://img.shields.io/badge/FastAPI-005571?style=for-the-badge&logo=fastapi)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Leaflet](https://img.shields.io/badge/Leaflet-199900?style=for-the-badge&logo=Leaflet&logoColor=white)](https://leafletjs.com/)

An automated, open-data monitoring platform built for real-time risk detection and community safety in coal mining regions (currently monitoring the Raniganj Coalfield, West Bengal).

</div>

---

## 🌍 Overview

**Subsidence Watch** combines AI-powered satellite monitoring (Sentinel-1 / InSAR) with localized citizen reporting to detect and visualize potential land subsidence before it becomes a critical hazard. By merging highly technical geospatial data with an accessible, modern dashboard, it empowers both local governments and citizens to stay informed about ground stability.

### ✨ Key Features
- **🛰️ Live Monitoring Dashboard:** Real-time visualization of ground displacement rates (mm/yr) across multiple geographic zones.
- **🗺️ Interactive Risk Maps:** Deep integrations with Leaflet and PostGIS for precise, interactive plotting of high-risk subsidence zones.
- **📱 Citizen Reporting System:** A seamless portal for locals to report physical ground anomalies (cracks, sinkholes) with automated risk-escalation algorithms.
- **⚡ High-Performance Tech Stack:** A blazing-fast React/Vite frontend polling a robust, async FastAPI backend.

---

## 🏗️ Architecture

The project is structured as a modern monorepo:

- `/modern-frontend` - React SPA (Vite, Tailwind, SWR, Framer Motion, Leaflet).
- `/backend` - Python API (FastAPI, SQLAlchemy, asyncpg).
- **Database** - PostgreSQL + PostGIS (Containerized via Docker).

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- Python (3.11+)
- Docker & Docker Compose (for the PostGIS database)

### 1. Database Setup
Spin up the PostGIS database using Docker.
```bash
cd backend
docker-compose up -d
```

### 2. Backend Setup
Set up your virtual environment, install dependencies, and run the database migrations.
```bash
cd backend

# Create and activate virtual environment
python -m venv venv
.\venv\Scripts\Activate  # On Windows
# source venv/bin/activate # On macOS/Linux

# Install dependencies
pip install -r requirements.txt

# Setup Environment variables
cp .env.example .env

# Run database migrations and seed mock data
alembic upgrade head
python scripts/seed.py

# Start the API server
python -m uvicorn main:app --reload
```
*The backend API will be available at `http://localhost:8000`*

### 3. Frontend Setup
Open a new terminal window to start the modern frontend.
```bash
cd modern-frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```
*The frontend application will be available at `http://localhost:5173`*

---

## 📡 Data & APIs

Currently, the application relies on mock geospatial data seeded via `scripts/seed.py` for UI/UX testing and architectural validation. 

In a production environment, the backend is designed to interface with:
- **Google Earth Engine (GEE)** API for fetching processed InSAR data.
- **Sentinel-1** ascending/descending pass data.

---

## 🛡️ License
This project is licensed under the MIT License.
