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

## Frontend Architecture

### Tech Stack
- **Framework**: React with TypeScript
- **Styling**: Tailwind CSS
- **State Management**: React Context API
- **Form Handling**: React Hook Form
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **Build Tool**: Vite

### Project Structure
```
Frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React Context providers
│   ├── pages/         # Page components
│   ├── services/      # API service calls
│   ├── types/         # TypeScript interfaces
│   ├── config/        # Configuration files
│   └── utils/         # Helper functions
```

### Getting Started

1. **Installation**
```bash
cd Frontend
npm install
```

2. **Environment Setup**
Create a `.env` file:
```env
VITE_API_URL=http://localhost:3000/v1
```

3. **Start Development Server**
```bash
npm run dev
```

4. **Build for Production**
```bash
npm run build
npm run preview
```

### Key Features

#### Authentication & Authorization
- JWT-based authentication
- Protected routes with role-based access
- Automatic token refresh
- Persistent login state

#### User Interface
1. **Dashboard**
   - Overview of access requests
   - Software catalog
   - User statistics
   - Activity summary

2. **Software Management**
   - List available software
   - Request access interface
   - Access level selection
   - Request tracking

3. **Request Management**
   - Create access requests
   - Track request status
   - View request history
   - Approve/reject requests (Manager/Admin)

4. **Admin Panel**
   - User management
   - Software registration
   - Access control
   - System statistics

#### UI Components
- **Header**: Navigation and user profile
- **ProtectedRoute**: Role-based route protection
- **Forms**: Validated input forms
- **Tables**: Data display with sorting and filtering
- **Modals**: Confirmation and detail views
- **Toast**: User notifications

### State Management
- AuthContext for user authentication
- React Query for server state
- Local state for UI components

### Styling
- Responsive design with Tailwind CSS
- Custom component styling
- Dark/Light theme support
- Consistent color scheme
- Modern UI elements

### Performance Optimization
- Code splitting
- Lazy loading
- Memoized components
- Optimized re-renders
- Asset optimization

### Error Handling
- Form validation
- API error handling
- Friendly error messages
- Loading states
- Fallback UI

### Security Features
- Token management
- XSS prevention
- CSRF protection
- Secure data transmission
- Input sanitization

[Previous Backend Documentation continues below...] 