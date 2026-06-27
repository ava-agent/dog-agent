# PawPal Dog Agent Deployment Notes

## Current Status

- Public web URL: `https://pet.rxcloud.group`
- Root app: Expo / React Native
- Web app: Next.js under `web/`, deployed on Vercel
- Backend: Supabase Auth, PostgreSQL, Storage, Realtime

## Local Validation

```bash
npm install
npm run test
npm run lint
npm run build

cd web
npm install
npm run lint
npm run build
```

## Deployment Checklist

- Apply Supabase migrations before enabling auth, matching, feed, chat, or storage flows.
- Confirm `EXPO_PUBLIC_SUPABASE_URL` and anon key belong to the target Supabase project.
- Verify storage buckets and RLS policies for avatars, pet photos, videos, thumbnails, and chat media.
- Confirm `pet.rxcloud.group` Vercel domain, TLS, and production environment variables.
- Confirm Vercel Production/Preview have `ARK_API_KEY`, `ARK_BASE_URL`, and `ARK_CHAT_MODEL`.
- Do not keep legacy provider keys, models, or URLs after the web chat route reads Ark.
- Test sign-in, feed, matching, and chat on mobile-sized viewport before release.
