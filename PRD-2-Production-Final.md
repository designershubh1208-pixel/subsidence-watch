# Subsidence Watch — PRD #2 (Final): Production Build

**Status:** MVP validated. Map renders zones (`SubsidenceMap.tsx`), risk-based styling works (`getRiskStyle`), FastAPI backend serves zones via `fetchZones`/`api` service. This PRD replaces fake data with real data and hardens the system — building *on top of* the existing folder structure, not restarting it.

---

## 1. Guiding rule for this phase

Everything below plugs into what already exists:
- `backend/app/api` → add new endpoints here, same pattern as your current zone endpoint
- `backend/app/schemas` → add new Pydantic schemas here (e.g. `RiskCalculationResult`, `Report`)
- `frontend/src/components/Map` → the `Circle` + `getRiskStyle` pattern stays exactly as is; only the *data feeding it* changes
- `frontend/src/services/api` → your `fetchZones` function stays the same signature; it just starts hitting a "real" endpoint instead of a mock one

If any of this requires touching `SubsidenceMap.tsx`'s core rendering logic, that's a signal the data contract wasn't strict enough in the MVP — worth noticing, not panicking about.

## 2. Best tech stack for production (with reasoning, not just names)

| Layer | Choice | Why this one, specifically |
|---|---|---|
| Satellite data | **Google Earth Engine (Python API)**, Sentinel-1 InSAR | Free, public, same source real published Raniganj studies used — you can sanity-check your numbers against their published mm/year figures |
| Backend | **FastAPI** (already in place) | No change needed — async support matters here since Earth Engine calls are slow (seconds), and you don't want that blocking other API requests |
| Database | **PostgreSQL + PostGIS extension** | Regular Postgres can store lat/long as plain numbers, but PostGIS understands *geography* — "is this report inside this zone's boundary" becomes one clean query instead of manual math you'd get wrong at the edges |
| Task scheduling | **APScheduler** (Python, runs inside FastAPI) for a college-project scale, or a **cron job on Render/Railway** | You don't need Celery/Redis-level infrastructure for a job that runs monthly — that's over-engineering for this scale. Reach for the simplest tool that fits the actual frequency of the task |
| Risk model | **Plain threshold logic + scikit-learn** if you want a smoothing/regression step | Explainability matters more than sophistication for a safety tool — a government official trusting a red flag needs "why" in one sentence, not "the model decided" |
| Frontend | **Next.js + React + react-leaflet** (already in place) | No change — `Circle` over `Marker` was already the right call for radius-based risk zones, keep that |
| Auth | **Firebase Auth** (admin-only, as planned) | Unchanged from MVP |
| Notifications | **SendGrid** (free tier) for official email alerts | Avoid SMS/WhatsApp (Twilio) unless you have budget — email is sufficient at this scale and free |
| Hosting | **Vercel** (frontend, unchanged), **Render** (backend + scheduled job) | Render supports both a web service and a cron job under one free-tier-friendly account, simpler than splitting across providers |
| Monitoring | **Sentry (free tier)** for error tracking | The one addition MVP didn't need — production means real users hitting it when you're not watching the terminal, so you need to know when something breaks without them telling you |

## 3. New backend work (concrete, in your existing structure)

**New file:** `backend/app/services/subsidence_pipeline.py`
- Pulls Sentinel-1 data for defined zone boundaries via Earth Engine
- Calculates ground movement (mm/year) per zone
- Applies threshold logic → writes `risk_level` back to the zones table

**New endpoint:** `backend/app/api/reports.py`
- `POST /reports` — save a citizen report (schema: lat, long, issue_type, photo_url, phone_number)
- `GET /reports` — admin-only, requires Firebase-verified token

**New schema additions in `backend/app/schemas/`:**
```python
class Report(BaseModel):
    latitude: float
    longitude: float
    issue_type: Literal["crack", "uneven_ground", "other"]
    photo_url: str | None = None
    phone_number: str | None = None
    status: Literal["new", "reviewed"] = "new"
```

## 4. New frontend work (concrete, in your existing structure)

- `frontend/src/components/Map/ReportForm.tsx` — new component, a form + click-to-pin-location on the existing map instance
- `frontend/src/services/api.ts` — add `submitReport()` and `fetchReports()` alongside existing `fetchZones()`
- `frontend/src/app/admin/page.tsx` — new route, gated by Firebase auth check, showing the reports table

## 5. Reports-feed-into-risk logic (the human-in-the-loop part)

- 3+ reports in the same zone within 14 days → flag zone for admin review (does NOT auto-change color)
- Admin dashboard shows a "pending review" badge on flagged zones
- Admin manually confirms → zone risk updates; admin dismisses → reports marked reviewed, no change

*(Reasoning, same as before: automation for detection, human judgment for action — because a false alarm has a real social cost, and that tradeoff belongs to a person, not a script.)*

## 6. Security additions needed at production scale (new vs MVP)

- **Rate limiting** on `POST /reports` — otherwise anyone can spam fake reports and manipulate your escalation logic. Simple IP-based rate limiting via `slowapi` (FastAPI-compatible) is enough.
- **Photo upload validation** — check file type/size before accepting uploads (Cloudinary, which you've used before on BtechBuys, handles this well and gives you a free tier)
- **Firebase token verification on every admin endpoint** — not just checking a token exists, but verifying it server-side on each request (FastAPI dependency injection is a clean way to do this once, then reuse it everywhere)

## 7. Success criteria for production readiness

- At least one real zone's risk_level is generated from actual Earth Engine data, not manual entry
- That number is in a plausible range compared to the published InSAR study you already found (roughly single-digit to ~20mm/year)
- A report submission correctly triggers the "pending review" flag once 3 reports land in one zone
- Sentry catches and reports a deliberately-triggered test error
- An unauthenticated request to `GET /reports` is correctly rejected

## 8. Rough timeline from here

- PostGIS setup + zone boundary definitions: 2–3 days
- Earth Engine data pipeline: 1–1.5 weeks (the real learning curve)
- Reports endpoint + escalation logic: 3–4 days
- Admin dashboard + auth wiring: 3–4 days
- Security hardening (rate limiting, upload validation): 2 days
- Sentry + deployment to Render/Vercel: 1–2 days

**Total: roughly 3–4 weeks** from your current validated MVP.
