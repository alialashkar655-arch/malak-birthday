# Production Deployment Guide: Our Little Universe ♡

This guide explains how to deploy **Our Little Universe** to the web so you can send a private, memorable link to Malak on her birthday (November 20, 2026).

---

## 🌐 Deployment Options

### Option A: Render or Railway (Recommended for Full-Stack)

Since the website includes a Node.js Express backend for file uploads and persistent date plan storage:

#### 1. Railway.app (Easiest Full-Stack Deployment)
1. Push your repository to GitHub.
2. Sign in to [Railway.app](https://railway.app).
3. Click **"New Project"** -> **"Deploy from GitHub repo"**.
4. In Project Settings:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
5. Attach a Persistent Volume to `/app/server/uploads` and `/app/server/data` so uploaded pictures and date submissions persist across redeploys.
6. Under Variables, add:
   ```env
   NODE_ENV=production
   PORT=5000
   ```
7. Railway will generate a public HTTPS URL (e.g., `https://our-universe-malak.up.railway.app`).

---

### Option B: Render.com (Web Service)
1. Push your code to GitHub.
2. Create a new **Web Service** on [Render.com](https://render.com).
3. Settings:
   - **Environment**: Node
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
4. Add a Disk under **Disks** tab:
   - Name: `data-storage`
   - Mount Path: `/opt/render/project/src/server/data`
   - Size: 1 GB (plenty for photos & database JSON)

---

### Option C: Deploying to Vercel (Fast & Global CDN)

The frontend is now pre-configured for Vercel with automatic single-page routing (`vercel.json`) and offline fallback data.

#### Step 1: Push your code to GitHub
If you haven't already initialized Git and pushed to GitHub:
```bash
git init
git add .
git commit -m "Malak birthday universe ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/malak-birthday.git
git push -u origin main
```

#### Step 2: Import into Vercel
1. Go to [vercel.com](https://vercel.com) and log in with your GitHub account.
2. Click **"Add New..."** → **"Project"**.
3. Select your GitHub repository (`malak-birthday`) and click **"Import"**.
4. In the Project Configuration:
   - **Framework Preset**: Vite
   - **Root Directory**: `client` (or leave default `./` as the repository has root `vercel.json` configured)
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Click **Deploy**!
6. In ~45 seconds, your site is live with a global HTTPS link (e.g. `https://our-universe-malak.vercel.app`).

#### Step 3 (Optional): Connecting a Persistent Backend
Because Vercel is a serverless platform (with read-only, ephemeral disk storage):
- All pre-seeded memories, letters, countdown, and music work **100% out-of-the-box on Vercel**.
- Date plan submissions are automatically saved to browser storage as backup.
- If you want the live **Admin Panel** to upload new photos/videos to a live server:
  1. Deploy the `server/` folder to [Render.com](https://render.com) (free Web Service) or [Railway.app](https://railway.app).
  2. In your Vercel Project Settings → **Environment Variables**, add:
     - `VITE_API_URL` = `https://your-backend-api.onrender.com`
  3. Redeploy on Vercel. All `/api` requests and media uploads will sync directly to your backend!

---

## 🔐 Privacy & Security Best Practices

1. **Change the Default Password**:
   - Immediately log in to the Admin Dashboard (`/admin` or the lock icon) and change the password from `malak2026` to a private password only you know.
2. **Access Control**:
   - Only authenticated admin sessions can edit memories, view Malak's date submissions, or upload media.
   - Malak only has access to view the romantic experience, enjoy the digital book, and submit her dream date choices.
3. **Database & File Backups**:
   - Go to the **Backup & Security** tab in the Admin panel to click **"Download Full Site JSON Backup"** anytime you make major updates.
