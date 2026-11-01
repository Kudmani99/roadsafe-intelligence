# RoadSafe Intelligence

**Smarter road safety through community intelligence — Greater Toronto Area**

A prototype web app where people report dangerous road incidents on a live GTA map, view community analytics, and get AI-powered safety insights.

## What's New in v0.2

- **GTA Incident Map** — Leaflet + OpenStreetMap (free, no API key)
- **SQLite Database** — Prisma ORM, runs locally on your Mac
- **25 Community Reports** — Realistic GTA seed data (Toronto, Mississauga, Brampton, etc.)
- **Real AI Insights** — OpenAI or Groq (free tier), with smart local fallback
- **Location Pinning** — Click the map when reporting to set exact coordinates

## Tech Stack

| Layer | Choice | Why |
|-------|--------|-----|
| Framework | Next.js 15 + React 19 | Modern, fast dev |
| Database | SQLite + Prisma | Free, local, zero hosting cost |
| Maps | Leaflet + OpenStreetMap | Free and lightweight |
| Charts | Recharts | Dashboard visualizations |
| AI | OpenAI GPT-4o-mini or Groq | Optional, ~$0.01/analysis |

## Getting Started

### 1. Install dependencies

```bash
cd road-safety-mvp
npm install
```

### 2. Set up the database

```bash
npm run db:seed
```

This creates `prisma/dev.db` and loads 25 realistic GTA community reports.

### 3. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### 4. (Optional) Enable live AI insights

Copy the example env file and add an API key:

```bash
cp .env.example .env
```

**Option A — OpenAI** (~$0.01 per analysis):
```
OPENAI_API_KEY=sk-...
```

**Option B — Groq** (free tier):
```
GROQ_API_KEY=gsk_...
```

Without a key, the app uses a smart local intelligence engine with detailed GTA-specific insights (including GO train crossing patterns).

## Pages

| Route | Description |
|-------|-------------|
| `/` | Landing page with live stats and map preview |
| `/map` | Full GTA incident map with filters |
| `/report` | Report form with map location picker |
| `/dashboard` | Analytics, charts, hotspots, recent reports |
| `/insights` | AI-generated safety insights and recommendations |

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── reports/     # GET/POST incidents
│   │   ├── stats/       # Live dashboard stats
│   │   └── insights/    # AI analysis endpoint
│   ├── map/             # GTA incident map
│   ├── report/          # Report form
│   ├── dashboard/       # Analytics dashboard
│   └── insights/        # AI insights page
├── components/
│   ├── IncidentMap.tsx  # Leaflet map
│   ├── MapWrapper.tsx   # SSR-safe wrapper
│   └── ...
└── lib/
    ├── gta.ts           # GTA bounds & locations
    ├── analytics.ts     # Stats + local AI fallback
    └── db.ts            # Prisma client
prisma/
├── schema.prisma        # Database schema
└── seed.ts              # 25 GTA community reports
```

## Useful Commands

```bash
npm run dev          # Start dev server
npm run db:seed      # Create/seed database
npm run db:reset     # Wipe and re-seed database
npm run build        # Production build
```

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `npm: command not found` | Install Node.js 18+ from [nodejs.org](https://nodejs.org) |
| Empty dashboard/map | Run `npm run db:seed` |
| Map not loading | Hard refresh (Cmd+Shift+R) |
| AI shows "Local Engine" | Add `OPENAI_API_KEY` or `GROQ_API_KEY` to `.env` |
| Port 3000 busy | Run `npm run dev -- -p 3001` |
| Prisma errors | Run `npx prisma generate` then `npm run db:seed` |

## License

MIT — Demo prototype for educational purposes.
