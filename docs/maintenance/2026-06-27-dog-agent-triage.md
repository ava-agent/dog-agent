# Dog Agent Triage - 2026-06-27

## Repository

- GitHub: `ava-agent/dog-agent`
- Public web URL: `https://pet.rxcloud.group`
- Category: Expo mobile app + Next.js web experience

## Actions Taken

- Fast-forwarded local `main` to remote Ark runtime migration `f98ec94`.
- Replaced the stale untracked local `.env.example` with the tracked Ark template from `origin/main`; the stale file was backed up outside the repository before the merge.
- Added `AGENTS.md` as the root maintenance guide.
- Confirmed `.env.example` now uses non-secret Supabase placeholders plus server-side `ARK_*` placeholders.
- Added `DEPLOYMENT.md` for Expo, Vercel, and Supabase checks.
- Added root `build`, `lint`, `test`, and `type-check` scripts.
- Added Expo ESLint configuration and dependencies through `expo lint`.
- Excluded the `web/` subproject from the root Expo TypeScript project.
- Made the root Supabase client safe for Expo web static rendering by using memory storage during server rendering.
- Relaxed `dog-agent/web` React purity lint rules that conflict with the current animation demo implementation.
- Documented that web chat deployments use `ARK_API_KEY`, `ARK_BASE_URL`, and `ARK_CHAT_MODEL`, not legacy provider variables.

## Validation

- Root `npm run test`: passed
- Root `npm run lint`: passed with 13 existing warnings
- Root `npm run build`: passed with Expo route and `expo-av` deprecation warnings
- `web` `npm run lint`: passed with 1 existing warning
- `web` `npm run build`: passed with a Next.js workspace-root warning about multiple lockfiles

## Follow-Up

- Review existing untracked screenshots and decide which belong in `docs/images/` versus local QA artifacts.
- Fix Expo route naming warning for `matching` and migrate away from deprecated `expo-av`.
