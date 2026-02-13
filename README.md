# AI Pipeline Intel — Production-ready repo (V1)

Telecom-focused sales intelligence: **Signals → Accounts → Action**.

This repo is designed to deploy cleanly on Railway (or similar) with:
- Next.js web service
- BullMQ worker service
- Cron job scheduler service

> **MO + KS**: New business signal ingestion is wired through OpenCorporates API (best-effort V1).

## 1) Local setup

```bash
npm install
cp .env.example .env.local
```
Set env vars in `.env.local`.

Then:
```bash
npm run prisma:generate
npm run prisma:migrate:dev
npm run db:seed
npm run dev
npm run worker
npm run scheduler:once
```

Open http://localhost:3000

### V1 Auth
API routes require an `x-workspace-token` header. For local demo:
- set `WORKSPACE_TOKEN=ws_demo` (optional)
- or send header manually

## 2) Railway deployment (recommended)

Create 3 services in the same Railway project, all pointing to this repo:

### Service A: `web`
- Start command: `npm run start`
- Pre-deploy command: `npm run prisma:migrate:deploy`
- Env vars: all required (DATABASE_URL, REDIS_URL, OPENAI_API_KEY, AUTH_SECRET, etc.)

### Service B: `worker`
- Start command: `npm run worker`
- Env vars: same as web

### Service C: `scheduler` (Cron Job)
- Command: `npm run scheduler:once`
- Cron: `* * * * *` (every minute)
- Env vars: same as web

(Optional) Add a second Cron Job service for reminders:
- Command: `npm run reminders:once`
- Cron: `0 * * * *`

## 3) Notes on “Production-ready” scope

This repo includes:
- Durable queue processing (BullMQ retries + exponential backoff)
- Zod schema validation for AI outputs + repair pass
- Workspace scoping + API token gate (fast hard lock)
- Proper campaign scheduling + nextRun tracking
- Logging (pino)

NextAuth/SSO is stubbed but not fully wired in V1 (Email provider requires SMTP transport). Replace the token-gate with NextAuth when you’re ready.

## 4) Connector caveats
OpenCorporates results often do not include address/ZIP in the search response. V1 still creates accounts + signals and relies on enrichment connectors (next phase) for address resolution.

## 5) Roadmap (fast)
- Add real MO/KS SOS scrapers or paid data feed
- Add contact discovery + persona routing
- Add sequences + reminders engine
- Add CRM sync (HubSpot/Salesforce)
- Add attribution analytics (signals → revenue)
