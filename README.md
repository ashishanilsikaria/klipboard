# ClipSync

Real-time clipboard bridge between Windows and any browser on your LAN.

Ever wanted to copy something on your PC and instantly paste it on your phone? Or vice versa? ClipSync does exactly that!

## What it does
- **Instant Sync**: Copy text on your PC, and it magically appears on your connected devices.
- **Send to PC**: Type or paste text on your phone/tablet to instantly copy it to your Windows clipboard.
- **Shared Blocks**: Save your favorite text or code snippets in neat, day-wise groups.
- **Code Friendly**: Highlights code blocks automatically!

## How to use it

### 1. Get Access
- Reach out to the admin to get your private `.env` (environment configuration) file. Place this file in the main app folder.

### 2. Start the App
Run these commands in your terminal to start the app:
```bash
npm install
npm run dev
```

### 3. Connect your devices
1. The app will start on your computer at **http://localhost:3000**.
2. Find your computer's local IP address (you can run `ipconfig` in your command prompt to find it, usually looks like `192.168.x.x`).
3. Open `http://<your-computer-ip>:3000` on your phone, tablet, or another computer on the same Wi-Fi network.
4. Enter your computer's IP in the connection box and hit Connect!

*(Note: If it's not connecting, you might need to allow port 3000 through your Windows Firewall)*

---
*For developers and advanced users, see the [Technical Documentation](TECHNICAL_DOCS.md) for architecture, database setup, and detailed scripts.*