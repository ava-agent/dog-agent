# PawPal Dog Agent Maintenance Guide

## Project State

- Repository: `ava-agent/dog-agent`
- Product: PawPal pet social app
- Public web experience: `https://pet.rxcloud.group`
- Root app: Expo / React Native
- Web experience: Next.js app under `web/`
- Backend: Supabase

## Before Editing

- Keep root Expo/mobile changes separate from `web/` Next.js changes.
- Do not commit `.env`, `.vercel/`, `node_modules/`, generated screenshots, or Supabase secrets.
- Validate Supabase schema assumptions before changing auth, matching, chat, or storage flows.

## Useful Commands

- Root install: `npm install`
- Expo dev: `npm start`
- Expo web: `npm run web`
- Root type check: `npm run test`
- Root lint: `npm run lint`
- Web build: `cd web && npm run build`

## Environment

- Copy `.env.example` for Expo/Supabase client variables.
- The web chat route is server-side only and uses `ARK_API_KEY`, `ARK_BASE_URL`, and `ARK_CHAT_MODEL`.
- Do not add AI provider keys to `EXPO_PUBLIC_*`, `NEXT_PUBLIC_*`, or client-side storage.
- Use Vercel deployment secrets for the Next.js web experience if it needs separate values.

## Deployment Notes

- See `DEPLOYMENT.md` for Expo, Vercel, and Supabase release checks.
- Public web URL in README is `https://pet.rxcloud.group`.
