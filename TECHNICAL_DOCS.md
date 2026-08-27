# Technical Documentation

This document contains the setup and technical details for ClipSync.

## Prerequisites
- **Node.js 18+**
- **PostgreSQL** running locally (or accessible on your network)

## Setup

### 1. Configure Database
Copy `.env.example` to `.env` and set your PostgreSQL connection string:
```bash
cp .env.example .env
```
*(Note: For standard users, the `.env` file is shared privately, so you can skip this step).*

### 2. Initialize Database
```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:seed       # Seed with sample data
```

### 3. Windows Firewall (If hosting on LAN)
Allow inbound TCP on port 3000:
```powershell
netsh advfirewall firewall add rule name="ClipSync" dir=in action=allow protocol=TCP localport=3000
```

## Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start dev server (custom server.js) |
| `npm run build` | Build Next.js for production |
| `npm start` | Start production server |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:generate` | Generate Prisma client |

## Architecture

- **`server.js`** — Custom Node.js server combining Next.js HTTP + WebSocket (`ws`) on port 3000
- **Clipboard Polling** — Reads Windows clipboard every 500ms using `clipboardy@2`
- **WebSocket Protocol** — JSON messages for clipboard sync, block management
- **Prisma + PostgreSQL** — Block storage with day-wise grouping
- **Next.js App Router** — React frontend with shadcn/ui components

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Database | PostgreSQL + Prisma |
| WebSocket | Node.js `ws` library |
| Clipboard | `clipboardy@2` (CommonJS) |