# UPI Fraud Detection (prototype)

Simulated UPI payment app + bank-side transaction screen for a college/demo project. Not connected to real NPCI/UPI.

## Run

**Backend:** `cd backend && npm install && npm run dev`  
**Frontend:** `cd frontend-upi && npm install && npm run dev`

| URL | Who it's for |
|-----|----------------|
| http://localhost:5173 | End user — enter UPI ID, send money |
| http://localhost:5173/dashboard | Security monitor (also via bottom **Security** tab) |
| http://localhost:5173/history | Your payments (bottom **History** tab) |

**Navigation:** bottom bar on every screen — Home · Pay · History · Security

**OTP (demo):** OTP is never returned to the browser. Use the same mobile for Send OTP and Pay. While developing, the OTP is printed only in the **backend terminal** (not in the UI).

## Honest limits

- OTP is simulated (shown in API during development only).
- No real bank SMS, biometrics, or NPCI.
- Redis from the SRS is not implemented; history comes from MongoDB.
- "On hold" and "Declined" are rule + ONNX scores, not a live bank decision engine.
