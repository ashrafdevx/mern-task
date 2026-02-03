# MERN Backend – REST API

Production-ready REST API backend for the MERN interview project. Serves data for **About Us**, **Booking**, and 404 pages. Supports **MongoDB** as primary storage with **local JSON file fallback** when the database is unavailable.

## Features

- **Dual storage**: MongoDB when available; automatic fallback to JSON files in `/data` when DB is down
- **RESTful API**: Full CRUD for expert staff, hotels, and appointments
- **Data validation**: express-validator for request validation
- **Error handling**: Central error handler with consistent JSON responses
- **CORS**: Configurable origin for frontend (e.g. `http://localhost:5173`)
- **Health check**: `GET /api/health` reports server and DB/fallback status

## Tech Stack

- **Node.js** + **Express**
- **Mongoose** (MongoDB)
- **dotenv**, **cors**, **morgan**, **express-validator**, **uuid**

## Project Structure

```
backend/
├── config/          # db.config.js, constants.js
├── models/          # Mongoose models (expertStaff, hotel, appointment)
├── routes/          # Express routers
├── controllers/     # Dual-storage controller logic
├── middleware/      # errorHandler, validation, fallback (checkDB)
├── utils/           # asyncHandler, ApiResponse, ApiError
├── data/            # JSON fallback files (expertStaff.json, hotels.json, appointments.json)
├── seeders/         # seed.js for MongoDB
├── server.js
├── package.json
├── .env.example
└── README.md
```

## Installation

1. **Clone and enter backend**
   ```bash
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment**
   - Copy `.env.example` to `.env`
   - Set `MONGODB_URI` (e.g. `mongodb://localhost:27017/mern-interview`)
   - Set `CORS_ORIGIN` to your frontend URL (e.g. `http://localhost:5173`)

4. **Seed database (optional, MongoDB only)**
   ```bash
   npm run seed
   ```

5. **Start server**
   ```bash
   npm run dev
   ```
   Or: `npm start`

Server runs on `http://localhost:5000` (or `PORT` from `.env`). If MongoDB is not running, the API automatically uses the JSON files in `/data`.

## Environment Variables

| Variable      | Description                    | Example                          |
|---------------|--------------------------------|----------------------------------|
| PORT          | Server port                    | 5000                             |
| NODE_ENV      | Environment                    | development / production         |
| MONGODB_URI   | MongoDB connection string      | mongodb://localhost:27017/mern-interview |
| CORS_ORIGIN   | Allowed frontend origin        | http://localhost:5173            |

## API Endpoints

### Health

| Method | Path         | Description                    |
|--------|--------------|--------------------------------|
| GET    | /api/health  | Status, database/fallback, timestamp |

### Expert Staff

| Method | Path                    | Description                |
|--------|-------------------------|----------------------------|
| GET    | /api/expert-staff       | List staff (filters: position, isActive, search) |
| GET    | /api/expert-staff/:id   | Get one staff              |
| POST   | /api/expert-staff       | Create staff               |
| PUT    | /api/expert-staff/:id   | Update staff               |
| DELETE | /api/expert-staff/:id   | Delete staff               |

### Hotels

| Method | Path           | Description                |
|--------|----------------|----------------------------|
| GET    | /api/hotels    | List hotels (filters: location, minPrice, maxPrice, available, category, minRating) |
| GET    | /api/hotels/:id| Get one hotel              |
| POST   | /api/hotels    | Create hotel               |
| PUT    | /api/hotels/:id| Update hotel               |
| DELETE | /api/hotels/:id| Delete hotel               |

### Appointments (Bookings)

| Method | Path                 | Description                |
|--------|----------------------|----------------------------|
| POST   | /api/appointments    | Create booking (required fields: customerName, email, phone, hotelName, checkInDate, checkOutDate, guests) |
| GET    | /api/appointments    | List appointments (filters: status, email, hotelId) |
| GET    | /api/appointments/:id| Get one appointment        |
| PUT    | /api/appointments/:id| Update status              |
| DELETE | /api/appointments/:id| Cancel appointment         |

## Request / Response Examples

### Create appointment (booking)

**Request**
```bash
curl -X POST http://localhost:5000/api/appointments \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Jane Doe",
    "email": "jane@example.com",
    "phone": "+15551234567",
    "hotelName": "Grand Plaza Hotel",
    "checkInDate": "2025-02-10",
    "checkOutDate": "2025-02-12",
    "guests": 2,
    "rooms": 1
  }'
```

**Response (201)**
```json
{
  "success": true,
  "statusCode": 201,
  "data": { ... },
  "message": "Appointment created successfully",
  "metadata": {
    "source": "database",
    "confirmation": "Booking confirmed for Jane Doe at Grand Plaza Hotel"
  }
}
```

### Get hotels with filters

**Request**
```bash
curl "http://localhost:5000/api/hotels?location=New%20York&minPrice=100&maxPrice=300"
```

**Response (200)**
```json
{
  "success": true,
  "statusCode": 200,
  "data": [ ... ],
  "message": "Hotels retrieved",
  "metadata": { "source": "database", "count": 5 }
}
```

### Get expert staff

**Request**
```bash
curl http://localhost:5000/api/expert-staff
```

**Response (200)**  
Same shape as above with `data` array and `metadata.source`, `metadata.count`.

## Fallback Mode

- If MongoDB is not reachable at startup (or connection is lost), the API uses JSON files in `/data`:
  - `data/expertStaff.json`
  - `data/hotels.json`
  - `data/appointments.json`
- All CRUD operations work in fallback mode; IDs and timestamps are managed in the files.
- `GET /api/health` returns `"database": "fallback"` when using files.
- Responses include `metadata.source`: `"database"` or `"local-file"`.

## Error Response Format

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validation failed",
  "errors": [
    { "field": "email", "message": "Valid email is required" }
  ]
}
```

## Scripts

- `npm start` – run `node server.js`
- `npm run dev` – run with nodemon
- `npm run seed` – run `node seeders/seed.js` (requires MongoDB)

## Testing Checklist

- [ ] Server starts with and without MongoDB (fallback works)
- [ ] GET /api/health returns correct `database` value
- [ ] GET /api/expert-staff and /api/expert-staff/:id return data
- [ ] GET /api/hotels with query filters works
- [ ] POST /api/appointments creates a booking and returns 201
- [ ] Validation errors return 400 with `errors` array
- [ ] 404 for unknown routes and non-existent IDs
- [ ] CORS allows frontend origin
- [ ] Seeder populates MongoDB when run
