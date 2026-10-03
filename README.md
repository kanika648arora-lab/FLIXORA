# FLIXORA — Pure Cinematic Streaming Platform

> **FLIXORA** is an ultra-premium, cinematic movie and TV streaming web application inspired by the visual fidelity of modern high-budget streaming platforms like Netflix. Engineered with **PRO-MAX animations, GSAP ScrollTrigger parallax, Lenis smooth inertia scrolling, Framer Motion transitions, 3D card tilt physics, and live 4K trailer previews**.

---

## 🌟 Key Highlights & Features

### 1. 🎬 Cinematic Loading Experience
- Pure black screen with an animated **FLIXORA** logo (opacity, scale, blur, glow, letter spacing expansion).
- `LOADING EXPERIENCE...` subtext with a **0 → 100** numeric counter and neon progress bar.
- At 100%: The screen splits apart and zooms into the homepage with a cinematic curtain dissolve transition.

### 2. 🌌 Full-Screen Hero Section & GSAP Scroll Parallax
- Full-screen auto-looping trailer with slow zoom and subtle camera movement.
- Left-aligned title with **character/word-by-word** reveal animation.
- Dynamic metadata badges: `99% Match`, `2026`, `4K Ultra HD`, `16+`, `Dolby Atmos`.
- Action buttons: `▶ Play Now`, `＋ Add to List` (with micro-interaction), and `ⓘ Details`.
- Audio toggle button with visual sound waves.
- **GSAP ScrollTrigger**: As you scroll, the hero video slowly scales, blurs, fades, and moves upward while movie rails emerge with depth.

### 3. 🎴 Interactive 3D Movie Cards & Timed Hover Previews
- **3D Card Tilt**: Cards react to mouse coordinates with realistic 3D perspective rotation and dynamic moving radial shine reflection.
- **Micro-Timed Hover Sequence**:
  - `0ms`: Card begins scaling ($1 \rightarrow 1.15$).
  - `100ms`: Soft shadow and red atmospheric glow appears.
  - `150ms`: Poster image subtly zooms.
  - `250ms`: High-resolution video trailer preview begins playing.
  - `350ms`: Movie information and metadata slides upward.
  - `450ms`: Action buttons (`▶ Play`, `＋ My List`, `♡ Like`, `ⓘ Info`) fade and slide in.
- Smooth spring easing on mouse leave with zero jumps or layout jitter.

### 4. 🚀 Netflix-Style Horizontal Movie Rails
- **Continue Watching**: Special rail with progress bars (e.g. `72%`), episode tags (`S2:E4 'The Butterfly Anomaly'`), remaining runtimes, and instant resume.
- **Top 10 Today**: Stylized Bebas Neue gigantic rank numbers (1 to 10) integrated with movie cards.
- **Curated Rails**:
  - Trending Now
  - Sci-Fi & Cyberpunk Realities
  - Action & Espionage
  - Critically Acclaimed Movies
  - Top Original Series
  - Anime & Groundbreaking Animation
  - Horror & Deep Sea Thrillers
  - Comedy & Sharp Satires
  - Historical Epics & Human Drama
- Smooth arrow glide navigation and touch/mouse drag inertia.

### 5. 🔍 Cinematic Fullscreen Search Overlay
- Triggered from the navbar search icon.
- Dark blurred movie poster backdrop.
- Large glowing search input: *"What are you watching tonight?"*.
- Live debounced search across titles, actors, directors, genres, and synopsis.
- Interactive genre filter chips (`Sci-Fi`, `Action`, `Thriller`, `Anime`, `4K Ultra HD`).
- Staggered animated card results with instant preview.

### 6. 🎭 Movie Detail Modal
- Cards expand into a fullscreen cinematic modal with backdrop blur.
- Autoplaying high-res trailer with audio controls.
- Tabs for **Overview**, **Episodes** (for series with runtimes and synopses), and **More Like This** recommendation cards.

### 7. 📺 Custom Distraction-Free Video Player
- Custom controls that **autohide after 3 seconds** of mouse inactivity and smoothly reappear on mouse movement.
- Controls include:
  - Play / Pause (Spacebar supported)
  - Cinematic seeker bar with progress fill and hover thumbnail scrubber
  - Skip ±10 seconds
  - Volume slider and mute toggle
  - Playback speed selector ($0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x$)
  - Quality selector (`4K Ultra HD`, `1080p`, `720p`)
  - Subtitles toggle (`[CC]` on/off)
  - Fullscreen toggle (F key)
  - Top bar with *"← Back to Browse"* and title / episode headers.

### 8. 👤 "Who's Watching?" Profile Experience
- Profile switcher with animated avatars (**Vaibhav**, **Alex**, **Maya**, **Kids**).
- Avatars scale and project personalized ambient color glow on hover.
- Click triggers a zoom-towards-screen transition into the personalized homepage.

### 9. 💖 Interactive My List
- Saved watchlist grid with animated deletions: removed cards shrink, rotate slightly, and fade while neighboring cards reflow smoothly.

### 10. 🔐 Authentication & Real Backend API
- Login and Sign Up with dark cinematic ambient background.
- **Real Node.js + Express backend** with JWT authentication and bcrypt password hashing.
- Instant 1-Click Demo Login as **Vaibhav**.
- Full REST endpoints:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
  - `GET /api/auth/me`
  - `GET /api/movies`
  - `GET /api/movies/:id`
  - `GET /api/movies/featured/hero`
  - `GET /api/movies/sections/all`
  - `GET /api/my-list`
  - `POST /api/my-list`
  - `DELETE /api/my-list/:movieId`
  - `GET /api/watch-history`
  - `POST /api/watch-history`
  - `GET /api/profiles`

### 11. 🎯 Custom Cursor & Atmospheric FX
- Interactive desktop cursor with smooth lerp interpolation:
  - Dot default
  - Expands to `WATCH` over movie cards
  - Expands to `PLAY` over trailers/player
  - Expands to `CLICK` over buttons
- Subtle canvas-based floating dust particles and film grain overlay.
- Automatically disabled on mobile/touch screens.

### 12. 📱 Mobile Experience
- Responsive layout with bottom navigation bar (`Home`, `Search`, `New`, `My List`, `Profile`).
- Touch-friendly swipeable rails.

---

## 💻 Tech Stack
- **Frontend**: React 19, Vite, Tailwind CSS v4, Lucide Icons
- **Animation & Motion**: GSAP, ScrollTrigger, Framer Motion, Lenis Smooth Scroll
- **Backend**: Node.js, Express.js, JWT, bcryptjs, Mongoose / MongoDB Atlas ready (with high-speed fallback in-memory datastore)

---

## 🚀 Running Locally

```bash
# 1. Start backend server (Port 5000)
cd server
node index.js

# 2. In another terminal, start client (Port 5173)
cd client
npm run dev
```

Visit **http://localhost:5173** to experience FLIXORA!
