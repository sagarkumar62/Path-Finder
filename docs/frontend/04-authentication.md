# 04 — Authentication Specification

## Purpose
Provides clean, minimal, non-enterprise login (`/login`) and registration (`/register`) forms for Career PathFinder.

---

## Features Implemented
- Split-screen visual layout with left brand banner and right clean form card.
- Full support for Email, Password, and Full Name fields.
- Password visibility toggle (`Eye` / `EyeOff` icons).
- Form validation with clean user feedback messages.
- Direct connection to Node/Express backend auth endpoints (`/api/v1/auth/login` and `/api/v1/auth/register`).
- Automatic `sessionStorage` token caching & HTTP-only cookie setting.
- Clean redirection to `/onboarding` for new users or `/dashboard` for returning users.
