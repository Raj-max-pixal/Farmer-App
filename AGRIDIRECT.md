# AgriDirect

SIH 2026 prototype for PS 26033: reducing intermediaries to increase farmer earnings and lower consumer prices.

## Run the web demo

```powershell
cd web
npm install
npm run dev
```

The responsive React dashboard includes Farmer/Buyer role switching, category filtering, add-product flow, live mandi comparison, the recommendation formula, ranked buyer matching, and an escrow-style checkout simulation.

## Monorepo shape

- `web/`: React + Vite judge demo
- `backend/`: Spring Boot REST contract and domain logic
- `services/recommendation/`: Python FastAPI recommendation and matching microservice
- `android/`: Kotlin Android client scaffold and API contract

## Core formula

`recommendedPrice = (nearbyMandiAverage × 0.60) + (demandSignal × 0.40)`

Buyer matching ranks candidates using `offerPrice × 0.60 + proximityScore × 0.25 + gradeFit × 0.15`. Escrow state moves from `HELD` to `RELEASED` only after delivery confirmation.

## API surface

- `POST /api/auth/login`
- `GET /api/marketplace?category=Vegetables&lat=18.52&lng=73.85`
- `POST /api/products`
- `GET /api/products/{id}/recommendation`
- `GET /api/products/{id}/matches`
- `POST /api/orders`
- `POST /api/orders/{id}/payment`
- `POST /api/orders/{id}/delivery-confirmation`
