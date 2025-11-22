# Deployment Guide

## 1. Backend Deployment (Render)
1.  Push your code to GitHub.
2.  Go to [Render Dashboard](https://dashboard.render.com/).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Settings**:
    -   **Root Directory**: `server`
    -   **Build Command**: `npm install`
    -   **Start Command**: `node index.js`
6.  **Environment Variables**:
    -   `MONGO_URI`: Your MongoDB Atlas connection string.
    -   `JWT_SECRET`: Your secret key.
    -   `NODE_ENV`: `production`

## 2. Frontend Deployment (Vercel)
1.  Go to [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Settings**:
    -   **Root Directory**: `client`
    -   **Framework Preset**: Vite
5.  **Environment Variables**:
    -   (If you set up an API URL env var in frontend) `VITE_API_URL`: Your Render Backend URL (e.g., `https://daily-planner-api.onrender.com`).
    -   *Note: You might need to update `axios` calls in the code to use this env var instead of `localhost:5000`.*

## 3. Final Code Adjustment
Before deploying, ensure your frontend calls the backend URL, not localhost.
-   Update `client/src/context/AuthContext.jsx` and other API calls to use `import.meta.env.VITE_API_URL` or a hardcoded production URL.
