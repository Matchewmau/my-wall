# Supabase setup

The My Wall Supabase project lives at:

```
https://iljwkzszfairgckwkcat.supabase.co
```

## 1. Create `.env.local`

Copy `.env.example` to `.env.local` and fill in the project values:

```dotenv
NEXT_PUBLIC_SUPABASE_URL=https://iljwkzszfairgckwkcat.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=<your publishable key>
```

`.env.local` is ignored by git. Never commit the real key.

## 2. Run the schema

1. Open the Supabase dashboard for `iljwkzszfairgckwkcat`.
2. Open the SQL Editor.
3. Paste the whole of [`schema.sql`](./schema.sql) and run it.

The script is idempotent, so it is safe to run again.

## 3. What the script creates

- `public.posts` with `id`, `user_id`, `body`, `created_at`, and `photo_url`.
- A 280-character body check and a check that requires a body or a photo.
- A `posts_created_at_idx` index for newest-first reads.
- Row Level Security enabled with public select and insert policies.
- `public.posts` added to the `supabase_realtime` publication.
- A public `wall-photos` Storage bucket with public read and anon insert policies.

## 4. Verify

Run these from the repository root:

```powershell
node --env-file=.env.local -e "const u=process.env.NEXT_PUBLIC_SUPABASE_URL,k=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; fetch(u+'/rest/v1/posts?select=id&limit=1',{headers:{apikey:k,Authorization:'Bearer '+k}}).then(async r=>console.log(r.status, await r.text()))"
node --env-file=.env.local -e "const u=process.env.NEXT_PUBLIC_SUPABASE_URL,k=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY; fetch(u+'/storage/v1/bucket',{headers:{apikey:k,Authorization:'Bearer '+k}}).then(r=>r.json()).then(b=>console.log(b.map(x=>x.id)))"
```

Expected: `200 []` for the posts query and a bucket list that includes
`wall-photos`.

## 5. Deployment

Add `NEXT_PUBLIC_SUPABASE_URL` and
`NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the Vercel project's Production
environment, then redeploy.

## Notes

- Photo uploads go to `wall-photos` before the row is inserted. If the insert
  then fails, the uploaded file is orphaned in the bucket.
- This is a demo with no authentication: anyone can read and insert posts,
  and there are no update or delete policies. Do not store sensitive data.
