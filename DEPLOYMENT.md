# Deployment Guide

This guide covers deployment options for the Pass the Card multiplayer game. Since this app uses **WebSockets (Socket.IO)**, you need hosting that supports persistent connections.

## Recommended Deployment Options

### Option 1: Render (Recommended - Easy & Free Tier Available)

**Why Render?**
- ✅ Free tier available
- ✅ Supports WebSockets
- ✅ Easy deployment from GitHub
- ✅ Automatic SSL certificates
- ✅ Can deploy both frontend and backend

#### Backend Deployment on Render:

1. **Push your code to GitHub** (if not already)
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Create a Web Service on Render:**
   - Go to [render.com](https://render.com) and sign up/login
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: `pass-the-card-backend`
     - **Root Directory**: `backend`
     - **Environment**: `Node`
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
     - **Environment Variables**: 
       - `PORT`: `10000` (Render sets this automatically, but you can specify)
   - Click "Create Web Service"
   - Note the URL (e.g., `https://pass-the-card-backend.onrender.com`)

#### Frontend Deployment on Render:

1. **Create a Static Site on Render:**
   - Click "New +" → "Static Site"
   - Connect your GitHub repository
   - Configure:
     - **Root Directory**: `frontend`
     - **Build Command**: `npm install && npm run build`
     - **Publish Directory**: `build`
   - Add Environment Variable:
     - `REACT_APP_SERVER_URL`: `https://pass-the-card-backend.onrender.com`
   - Click "Create Static Site"

**Update Frontend to use Backend URL:**
- Create `.env.production` in `frontend/`:
  ```
  REACT_APP_SERVER_URL=https://pass-the-card-backend.onrender.com
  ```

---

### Option 2: Railway (Great for Full-Stack)

**Why Railway?**
- ✅ Easy deployment
- ✅ Supports WebSockets
- ✅ $5/month free credit
- ✅ Deploy both services together

#### Steps:

1. **Install Railway CLI:**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login:**
   ```bash
   railway login
   ```

3. **Deploy Backend:**
   ```bash
   cd backend
   railway init
   railway up
   ```
   - Set start command: `npm start`
   - Note the generated URL

4. **Deploy Frontend:**
   ```bash
   cd frontend
   railway init
   # Set environment variable: REACT_APP_SERVER_URL=<backend-url>
   railway up
   ```

---

### Option 3: Fly.io (Good Performance)

**Why Fly.io?**
- ✅ Free tier available
- ✅ Supports WebSockets
- ✅ Global edge network
- ✅ Good performance

#### Steps:

1. **Install Fly CLI:**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Create `backend/fly.toml`:**
   ```toml
   app = "pass-the-card-backend"
   primary_region = "iad"

   [build]

   [http_service]
     internal_port = 3001
     force_https = true
     auto_stop_machines = true
     auto_start_machines = true
     min_machines_running = 0
     processes = ["app"]

   [[services]]
     protocol = "tcp"
     internal_port = 3001
   ```

3. **Deploy Backend:**
   ```bash
   cd backend
   fly launch
   fly deploy
   ```

4. **Deploy Frontend:**
   - Similar process, or use Vercel/Netlify for frontend

---

### Option 4: Vercel (Frontend) + Render/Railway (Backend)

**Why this combo?**
- ✅ Vercel is excellent for React apps
- ✅ Free tier
- ✅ Fast CDN
- ✅ Backend on Render/Railway for WebSocket support

#### Frontend on Vercel:

1. **Install Vercel CLI:**
   ```bash
   npm install -g vercel
   ```

2. **Deploy:**
   ```bash
   cd frontend
   vercel
   ```
   - Set environment variable: `REACT_APP_SERVER_URL=<your-backend-url>`

#### Backend on Render/Railway:
- Follow Option 1 or 2 above for backend

---

### Option 5: DigitalOcean App Platform

**Why DigitalOcean?**
- ✅ Reliable hosting
- ✅ Supports WebSockets
- ✅ $5/month minimum

#### Steps:

1. **Create App on DigitalOcean:**
   - Go to [DigitalOcean App Platform](https://www.digitalocean.com/products/app-platform)
   - Connect GitHub repository
   - Add backend service:
     - Root Directory: `backend`
     - Build Command: `npm install`
     - Run Command: `npm start`
   - Add frontend service:
     - Root Directory: `frontend`
     - Build Command: `npm install && npm run build`
     - Output Directory: `build`
     - Environment Variable: `REACT_APP_SERVER_URL=<backend-url>`

---

## Important Configuration Notes

### Backend Configuration:

1. **Update CORS in `backend/server.js`:**
   ```javascript
   const io = new Server(server, {
     cors: {
       origin: process.env.FRONTEND_URL || "http://localhost:3000",
       methods: ["GET", "POST"]
     }
   });
   ```

2. **Update PORT handling:**
   ```javascript
   const PORT = process.env.PORT || 3001;
   ```

### Frontend Configuration:

1. **Create `frontend/.env.production`:**
   ```
   REACT_APP_SERVER_URL=https://your-backend-url.com
   ```

2. **Update Socket connection in `frontend/src/contexts/SocketContext.js`:**
   ```javascript
   const newSocket = io(
     process.env.REACT_APP_SERVER_URL || 'http://localhost:3001',
     {
       transports: ['websocket', 'polling']
     }
   );
   ```

---

## Quick Deploy Checklist

- [ ] Push code to GitHub
- [ ] Deploy backend to Render/Railway/Fly.io
- [ ] Get backend URL
- [ ] Set `REACT_APP_SERVER_URL` environment variable for frontend
- [ ] Deploy frontend
- [ ] Test WebSocket connection
- [ ] Test multiplayer functionality

---

## Testing After Deployment

1. Open your deployed frontend URL
2. Create a game
3. Open another browser tab/window
4. Join with the game code
5. Verify real-time updates work (WebSocket connection)

---

## Troubleshooting

### WebSocket Connection Issues:
- Ensure your hosting provider supports WebSockets
- Check CORS settings in backend
- Verify environment variables are set correctly
- Check browser console for connection errors

### Frontend Can't Connect to Backend:
- Verify `REACT_APP_SERVER_URL` is set correctly
- Check backend is running and accessible
- Ensure CORS allows your frontend domain

### Build Failures:
- Check Node.js version compatibility
- Verify all dependencies are in `package.json`
- Check build logs for specific errors

---

## Cost Comparison

| Platform | Free Tier | Paid Tier | WebSocket Support |
|----------|-----------|-----------|-------------------|
| Render | ✅ Yes | $7/month+ | ✅ Yes |
| Railway | ✅ $5 credit | $5/month+ | ✅ Yes |
| Fly.io | ✅ Yes | Pay as you go | ✅ Yes |
| Vercel | ✅ Yes | $20/month+ | ❌ Frontend only |
| DigitalOcean | ❌ No | $5/month+ | ✅ Yes |

---

## Recommended Setup for Production

**Best for Beginners:** Render (both frontend and backend)
**Best Performance:** Fly.io (backend) + Vercel (frontend)
**Best Value:** Railway (both services)

Choose based on your needs and budget!
