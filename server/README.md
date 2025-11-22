# Backend Setup Instructions

## MongoDB Connection
The application requires a MongoDB database to function. Since no local MongoDB instance was found, you must provide a connection string.

1.  **Create a MongoDB Atlas Account** (Free):
    -   Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
    -   Create a free cluster.
    -   Get your connection string (e.g., `mongodb+srv://<username>:<password>@cluster0...`).

2.  **Update Environment Variables**:
    -   Open the `.env` file in this directory.
    -   Replace the `MONGO_URI` value with your actual connection string.
    -   Replace `JWT_SECRET` with a secure random string.

## Running the Server
Once configured:
```bash
npm run dev
```
