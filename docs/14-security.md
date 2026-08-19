# 14 - Security Architecture & Enforcement

## 1. Security Safeguards

1. **Helmet HTTP Security Headers**: Mitigates XSS, clickjacking, and MIME sniffing attacks.
2. **CORS Configuration**: Restricts origin to authorized frontend URL (`http://localhost:3000`).
3. **HTTP-Only & SameSite Cookies**: Prevents client-side JavaScript access to authentication cookies.
4. **Password Hashing**: Uses bcrypt salted hashing (10 rounds) before persisting passwords.
5. **No Hardcoded Secrets**: Uses strict environment variables (`.env`) with `.env.example` templates.
6. **Zod Input Validation**: Rejects invalid payloads before hitting controllers or database layer.
7. **MongoDB Injection Protection**: Safe Mongoose query parameter handling avoiding `$where` evaluation.
8. **Identity Enforcement**: Never trusts `userId` in request bodies; retrieves user identity directly from verified JWT tokens in `req.user`.
