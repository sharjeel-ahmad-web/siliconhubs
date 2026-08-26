# MongoDB setup

The app expects a MongoDB connection. If you see:

- `ECONNREFUSED 127.0.0.1:27017`
- `EACCES ::1:27017`
- `MongoServerSelectionError`

then the app cannot reach MongoDB.

---

## Option 1: Run MongoDB locally

1. **Install MongoDB Community** on Windows:
   - https://www.mongodb.com/try/download/community  
   - Or with Chocolatey: `choco install mongodb`

2. **Start MongoDB**  
   - Start the "MongoDB" service (Services app or `net start MongoDB` in an elevated cmd),  
   - Or run `mongod` from the install directory.

3. **Use this in `.env.local`:**
   ```env
   MONGODB_URI=mongodb://127.0.0.1:27017
   MONGODB_DB=silicon-hubs
   ```
   Using `127.0.0.1` instead of `localhost` can avoid IPv6 issues on Windows.

4. Restart the Next.js dev server (`npm run dev`).

---

## Option 2: Use MongoDB Atlas (cloud)

1. Create a free cluster at https://www.mongodb.com/cloud/atlas
2. Create a database user and allow access from your IP (or `0.0.0.0/0` for development).
3. Get the connection string (e.g. `mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority`).
4. In `.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://your-user:your-password@your-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority
   MONGODB_DB=silicon-hubs
   ```
5. Restart the Next.js dev server.

---

## After MongoDB is running

- Run seed scripts if you need sample data, e.g. `npm run seed:arise-hero` or the scripts under `app/api/seed/`.
- The `/api/team`, `/api/blogs`, `/api/content`, and other APIs will stop returning 500 once the connection works.
