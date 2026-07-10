<div align="center">

# CineMatch

**An AI-powered movie & series recommender — full cinematic frontend, built in React.**

Type a title you love, and CineMatch finds the 10 closest matches by genre, country, and rating.
Every screen below is real, built, and wired up — from the splash screen to the personal dashboard.

[![React](https://img.shields.io/badge/React-18.3-149ECA?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-5-B73BFE?logo=vite&logoColor=white)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React_Router-7-CA4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![Status](https://img.shields.io/badge/status-in_development-e50914)]()

</div>

---

## Contents

- [Quick start](#quick-start)
- [What's built](#whats-built)
- [Connecting a real backend](#connecting-a-real-backend)
- [Design system](#design-system)
- [Project structure](#project-structure)
- [Routes](#routes)
- [API contract mapping](#api-contract-mapping)
- [The 4 personalization stages](#the-4-personalization-stages)
- [What's mocked, and how to swap it](#whats-mocked-and-how-to-swap-it)
- [Notes for the backend team](#notes-for-the-backend-team)

---

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints — usually **http://localhost:5173**.

No backend, no API keys, and no setup required to try the full app: everything runs on
realistic mock data and a mock auth session out of the box (see
[What's mocked](#whats-mocked-and-how-to-swap-it)).

---

## What's built

Every page below is fully implemented, animated, and wired together into one continuous flow.

| # | Page | Route | Highlights |
|---|------|-------|------------|
| 1 | **Splash Screen** | `/` | Logo assembles from fog, glitch flash, real 0→100% loading bar, plays once per session |
| 2 | **Auth Gate** | `/welcome` | Typed headline, drawn underline, Sign In / Create Account |
| 3 | **Sign In / Create Account** | `/signin` | Curtain-wipe transition between modes, live validation, success checkmark |
| 4 | **Forgot / Reset Password** | `/forgot-password`, `/reset-password` | Full recovery flow with inline success states |
| 5 | **Welcome Back** | `/welcome-back` | Terminal-style status line, progress bar, name in red |
| 6 | **Discover** (home) | `/home` | Typed "Find Your Next Obsession" hero, wide search, personalized rows |
| 7 | **Recommend** | `/recommend` | Free-text AI assistant — parses mood/genre/ending from a real sentence |
| 8 | **Trending** | `/trending` | 10→1 countdown intro, region tabs, Top 10, Rising Fast, weekly chart |
| 9 | **My List** | `/favorites` | Shelf-in animation, dynamic ambient lighting per genre, live collection stats |
| 10 | **Movie Details** | `/title/:title` | Full-screen parallax hero, AI match ring, cast, trailer, gallery, reviews |
| 11 | **Dashboard** | `/dashboard` | Cinema DNA chart, real achievement unlocks, watch timeline |
| — | **Watch History** | `/history` | Bonus page — a straightforward watched-titles list |
| — | **Search Results** | `/search?q=` | Full-catalog search results grid |

Sign out from the avatar menu, or let a session expire — either way you're routed back to
the Auth Gate cleanly, no broken screens.

---

## Connecting a real backend

Copy `.env.example` to `.env` and set:

```env
VITE_API_BASE_URL=http://localhost/api
```

- **Empty** → mock mode. Every file in `src/api/` falls back to local mock data and
  `localStorage`-backed sessions. This is the default.
- **Set** → every request routes through `src/api/client.js`, an axios instance that already:
  - attaches `Authorization: Bearer {token}` automatically once logged in
  - matches your Laravel API Contract's endpoints, methods, and response shapes exactly
    (see the [mapping table](#api-contract-mapping))
  - fires a global `auth:unauthorized` event on any `401`, which signs the user out and
    redirects them — handled centrally in `App.jsx`

No component code changes when you flip this switch — the mock/real branch lives entirely
inside each `src/api/*.js` file.

---

## Design system

CineMatch deliberately uses **no photographs anywhere** — no poster API, no stock imagery.
Every "poster," backdrop, and avatar is a color gradient generated from the title's genre
(`src/utils/palette.js`), so the whole app stays fast, consistent, and license-free while
still looking fully populated. Hovering a card in My List even tints the page's ambient
background glow to match — the closest thing to "extracting colors from a poster," without
a single image request.

| Token | Value |
|---|---|
| Background | `#141414` |
| Card | `#181818` |
| Primary (red) | `#E50914` |
| Hover (red) | `#F6121D` |
| Text | `#FFFFFF` |
| Secondary text | `#B3B3B3` |
| Display font | Bebas Neue |
| Body font | Inter |

No emoji anywhere in the UI — every icon, badge, and marker is an inline SVG.

---

## Project structure

```
src/
├── api/                    # one file per feature area — mock/real switch lives inside each
│   ├── client.js             axios instance, Bearer token, 401 handling
│   ├── auth.js                register / login / logout / password reset
│   ├── titles.js              search / title detail / recommendations
│   ├── favorites.js
│   ├── history.js
│   ├── home.js                 the 4-stage personalized Discover feed
│   ├── trending.js             region-based trending rankings (mock)
│   ├── aiRecommend.js          free-text request parser for /recommend (mock)
│   └── tmdb.js                 unused — kept for AiHero, see below
│
├── context/
│   ├── AuthContext.jsx        user + token state, login/register/logout
│   ├── ToastContext.jsx        app-wide toast notifications
│   └── ProtectedRoute.jsx      redirects to the Auth Gate if signed out
│
├── data/
│   ├── catalog.js              mock title catalog, shaped like the real API fields
│   └── mockSession.js           mock users/favorites/history/AI search history
│
├── utils/
│   ├── palette.js               genre → color gradient (the whole no-images system)
│   └── enrich.js                 deterministic cast/reviews/summary for Movie Details
│
├── components/                 shared building blocks (Header, TitleCard, form fields...)
│
├── pages/                      one file (+ matching .css) per route
│
├── App.jsx                     routes + global 401 handling
└── main.jsx                     BrowserRouter + AuthProvider + ToastProvider
```

> **`AiHero.jsx` / `ParticleSphere.jsx` / `GlassSearchPanel.jsx`** — an earlier
> React-Three-Fiber proof of concept (a mouse-reactive 3D particle sphere). Not wired into
> any route right now, kept around as a strong candidate for a future `/recommend` upgrade.
> Note it still references `api/tmdb.js` for images if it's ever reactivated.

---

## Routes

| Path | Page | Auth |
|---|---|---|
| `/` | Splash screen | Public |
| `/welcome` | Auth Gate | Public |
| `/signin` | Sign in / Create account | Public |
| `/forgot-password` | Forgot password | Public |
| `/reset-password?token=` | Set new password | Public |
| `/welcome-back` | Post-login welcome | Protected |
| `/home` | Discover | Protected |
| `/recommend` | AI Recommend assistant | Protected |
| `/trending` | Trending | Protected |
| `/search?q=` | Search results | Protected |
| `/title/:title` | Movie Details | Protected |
| `/favorites` | My List | Protected |
| `/dashboard` | Dashboard / Profile | Protected |
| `/history` | Watch history | Protected |

Protected routes redirect to `/welcome` if there's no active session (`ProtectedRoute.jsx`).

---

## API contract mapping

| Contract endpoint | Frontend call |
|---|---|
| `POST /auth/register` *(email + password only)* | `AuthContext.jsx` → `register()` |
| `POST /auth/login` | `AuthContext.jsx` → `login()` |
| `GET /search?q=&limit=` | `api/titles.js` → `search()` |
| `GET /titles/{title}` | `api/titles.js` → `getTitleDetail()` |
| `GET /titles/{title}/recommendations?n=` | `api/titles.js` → `getRecommendations()` |
| `POST /favorites` *(toggle)* | `api/favorites.js` → `toggleFavorite()` |
| `DELETE /favorites/{title}` | `api/favorites.js` → `removeFavorite()` |
| `POST /history` | `api/history.js` → `markWatched()` |
| `DELETE /history/{title}` | `api/history.js` → `removeHistoryEntry()` |
| `GET /home` *(stage + sections)* | `api/home.js` → `getHome()` |

Favorite/mark-as-watched calls always send full metadata (`title, type, genres,
release_year`) so the backend never has to re-query the ML service for it. `is_favorite` /
`is_watched` render as *unavailable* for guests, not `false` — the frontend never claims
"not favorited" for someone who isn't signed in.

---

## The 4 personalization stages

`Discover` reads a `stage` from the `/home` response and adjusts its copy and sections:

| Stage | Who | What they see |
|---|---|---|
| **Stranger** | Guest | A single "Popular" section |
| **Explorer** | New / few signals | Popular, with an encouragement to save favorites |
| **Regular** | Has a taste profile | Recommended For You, Because You Watched, Based on Favorites |
| **Loyal** | Long history | Same sections, warmer "we know you well" tone |

The mock `api/home.js` derives a stage from your real favorites + history count, so you can
see all four just by adding or removing titles. Swap that block for the real backend's
`stage` field once it's live — the frontend logic doesn't change.

---

## What's mocked, and how to swap it

Everything below runs on deterministic, hash-seeded mock data so numbers stay stable across
reloads instead of jumping around — genuinely fabricated, but not random. Each is a small,
clearly-commented function ready to be replaced with a real API call:

| Area | File | Function |
|---|---|---|
| Trending rankings / stats | `api/trending.js` | `getTrending()` |
| Free-text AI request parsing | `api/aiRecommend.js` | `analyzeRequest()` |
| Cast, reviews, AI summary, runtime | `utils/enrich.js` | (several) |
| Password reset endpoints | `api/auth.js` | `requestPasswordReset()`, `resetPassword()` — **not yet in your API Contract**, coordinate the route/shape with the backend team before wiring the real branch |

Favorites, history, and Discover's personalization all use the *real* mock session in
`data/mockSession.js` (backed by `localStorage`), so that data persists across reloads and
genuinely drives the Dashboard, My List stats, and Cinema DNA — none of that is fake.

---

## Notes for the backend team

- **Register is email + password only**, matching BR11 in the API Contract. An earlier design
  pass explored adding a `username` field with live availability checking — that's *not*
  wired in, since it would silently fail against the real contract. Flag it if that's wanted,
  and update the contract first.
- Password rule on the frontend is 8+ characters — a reasonable default, adjust in
  `components/RegisterForm.jsx` to match whatever Laravel actually enforces.
- `requestPasswordReset` / `resetPassword` in `api/auth.js` are mocked and clearly marked —
  there's no forgot-password endpoint in the current contract yet.
