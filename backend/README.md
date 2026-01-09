# BlockMarket Backend

Backend API for BlockMarket - A decentralized marketplace for educational services with JWT authentication.

## Tech Stack

- **Node.js** + **Express.js** - Server framework
- **MongoDB** + **Mongoose** - Database
- **JWT** - Authentication
- **bcryptjs** - Password hashing
- **express-validator** - Input validation
- **Socket.IO** - Real-time communication
- **ethers.js** - Web3 integration

## Project Structure

```
backend/
├── src/
│   ├── controllers/      # Request handlers
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API routes
│   ├── services/        # Business logic
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── app.js           # Express app configuration
├── server.js            # Server entry point
├── package.json
└── .env.example
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and set your values:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Strong secret for access tokens
   - `JWT_REFRESH_SECRET` - Strong secret for refresh tokens
   - `PORT` - Server port (default: 5000)

3. **Start MongoDB**
   
   If running locally:
   ```bash
   mongod
   ```
   
   Or use MongoDB Atlas cloud database.

4. **Run the server**
   
   Development mode (with auto-reload):
   ```bash
   npm run dev
   ```
   
   Production mode:
   ```bash
   npm start
   ```

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "learner",  // "learner", "provider", or "admin"
  "walletAddress": "0x...",  // optional
  "expertise": ["JavaScript", "React"],  // optional, for providers
  "hourlyRate": 50,  // optional, for providers
  "bio": "Experienced developer"  // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "data": {
    "user": { ...userObject },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "user": { ...userObject },
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc..."
  }
}
```

#### Refresh Token
```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refreshToken": "eyJhbGc..."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Token refreshed successfully",
  "data": {
    "accessToken": "eyJhbGc..."
  }
}
```

#### Get Profile (Protected)
```http
GET /api/auth/profile
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "success": true,
  "data": { ...userObject }
}
```

#### Logout (Protected)
```http
POST /api/auth/logout
Authorization: Bearer <accessToken>
```

**Response:**
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

## Authentication Flow

1. **Register/Login** - Receive `accessToken` (1h) and `refreshToken` (7d)
2. **API Requests** - Include `Authorization: Bearer <accessToken>` header
3. **Token Expired** - Use `/api/auth/refresh` with `refreshToken` to get new `accessToken`
4. **Logout** - Call `/api/auth/logout` to invalidate `refreshToken`

## User Roles

- **learner** - Students seeking educational services
- **provider** - Educators offering services
- **admin** - Platform administrators

## Middleware

### `authenticate`
Verifies JWT token and attaches user info to `req.user`.

Usage:
```javascript
router.get('/protected', authenticate, controller);
```

### `authorize(...roles)`
Checks if authenticated user has required role.

Usage:
```javascript
router.get('/admin-only', authenticate, authorize('admin'), controller);
```

## Error Handling

All endpoints return consistent error format:
```json
{
  "success": false,
  "message": "Error description",
  "errors": []  // Validation errors if applicable
}
```

## Testing with cURL

**Register:**
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","role":"learner"}'
```

**Login:**
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Get Profile:**
```bash
curl -X GET http://localhost:5000/api/auth/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## Development

- **Nodemon** is configured for auto-reload during development
- Use `npm run dev` to start with nodemon
- MongoDB connection logs appear on startup
- Server runs on port specified in `.env` (default: 5000)

### Port Already in Use?

If you get `EADDRINUSE` error, the port is already occupied. Use these commands:

**Option 1: Kill port and restart (recommended)**
```bash
npm run restart
```

**Option 2: Kill port only**
```bash
npm run kill-port
```

**Option 3: Manual kill (Windows)**
```bash
netstat -ano | findstr :5000
taskkill /PID <PID> /F
```

**Option 4: Manual kill (Linux/Mac)**
```bash
lsof -ti:5000 | xargs kill -9
```

## Security Best Practices

- ✅ Passwords hashed with bcrypt (10 rounds)
- ✅ JWT tokens with expiration
- ✅ Refresh token rotation
- ✅ Input validation with express-validator
- ✅ CORS configured
- ✅ Sensitive fields excluded from responses
- ⚠️ Use strong secrets in production
- ⚠️ Enable HTTPS in production
- ⚠️ Set `NODE_ENV=production`

## Next Steps

- Implement booking routes (`/api/bookings`)
- Implement session routes (`/api/sessions`)
- Implement payment routes (`/api/payments`)
- Implement user routes (`/api/users`)
- Add WebRTC signaling for video sessions
- Integrate smart contract interactions

## License

ISC
