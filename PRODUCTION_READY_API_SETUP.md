# Production-Ready API Setup (Next.js App Router + MongoDB)

This project uses **App Router** (`app/api/**/route.ts`) and **`lib/db/mongodb.ts`**. Do **not** create `lib/mongodb.ts` or Pages Router `pages/api/*.ts`.

---

## Step 0: Environment

In **`.env.local`**:

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=silicon-hubs
```

Use your real credentials. **Restart `npm run dev`** after changing env.

---

## Step 1: MongoDB client (already in project)

**File:** `lib/db/mongodb.ts`

- Uses **global** cache in both dev and production: `global._mongoClientPromise`.
- Exports: **`connectDB()`**, **`getDatabase()`**, default **`clientPromise`**, **`COLLECTIONS`**.
- Does not throw at module load when `MONGODB_URI` is missing; the promise rejects when awaited so routes can catch and return fallbacks.

**Use in API routes:**

```ts
import { connectDB } from '@/lib/db/mongodb';

export async function GET() {
  try {
    const db = await connectDB();
    // ...
  } catch (error) {
    console.error('[api/...]', error);
    return NextResponse.json([]); // or {} for objects
  }
}
```

---

## Step 2: Individual APIs (always return valid JSON)

Public routes return **200** with **valid JSON** even when the DB fails (empty array or object + logs).

| Route | File | Collection | On error |
|-------|------|------------|----------|
| `/api/team` | `app/api/team/route.ts` | `teamMembers` | `[]` |
| `/api/testimonials` | `app/api/testimonials/route.ts` | `testimonials` | `[]` |
| `/api/blogs` | `app/api/blogs/route.ts` | `blogs` | `[]` |
| `/api/content` | `app/api/content/route.ts` | `siteContent` | `{}` |

**Pattern:**

```ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';

export async function GET() {
  try {
    const db = await connectDB();
    const data = await db.collection('teamMembers').find({ published: true }).sort({ order: 1 }).toArray();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error('[api/team GET]', error);
    return NextResponse.json([]);
  }
}
```

- Always return **valid JSON** (array or object), never 500 with an error body for public GETs.
- **Log** errors in the terminal for debugging.

---

## Step 3: Batch API (multiple sections in one call)

**Route:** `GET /api/batch?sections=team,testimonials,blog&limit=4&includeVisibility=true`

**File:** `app/api/batch/route.ts`

- **Query params:**
  - `sections` – comma-separated: `team`, `testimonials`, `blog`. Default: all three.
  - `limit` – max blog posts (default 4, max 100).
  - `includeVisibility` – if `true`, filters out items with `visible: false`.
- **Behavior:**
  - One shared `connectDB()` at the start.
  - Each section fetched in its own try/catch; a failing section returns `[]` for that key, others still run.
  - Outer try/catch: on connection/DB error, returns `{}`.
- **Response:** `{ team: [], testimonials: [], blog: [] }` (always 200, always valid JSON).

**Example:**

```bash
curl "http://localhost:3000/api/batch?sections=team,testimonials,blog&limit=4&includeVisibility=true"
```

---

## Step 4: CMS content API (page/section content)

**Route:** `GET /api/content?page=home&section=hero` or `&sections=hero,services`

**File:** `app/api/content/route.ts`

- Uses collection **`siteContent`** (page + section CMS).
- Not for team/testimonials/blog; use **`/api/batch`** for those.
- On error returns **200** with **`{}`** so the frontend always gets valid JSON.

---

## Step 5: Test endpoints

From the project root (with `npm run dev` running):

```bash
curl http://localhost:3000/api/team
curl http://localhost:3000/api/testimonials
curl "http://localhost:3000/api/blogs?limit=4"
curl "http://localhost:3000/api/batch?sections=team,testimonials,blog&includeVisibility=true"
curl "http://localhost:3000/api/content?page=home&sections=hero,services"
```

- Expect **200** for all.
- Body may be `[]` or `{}` if DB is empty or fails; check terminal logs for errors.

---

## Step 6: Optional production improvements

- **Caching:** Batch (and content) already use short `Cache-Control`. Add in-memory or Redis cache for hot paths if needed.
- **Validation:** Batch API only allows `team`, `testimonials`, `blog`; invalid section names are ignored.
- **Rate limiting:** Add middleware or a wrapper (e.g. Upstash) on `/api/batch` and other public APIs if you need to limit abuse.

---

## Quick reference

| What | This project |
|------|----------------------|
| DB helper | `lib/db/mongodb.ts` → `connectDB()` |
| API style | App Router: `app/api/<name>/route.ts`, export `GET` / `POST` |
| Response | `return NextResponse.json(data)`; on error `NextResponse.json([])` or `NextResponse.json({})` |
| Team collection | `teamMembers` |
| Batch route | `/api/batch?sections=team,testimonials,blog` |
