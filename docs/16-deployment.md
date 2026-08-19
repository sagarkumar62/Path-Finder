# 16 - Deployment Guide

## 1. Production Build & Execution

```bash
# 1. Install dependencies
npm install

# 2. Seed initial career & skill data
npm run seed

# 3. Build production bundle
npm run build

# 4. Start production server
npm start
```

## 2. Environment Variables Checklist
Ensure environment variables are configured in platform settings (Render, Railway, Heroku, AWS):
- `PORT`
- `NODE_ENV=production`
- `MONGODB_URI`
- `JWT_ACCESS_SECRET`
- `JWT_REFRESH_SECRET`
- `FRONTEND_URL`
- `AI_SERVICE_URL`
- `AI_MOCK_MODE=false`
