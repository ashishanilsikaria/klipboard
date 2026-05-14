# ClipSync

Real-time clipboard bridge between Windows and any browser on your LAN.

## Features

- **Clipboard Sync**: Windows clipboard changes appear instantly in all connected browsers
- **Send to Windows**: Type or paste text in any browser to set the Windows clipboard
- **Shared Blocks**: Store and organize text/code snippets, grouped by day
- **Real-time Updates**: All connected clients see changes instantly via WebSocket
- **Syntax Highlighting**: Code blocks are rendered with highlight.js

## Prerequisites

- **Node.js 18+**
- **PostgreSQL** running locally (or accessible on your network)

## Setup

### 1. Clone and Install

```bash
git clone <repo-url>
cd clipsync
npm install
```

### 2. Configure Database

Copy `.env.example` to `.env` and set your PostgreSQL connection string:

```bash
cp .env.example .env
```

Edit `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/clipsync"
```

### 3. Initialize Database

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to database
npm run db:seed       # Seed with sample data
```

### 4. Run

```bash
npm run dev
```

Server starts on **http://localhost:3000**.

### 5. Connect from LAN Devices

1. Find your Windows machine's local IP (run `ipconfig` in cmd)
2. On any device on the same network, open `http://<windows-ip>:3000`
3. Enter the Windows IP in the connection field and click Connect

### 6. Windows Firewall

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
