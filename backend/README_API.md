# Backend API - New features for Public Writer

This document explains the backend additions made to support the following user stories:

- View daily dashboard of appointments
- Set and edit availability calendar (no-work days)
- Edit and manage checklists and checklist items
- Create document checklists and upload metadata

Summary of changes
- Added MongoDB connection using Mongoose
- Implemented Mongoose models for User, Appointment, Document, Checklist, NoWorkDay
- Implemented services, controllers and routes for appointments, availability, checklists, and documents

Created / Modified files

- Added: `backend/.env.example` — example env vars
- Modified: `backend/package.json` — added `mongoose`, `dotenv`
- Modified: `backend/app.js` — connect DB and mount new API routes

- Added models (Mongoose):
  - `backend/src/models/Checklist.js`
  - `backend/src/models/NoWorkDay.js`
  - `backend/src/models/Appointment.js` (replaced placeholder)
  - `backend/src/models/Document.js` (replaced placeholder)
  - `backend/src/models/User.js` (replaced placeholder)

- Added services:
  - `backend/src/services/appointmentService.js`
  - `backend/src/services/availabilityService.js`
  - `backend/src/services/checklistService.js`
  - `backend/src/services/documentService.js`

- Added controllers:
  - `backend/src/controllers/appointmentController.js` (implemented)
  - `backend/src/controllers/availabilityController.js` (new)
  - `backend/src/controllers/checklistController.js` (new)
  - `backend/src/controllers/documentController.js` (implemented)

- Added API routes (mounted under `/api`):
  - `backend/routes/appointments.js` -> `/api/appointments`
  - `backend/routes/availability.js` -> `/api/availability`
  - `backend/routes/checklists.js` -> `/api/checklists`
  - `backend/routes/documents.js` -> `/api/documents`

- Modified: `backend/src/config/database.js` — implemented mongoose connection

API Endpoints (short)

- Appointments
  - GET `/api/appointments/date/:date` — list appointments for a date (date as string, e.g. `2025-11-30`)
  - POST `/api/appointments` — create appointment (body: `{ date, timeSlot, notes, userId }`)
  - PUT `/api/appointments/:id` — update
  - DELETE `/api/appointments/:id` — delete

- Availability (No Work Days)
  - GET `/api/availability` — list no-work days
  - POST `/api/availability` — add no-work day (body: `{ date, isRecurring, reason }`)
  - DELETE `/api/availability/:id` — remove

- Checklists
  - GET `/api/checklists/user/:userId` — get checklist for user
  - POST `/api/checklists` — create checklist (body: `{ title, userId, items: [...] }`)
  - PUT `/api/checklists/:id` — update checklist
  - PUT `/api/checklists/:checklistId/items/:itemId` — update checklist item

- Documents
  - GET `/api/documents/user/:userId` — list documents for a user
  - POST `/api/documents` — create document metadata (body: `{ fileName, storagePath, checklistItemId, userId, type }`)

How the implementation satisfies the user stories

- Daily dashboard of appointments: `GET /api/appointments/date/:date` returns appointments for a given date. The frontend admin dashboard you already added can call this endpoint to render the daily list.

- Set and edit availability: `GET /api/availability` and `POST /api/availability` allow the public writer to add or remove no-work days. The calendar UI can call these endpoints; the DB model `NoWorkDay` stores `date`, `isRecurring`, and `reason`.

- Edit/update checklists: Checklists are stored in `Checklist` collection with `items` subdocuments. Use `PUT /api/checklists/:id` to update a checklist and `PUT /api/checklists/:checklistId/items/:itemId` to edit specific checklist items.

- Create document checklists: Each `Document` document stores metadata and links to a `checklistItemId`. Clients can upload files to your existing upload flow (multer) and then POST metadata to `/api/documents`.

Run & test locally (KISS)

Prerequisites
- Node 18+ (or similar)
- MongoDB running locally or accessible via a connection string

Steps

1. Backend dependencies

```powershell
cd backend
npm install
```

2. Configure environment

Copy `.env.example` to `.env` and update `MONGO_URI` if needed.

3. Start backend

```powershell
npm start
```

4. Test endpoints (examples)

- Create appointment:
```powershell
curl -X POST http://localhost:5000/api/appointments -H "Content-Type: application/json" -d "{\"date\":\"2025-11-30\", \"timeSlot\":\"10:00 AM\", \"notes\":\"Consultation\"}"
```

- Get appointments for a date:
```powershell
curl http://localhost:5000/api/appointments/date/2025-11-30
```

- Add a no-work day:
```powershell
curl -X POST http://localhost:5000/api/availability -H "Content-Type: application/json" -d "{\"date\":\"2025-12-25\",\"isRecurring\":true,\"reason\":\"Holiday\"}"
```

- Create checklist:
```powershell
curl -X POST http://localhost:5000/api/checklists -H "Content-Type: application/json" -d "{\"title\":\"Passport Procedure\",\"userId\":null,\"items\":[{\"itemId\":\"i1\",\"label\":\"Passport Scan\",\"required\":true}]}"
```

Notes & Next steps
- File uploads: The project already has `multer` config at `backend/src/config/multer.js`. Use that route to upload files and then POST metadata to `/api/documents`.
- Authentication: Endpoints are currently unprotected. For production, hook in `authMiddleware` (you have placeholders in `backend/src/middleware`) to protect admin routes.
- Frontend integration: I can wire the frontend services to these endpoints and update the admin dashboard to fetch real data instead of mock data.

If you want, I can now:
- Wire the frontend admin components to these endpoints (appointments/availability/checklists/documents).
- Add simple Postman collection or example requests in `backend/tests`.
