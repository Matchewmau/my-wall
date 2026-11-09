# My Wall

A 2008-Facebook-style wall for John Mathew B. Mauricio.

## Features

- 280-character composer with a live remaining-character counter.
- Text-only, photo-only, or text-and-photo posts.
- JPEG, PNG, WebP, and GIF photos up to 5 MB.
- Newest-first feed with six static friend posts and live posts from Supabase.
- Supabase persistence and realtime inserts across open tabs.
- Setup notice when Supabase is not configured, plus an error alert with Retry.

## Stack

- Next.js 16.4.5 (App Router, Turbopack)
- React 19.3.1
- Tailwind CSS 4.3.5
- shadcn/ui
- Supabase: `@supabase/supabase-js` 2.119.0 and `@supabase/ssr` 0.12.7
- Vitest 5.1.0 with Testing Library
- Vercel

## Requirements

- Node 24 LTS `>=24.15.0` (enforced by `engines.node`)
- npm

## Local setup

```powershell
npm install
```

1. Copy `.env.example` to `.env.local` and fill in the Supabase project values:

   ```dotenv
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_your_key
   ```

2. Open the Supabase dashboard, go to the SQL Editor, and run the whole of
   [`supabase/schema.sql`](./supabase/schema.sql). It creates the `posts` table,
   the RLS policies, the realtime publication entry, and the public
   `wall-photos` bucket. It is idempotent.

3. Start the app:

   ```powershell
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000).

Without Supabase env vars the wall still renders the static friend posts and
shows a setup notice.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the development server. |
| `npm run build` | Create a production build. |
| `npm start` | Serve the production build. |
| `npm run lint` | Run ESLint. |
| `npm test` | Run the Vitest suite once. |
| `npm run test:watch` | Run Vitest in watch mode. |

## Supabase

- `public.posts` stores `id`, `user_id`, `body`, `created_at`, and `photo_url`.
- Row Level Security is enabled with public select and insert policies. There
  are no update or delete policies.
- Realtime is enabled for inserts on `public.posts`.
- The public `wall-photos` Storage bucket accepts anon uploads and serves public
  reads.

See [`supabase/README.md`](./supabase/README.md) for the full setup and
verification steps.

## Deployment

1. Import the repository into Vercel, or run `npx vercel link`.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and
   `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the Production environment.
3. Deploy with `npx vercel --prod`.

## Project structure

```
app/               Next.js routes, layout, global styles, loading state
components/        Wall header, profile card, feed, post item, composer,
                   photo preview, skeletons, and shadcn/ui primitives
lib/               Profile, static posts, post helpers, time, and validation
utils/supabase/    Browser, server, config, and proxy session clients
supabase/          SQL schema and Supabase setup guide
tests/             Vitest setup and unit/component tests
```

## Security note

This is a demo with no authentication: anyone can read and insert posts, and
there are no update or delete policies. Do not store sensitive data.

## Content note

The six friend posts (Anna, Adelaida, Juho, Maija, Alex, and Sheryl) are static
content rendered from `lib/static-posts.ts`. Only posts created through the
composer are persisted to Supabase.
