# User Access Management System

A comprehensive system for managing user access to various software applications.

## Backend Architecture

### Tech Stack
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Language**: TypeScript

### Project Structure
```
Backend/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Request handlers
│   ├── database/       # Database configuration and migrations
│   ├── entity/        # TypeORM entities
│   ├── middleware/    # Express middlewares
│   ├── repositories/  # Database queries
│   ├── routes/        # API routes
│   ├── scripts/       # Utility scripts
│   ├── services/      # Business logic
│   └── utils/         # Helper functions
```

### Getting Started

1. **Installation**
```bash
cd Backend
npm install
```

2. **Environment Setup**
Create a `.env` file:
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=your_username
DB_PASSWORD=your_password
DB_DATABASE=access_management
JWT_SECRET=your_jwt_secret
REFRESH_TOKEN_SECRET=your_refresh_token_secret
```

3. **Database Setup**
```bash
# Create database
npm run db:create

# Run migrations
npm run migration:run

# Seed initial data
npm run seed
```

4. **Start Server**
```bash
# Development
npm run dev

# Production
npm run build
npm start
```

### Core Features

#### User Management
- User registration with email verification
- Role-based access control (User, Manager, Admin)
- Profile management
- Activity logging

#### Software Management
- Software registration with access levels
- Software metadata management
- Access level configuration

#### Access Request System
- Request creation and tracking
- Multi-level approval workflow
- Request history and audit trail

#### Security Implementation
1. **Authentication**
   - JWT-based token system
   - Refresh token rotation
   - Password hashing with bcrypt

2. **Authorization**
   - Role-based middleware
   - Resource-level access control
   - Request validation

3. **Rate Limiting**
   - Different limits for auth and API routes
   - IP-based tracking
   - Burst protection

4. **Data Protection**
   - Input sanitization
   - SQL injection prevention
   - XSS protection via Helmet

### Error Handling
- Centralized error handling
- Custom error classes
- Detailed error logging
- Client-friendly error messages

### Logging
- Request logging
- Error logging
- Audit trail
- Activity monitoring

## API Routes Documentation

### Authentication Routes (`/v1/auth`)
- `POST /auth/register` - Register a new user
  - Body: `{ username, email, password }`
  - Response: Success message
  
- `POST /auth/login` - Login with credentials
  - Body: `{ usernameOrEmail, password }`
  - Response: `{ token, refreshToken, user }`
  
- `POST /auth/refresh-token` - Get new access token
  - Body: `{ refreshToken }`
  - Response: `{ token }`
  
- `POST /auth/logout` - Logout user
  - Response: Success message

### User Routes (`/v1/users`)
Protected routes - require authentication

#### Public User Routes
- `GET /users/profile` - Get current user's profile
- `PUT /users/profile` - Update current user's profile
  - Body: User profile data

#### Admin Only Routes
- `GET /users/statistics` - Get user statistics
- `GET /users/search` - Search users
- `GET /users/by-role/:role` - Get users by role
- `PUT /users/:userId/role` - Update user's role
- `PUT /users/:userId/status` - Toggle user's active status
- `GET /users/:userId` - Get user by ID
- `GET /users` - Get all users

### Software Routes (`/v1/software`)
All routes require authentication

#### Public Software Routes
- `GET /software` - Get all software
- `GET /software/:id` - Get software by ID

#### Admin Only Routes
- `POST /software` - Create new software
  - Body: `{ name, description, accessLevels }`
- `PUT /software/:id` - Update software
- `DELETE /software/:id` - Delete software

### Access Request Routes (`/v1/requests`)
All routes require authentication

#### User Routes
- `POST /requests` - Create access request
  - Body: `{ softwareId, accessType, reason }`
- `GET /requests/my-requests` - Get user's requests
- `GET /requests/:requestId/history` - Get request history

#### Manager & Admin Routes
- `GET /requests/pending` - Get pending requests
- `PUT /requests/:id/status` - Update request status
  - Body: `{ status, comment }`

#### Admin Only Routes
- `GET /requests` - Get all requests
- `DELETE /requests/:id` - Delete request

## Rate Limiting
- Auth routes: Stricter rate limiting
- API routes: Standard rate limiting

## Role-Based Access
- **User**: Basic access, can request software access
- **Manager**: Can approve/reject requests
- **Admin**: Full system access

## Authentication
- JWT-based authentication
- Refresh token mechanism
- Secure password hashing

## Security Features
- CORS protection
- Helmet security headers
- Input validation
- Rate limiting
- Role-based authorization
