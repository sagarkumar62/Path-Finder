# 03 - Authentication Specification

## 1. Authentication Strategy

CAREER PATHFINDER uses standard JSON Web Token (JWT) authentication backed by HTTP-only secure cookies and optional Authorization header parsing (`Bearer <token>`).

## 2. API Endpoints

### 1. `POST /api/v1/auth/register`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123!"
  }
  ```
- **Response** (201 Created):
  ```json
  {
    "success": true,
    "message": "User registered successfully",
    "data": {
      "user": {
        "_id": "66c1f100...",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user"
      },
      "accessToken": "eyJhbGci..."
    }
  }
  ```

### 2. `POST /api/v1/auth/login`
- **Auth**: Public
- **Request Body**:
  ```json
  {
    "email": "jane@example.com",
    "password": "Password123!"
  }
  ```
- **Response** (200 OK):
  ```json
  {
    "success": true,
    "message": "Logged in successfully",
    "data": {
      "user": {
        "_id": "66c1f100...",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user"
      },
      "accessToken": "eyJhbGci..."
    }
  }
  ```

### 3. `POST /api/v1/auth/logout`
- **Auth**: Public / Authenticated
- **Response** (200 OK): Clears `accessToken` and `refreshToken` cookies.

### 4. `POST /api/v1/auth/refresh`
- **Auth**: Refresh Token in Cookie or Body
- **Response** (200 OK): Returns new Access Token and sets refreshed HTTP-only cookies.

### 5. `GET /api/v1/auth/me`
- **Auth**: Bearer Token or `accessToken` Cookie Required
- **Response** (200 OK): Returns current user object without password field.
