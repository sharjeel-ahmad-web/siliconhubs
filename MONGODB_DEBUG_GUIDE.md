# MongoDB Connection & API Debugging Guide

**Project:** Next.js 14 App Router + MongoDB (native driver)  
**Paths:** API routes in `app/api/**/route.ts`, DB helper in `lib/db/mongodb.ts`

---

## Step 1: Verify MongoDB connection

### 1.1 Check `.env.local`

Ensure these variables exist (no quotes around the URI):

```env
MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB=rising-dot
```

- **MONGODB_URI** – Required. If missing, API routes that use `connectDB()` will throw.
- **MONGODB_DB** – Optional; defaults to `rising-dot` in `lib/db/mongodb.ts`.

### 1.2 DB helper location and usage

- **File:** `lib/db/mongodb.ts` (not `lib/mongodb.ts`).
- **Exports:** `connectDB()`, `getDatabase()`, default `clientPromise`, `COLLECTIONS`.
- **Caching:** Connection is cached on `global._mongoClientPromise` in both dev and production.

Do **not** create a second `lib/mongodb.ts`. Use only:

```ts
import { connectDB } from '@/lib/db/mongodb';
// or
import clientPromise from '@/lib/db/mongodb';
```

### 1.3 Test connection (Node REPL or script)

From project root with `node` (load env yourself) or a small script:

```bash
node -e "
require('dotenv').config({ path: '.env.local' });
const { MongoClient } = require('mongodb');
const uri = process.env.MONGODB_URI;
if (!uri) { console.error('MONGODB_URI missing'); process.exit(1); }
const client = new MongoClient(uri);
client.connect().then(() => {
  return client.db(process.env.MONGODB_DB || 'rising-dot').collection('teamMembers').find({}).toArray();
}).then(arr => { console.log('teamMembers count:', arr.length); process.exit(0); })
  .catch(err => { console.error(err); process.exit(1); });
"
```

Or in browser: after `npm run dev`, open **http://localhost:3000/api/team**. If you get JSON (even `[]`), the connection and route work.

---

## Step 2: Fix `/api/team`

- **Path:** `app/api/team/route.ts` (App Router; there is no `pages/api/team.ts`).

Your route already uses `connectDB()` and returns an array. Standard pattern:

```ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import { TeamMember } from '@/lib/db/models';

export async function GET() {
  try {
    const db = await connectDB();
    const members = await db
      .collection<TeamMember>('teamMembers')
      .find({ published: true })
      .sort({ order: 1 })
      .toArray();

    return NextResponse.json(Array.isArray(members) ? members : []);
  } catch (error) {
    console.error('[api/team GET]', error);
    return NextResponse.json(
      { error: 'Failed to fetch team members' },
      { status: 500 }
    );
  }
}
```

- **Collection name:** `teamMembers` (not `team`).

**Check:** Open **http://localhost:3000/api/team**. You should see a JSON array. If 500, check the terminal for the logged error (often connection or wrong DB/collection name).

---

## Step 3: Fix `/api/testimonials` and `/api/blogs`

- **Paths:** `app/api/testimonials/route.ts`, `app/api/blogs/route.ts`.

### `/api/testimonials`

- Collection: `testimonials`.
- Use `connectDB()` and return an array; guard with `Array.isArray(...) ? ... : []`.

### `/api/blogs`

- Collection: `blogs`.
- Query uses `published: true`; optional `limit` and `category` from `request.nextUrl.searchParams` or `new URL(request.url).searchParams`.

Example pattern for both:

```ts
// app/api/testimonials/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';

export async function GET() {
  try {
    const db = await connectDB();
    const data = await db.collection('testimonials').find({ published: true }).sort({ order: 1 }).toArray();
    return NextResponse.json(Array.isArray(data) ? data : []);
  } catch (err) {
    console.error('[api/testimonials GET]', err);
    return NextResponse.json({ error: 'Failed to fetch testimonials' }, { status: 500 });
  }
}
```

**Check:**

- **http://localhost:3000/api/testimonials** → JSON array.
- **http://localhost:3000/api/blogs** or **http://localhost:3000/api/blogs?limit=4** → JSON array.

---

## Step 4: Fix `/api/content` (batch / CMS endpoint)

- **Path:** `app/api/content/route.ts`.

This route fetches from the **`siteContent`** collection (page/section CMS), not from `team`, `testimonials`, or `blogs`. It does **not** take `sections=team,testimonials,blog`; it uses:

- `page` – e.g. `home`, `about`
- `section` – single section
- `sections` – comma‑separated list of **section names** for batch (e.g. `hero,services`)

Example:

```text
GET /api/content?page=home
GET /api/content?page=home&section=hero
GET /api/content?page=home&sections=hero,services,about
```

To avoid 500 on first load or when DB is slow:

- Use **`connectDB()`** at the start of the handler.
- Wrap the whole handler body in **try/catch**; on error, log with `console.error('[api/content GET]', error)` and return `NextResponse.json({ error: '...' }, { status: 500 })`.
- Guard **null/undefined**: use `content ?? []`, `item.content ?? {}`, and `contentMap[section] ?? null` so you never pass undefined to `NextResponse.json`.

If you need a **separate** batch endpoint that returns team + testimonials + blogs in one call, create a new route (e.g. `app/api/batch/route.ts`) that:

- Uses `connectDB()` once.
- In a loop over section names, runs one query per collection (`teamMembers`, `testimonials`, `blogs`) inside its own try/catch and assigns `result[section] = []` on error so one failing section does not break the whole response.

---

## Step 5: Quick reference – your project

| What              | Location / value                         |
|-------------------|------------------------------------------|
| DB helper         | `lib/db/mongodb.ts`                      |
| Connect in APIs   | `const db = await connectDB();`          |
| DB name           | `process.env.MONGODB_DB` or `rising-dot` |
| Team              | Collection `teamMembers`                 |
| Testimonials      | Collection `testimonials`                |
| Blogs             | Collection `blogs`                       |
| CMS content       | Collection `siteContent`                 |
| Navigation        | `settings` collection, `type: 'navigation'` |
| API route style   | `app/api/<name>/route.ts`, `GET()` / `POST()` return `NextResponse.json(...)` |

---

## Step 6: Debugging tips

1. **Restart dev server** after changing `.env.local`.
2. **Terminal logs:** All the routes above use `console.error('[api/...]', error)`. Check the terminal (not the browser) for Mongo errors.
3. **MongoDB Compass / mongosh:** Connect with the same `MONGODB_URI`, select DB `rising-dot` (or your `MONGODB_DB`), and check:
   - `teamMembers.find({ published: true })`
   - `testimonials.find({ published: true })`
   - `blogs.find({ published: true })`
   - `siteContent.find({})`
   - `settings.find({ type: 'navigation' })`
4. **Empty arrays:** 200 with `[]` means the route and connection work; the collection is empty or the query has no matches. Add documents in Compass or seed scripts.
5. **500 on first load only:** Usually connection not ready or env not loaded. The cached promise in `lib/db/mongodb.ts` and calling `connectDB()` at the start of each handler address this; ensure every route does both.

Following this guide with **your** paths and collection names should remove the 500s and make the batch/content endpoints return consistent JSON.
