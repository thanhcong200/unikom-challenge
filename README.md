# Unikom Challenge Project

## Project Description

This project is a full-stack application including:

- **Backend:** NestJS (TypeScript) with PostgreSQL and Redis for caching/queue.
- **Frontend:** Next.js (TypeScript/React) consuming the backend API.
- **Features:** Activity tracking, JWT authentication, pagination, filtering, and logging.

The system is containerized with Docker Compose for easy setup and consistency across environments.

---

## Prerequisites

- **Node.js:** v20.x (for local development, optional if using Docker)
- **npm:** v9.x (comes with Node.js)
- **Docker:** v24.x or higher
- **Docker Compose:** v2.x or higher

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/thanhcong200/unikom-challenge.git
cd unikom-challenge
```

### 2. Install dependencies (local development only)

```bash
cd backend && npm i
cd frontend && npm i
```

### 3. Environment Variables
Backend .env (backend/.env):
```env
# App
NODE_ENV=development
PORT=8000
CORS=http://localhost:3000
LOG_LEVEL=debug
LOG_OUTPUT_JSON=0

# JWT
JWT_SECRET=unikomsecretjwt
JWT_EXPIRES_IN=7d
BCRYPT_SALT_ROUNDS=12

# Database 
DB_HOST=postgres
DB_PORT=5432
DB_USER=postgres
DB_PASS=123456a@
DB_NAME=unikom

# Redis
REDIS_URI=redis://redis:6379
```
Frontend .env (frontend/.env):
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 4. Run with Docker Compose
```bash
docker-compose up -d
```

### 5. API Documentation
All backend APIs are prefixed with /api.
1. Signup
   ```
Endpoint: POST /api/auth/signup
Description: Register a new user.

Request Body:
{
  "first_name": "John",
  "last_name": "Doe",
  "email": "john.doe@example.com",
  "password": "password123"
}

Response Example:
{
  "data": null
  "meta": null,
  "message": "User registered successfully"
}

Notes:
- Password is hashed before saving.
- Email must be unique.
- Returns standard { data, meta, message } format.
```
2. Login
```
Endpoint: POST /api/auth/login
Description: Authenticate user and return JWT token.


* Request Body:
{
  "email": "john.doe@example.com",
  "password": "password123"
}
* Response Example:
{
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR..."
  },
  "meta": null,
  "message": "Login successful"
}

* Notes:
- Returns JWT token in access_token.
- JWT token expires according to JWT_EXPIRES_IN (e.g., 7d).
- Use this token as Authorization: Bearer <token> in subsequent requests.
```
3. Activities
```
- Endpoint: GET /api/activities
- Query Parameters:
Parameter	Type	Description
page	number	Page number (default: 1)
limit	number	Items per page (default: 10)
startDate	string	Filter activities from this date (YYYY-MM-DD)
endDate	string	Filter activities until this date (YYYY-MM-DD)
name	string	Filter by user's first or last name (partial)
email	string	Filter by user's email (partial)
actions	string	Comma-separated actions: login, logout, search

* Response Example:
{
  "data": [
    {
      "id": 46,
      "user": {
        "first_name": "Công",
        "last_name": "Vũ Thành Công",
        "email": "vuthanhcong110502@gmail.com"
      },
      "action": "search",
      "timestamp": "2025-10-26T19:54:25.366Z",
      "metadata": null
    }
  ],
  "meta": {
    "totalItems": 46,
    "totalPages": 3,
    "currentPage": 1,
    "hasNextPage": true,
    "hasPrevPage": false,
    "page": 1,
    "limit": 20
  },
  "message": "Success"
}
```
* Notes:
- All APIs use a common response format with data, meta, and message.
- Pagination metadata includes hasNextPage and hasPrevPage.

Assumptions and Design Decisions
- Time Zones: All timestamps are stored in UTC; filtering is converted to UTC using dayjs.utc().
- CORS: Configured to allow http://localhost:3000 in development. Use origin: true temporarily for Docker Compose dev.
- Authentication: JWT-based; tokens validated in NestJS with a custom @User() decorator for extracting user info.
- Pagination: Implemented in backend with skip and take using TypeORM QueryBuilder.
- Dockerization: Backend and frontend are separate containers. PostgreSQL and Redis are included as services for full-stack setup.
- Response standardization: All API responses follow { data, meta, message } format for consistency.
