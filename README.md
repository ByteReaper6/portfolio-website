# Sagar Mankar — Portfolio Website

> **Full-Stack Architect · Security & Mobile App Developer**
> Built with logic. Deployed with intent.

**Live Site → [portfolio-website-chi-one-42.vercel.app](https://portfolio-website-chi-one-42.vercel.app/)**

---

## Overview

A personal portfolio and engineering notebook for **Sagar Mankar** — a Diploma Engineering student (3rd year, BKIT Sakoli) building full-stack, security-aware, and mobile products under real constraints.

The site is a full-stack application with:
- A premium dark-mode frontend (HTML + CSS + Vanilla JS)
- A Node.js + Express backend
- MongoDB Atlas database for storing contact form messages and projects
- Deployed on **Vercel** with serverless API functions

---

## Features

| Feature | Description |
|---|---|
| Premium Dark UI | Custom dark-mode design with glassmorphism, micro-animations, and noise texture overlay |
| System Diagram | Interactive SVG architecture diagram in the hero section |
| Project Case Files | 7 projects displayed as cards with modal "case file" detail overlays |
| Evidence Section | Awards, national rankings, and real-world user metrics |
| Contact Form | Live form connected to MongoDB Atlas — messages saved to the database |
| Fully Responsive | Mobile-first layout, smooth scroll, reduced motion support |
| Serverless API | Vercel serverless functions handle `/api/messages`, `/api/projects`, `/api/health` |
| Rate Limiting | Protection against spam and abuse on all API endpoints |
| Admin Auth | Token-based authentication for accessing contact messages |
| Dynamic Projects | Projects fetched from MongoDB with hardcoded fallback |

---

## Tech Stack

### Frontend
- **HTML5** — Semantic, accessible markup with ARIA attributes
- **CSS3** — Vanilla CSS with custom properties (no frameworks)
- **JavaScript (ES6+)** — Vanilla JS, IntersectionObserver, fetch API, dialog element
- **Google Fonts** — DM Mono + Space Grotesk

### Backend
- **Node.js** (v18+) — JavaScript runtime
- **Express.js** — HTTP server and middleware
- **Mongoose** — MongoDB ODM for schema validation and queries
- **express-rate-limit** — API rate limiting protection

### Database
- **MongoDB Atlas** — Cloud-hosted NoSQL database
- Collections: `messages` (contact form), `projects`

### Deployment
- **Vercel** — Frontend static serving + serverless API functions
- **GitHub** — Source control and CI/CD trigger for Vercel

---

## Project Structure

```
profitFlow/
├── api/                        # Vercel serverless functions
│   ├── messages.js             # POST /api/messages, GET /api/messages (admin)
│   ├── projects.js             # GET /api/projects, POST /api/projects (admin)
│   └── health.js               # GET /api/health — DB status check
│
├── models/                     # Mongoose schemas
│   ├── Message.js              # Contact form message schema
│   └── Project.js              # Project schema
│
├── lib/
│   └── db.js                   # Shared MongoDB connection (reused across functions)
│
├── assets/                     # Images and static assets
│   └── myimage2.png            # Profile photo
│
├── index.html                  # Main portfolio page
├── styles.css                  # All styles (design system, components, responsive)
├── script.js                   # Frontend JS (dialogs, scroll, form, animations, API fetch)
├── server.js                   # Local Express server (used for local dev only)
├── vercel.json                 # Vercel deployment configuration
├── package.json                # Dependencies and scripts
├── .env                        # Local env vars (not committed to git)
├── .env.example                # Template for required environment variables
└── .gitignore                  # Excludes node_modules and .env
```

---

## Getting Started (Local Development)

### Prerequisites
- [Node.js](https://nodejs.org/) v18 or higher
- A [MongoDB Atlas](https://www.mongodb.com/atlas) account (free tier works)

### 1. Clone the repository

```bash
git clone https://github.com/bytereaper6/portfolio-website.git
cd portfolio-website
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy the example file and fill in your values:

```bash
copy .env.example .env
```

Open `.env` and add your values:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/portfolio?retryWrites=true&w=majority
PORT=5000
ADMIN_TOKEN=your-secret-admin-token-here
```

Generate a secure admin token:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 4. Run the development server

```bash
npm run dev
```

Open your browser at **[http://localhost:5000](http://localhost:5000)**

---

## API Endpoints

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/health` | No | Check server and database connection status |
| `POST` | `/api/messages` | No | Submit a contact form message (rate limited: 10/15min) |
| `GET` | `/api/messages` | Yes | Retrieve all submitted messages (admin token required) |
| `GET` | `/api/projects` | No | Retrieve all projects from the database |
| `POST` | `/api/projects` | Yes | Add a new project (admin token required) |

### Authentication

Admin endpoints require a Bearer token in the Authorization header:

```bash
curl -X GET https://portfolio-website-chi-one-42.vercel.app/api/messages \
  -H "Authorization: Bearer your-admin-token-here"
```

### Example: Submit a contact message

```bash
curl -X POST https://portfolio-website-chi-one-42.vercel.app/api/messages \
  -H "Content-Type: application/json" \
  -d '{"name": "John", "email": "john@example.com", "message": "Let'\''s build something."}'
```

---

## Deployment (Vercel)

### Steps to deploy your own fork

1. Fork this repository
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import your fork
3. Set the **Environment Variables** in Vercel dashboard:

   | Key | Value |
   |---|---|
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `ADMIN_TOKEN` | Your secret admin token for protected endpoints |

4. Click **Deploy** — Vercel auto-detects the `/api` functions and serves static files natively

### How it works on Vercel
- `index.html`, `styles.css`, `script.js` → served as **static files** by Vercel CDN
- `/api/*.js` files → deployed as **serverless functions** (auto-detected by Vercel)
- No persistent server process needed

---

## Security Features

- **Rate Limiting**: Contact form limited to 10 submissions per 15 minutes per IP
- **Admin Authentication**: Protected endpoints require Bearer token
- **Input Validation**: Server-side email regex, length limits, and Mongoose schema validation
- **Body Size Limit**: JSON payloads limited to 10kb
- **CORS**: Configured for cross-origin requests
- **Environment Variables**: Secrets kept in `.env` (gitignored)

---

## Projects Featured

| # | Project | Highlight |
|---|---|---|
| 01 | **Cyber Raksha v1/v2** | Diamond Award — 1st Place, GHRSTU INNOVEX-26 |
| 02 | **Smart Leads Dashboard** | MERN backend, CRUD, lead state management |
| 03 | **Pashu Raksha / PashuMitra** | Offline AI chatbot built in 24-hour hackathon |
| 04 | **MVP Genie** | Parallax landing + AI context memory architecture |
| 05 | **JGU University Site** | Responsive tech-driven UI clone |
| 06 | **Sanghx / Eatlo / Tabey** | 1000+ real users across food-ordering ecosystem |
| 07 | **Sankalp Bharat 2026** | Top 16 nationally among 800+ teams (Team PANDA) |

---

## Contact

- **GitHub** → [@bytereaper6](https://github.com/bytereaper6)
- **Live Portfolio** → [portfolio-website-chi-one-42.vercel.app](https://portfolio-website-chi-one-42.vercel.app/)
- **Contact Form** → Available directly on the site

---

## License

This project is personal and not open-sourced for reuse. Feel free to explore the code for learning purposes.

---

<p align="center">
  <strong>BUILD // BREAK // REPEAT</strong><br/>
  <em>No shortcuts. Just signal.</em>
</p>
