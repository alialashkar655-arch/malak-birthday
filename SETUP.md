# Setup Guide: Our Little Universe ♡ (For Malak)

Welcome! This is a complete, full-stack romantic memory website and interactive keepsake crafted for **Malak's Birthday on November 20, 2026**.

---

## 🚀 Quick Start (Running Locally)

### 1. Prerequisites
- **Node.js**: v18 or higher (Node 20+ recommended)
- **npm**: v9 or higher

### 2. Installation
From the root directory (`e:\malak_birthday`):

```bash
# Install root dependencies
npm install

# Install client dependencies
npm --prefix client install

# Install server dependencies
npm --prefix server install
```

### 3. Generate Styled Placeholders (Already Included)
If you ever want to re-generate the placeholder graphics:
```bash
node scripts/generate-placeholders.js
```

### 4. Start the Application
Run both the frontend and backend with one command:
```bash
npm run dev
```

- **Frontend Website**: [http://localhost:5173](http://localhost:5173)
- **Backend API Server**: [http://localhost:5000](http://localhost:5000)

### 5. Running Automated Verification Tests
```bash
# Run unit & logic verification tests
npm test

# Run full end-to-end integration tests
node test-full-flow.js
```

---

## 🔒 Admin CMS Access

- Click the **lock icon** in the top navigation bar or the footer link **"Admin & CMS Settings"**.
- Default password: `malak2026`
- Once logged in, you can:
  - Upload real photos and videos directly from your phone/computer.
  - Choose your favorite portrait of Malak and write your caption.
  - Edit or add timeline entries.
  - Customize the digital scrapbook album pages.
  - View date submissions sent by Malak.
  - Test Birthday Mode using the **"Test Birthday Mode 🎂"** toggle button.
  - Change your admin password.
  - Export and download full site backups.
