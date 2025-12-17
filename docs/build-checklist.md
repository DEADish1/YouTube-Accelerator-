# Build checklist

This document provides a step‑by‑step checklist to guide the build process of the AI YouTube Manager.  Use it in conjunction with `docs/cursor-prompt.md` to ensure you tackle every part of the project systematically.

## Phase 1: Environment & database

1. Copy `.env.local.example` to `.env.local` and fill in all variables described in `env.md`.
2. Create your Supabase project and run `db/schema.sql` in the SQL editor to create tables and policies.
3. Enable row‑level security (RLS) on all tables and verify that policies restrict access to each user’s data.
4. Set up a `videos` storage bucket in Supabase to store uploaded video files.

## Phase 2: Authentication & OAuth

1. Configure Supabase email magic link authentication via the dashboard.
2. Create a Google OAuth client with YouTube scopes and update the environment variables.
3. Implement the OAuth callback route (`/api/auth/callback/google`) to exchange the code for tokens using `exchangeCodeForTokens()` from `lib/youtube.ts` and insert/update the `channels` table.
4. Store the refresh token securely and never send it to the client.

## Phase 3: Data sync

1. Write a server action `syncVideos()` that uses the refresh token to call the YouTube Data API and populate the `videos` and `video_metrics_daily` tables.
2. Run `syncVideos()` from the Settings page and confirm that videos appear on the dashboard.
3. Schedule a cron job (Supabase Functions or external) to refresh metrics daily.

## Phase 4: Dashboard

1. Display the list of recent videos with thumbnails, titles and published dates.
2. Add summary statistics (views, watch time, subscribers gained) using `video_metrics_daily` aggregates.
3. Reserve space for AI recommendations and charts.

## Phase 5: AI assistant

1. Implement helper functions in `lib/ai.ts` that call OpenAI’s chat completions API to generate content ideas, titles, hooks, descriptions and tags.  See `prompts.md` for prompt templates.
2. Build a server action that analyses the top performing videos, calls your AI helpers and stores the outputs in `content_ideas` and `ai_outputs`.
3. Display the generated ideas on the dashboard with scores and reasoning.

## Phase 6: Upload manager

1. Use the form on `/upload` to allow users to upload a video file, specify title, description, tags and a publish date/time.
2. Save the file in the Supabase Storage `videos` bucket and insert a record in `scheduled_uploads`.
3. Implement a background job that checks for due uploads, calls the YouTube API to upload the file using the refresh token, sets the metadata and scheduled publish time, and marks the record as processed.

## Phase 7: Tasks and reports

1. Write a scheduled job that analyses analytics weekly and populates the `tasks` table with actionable items (e.g. update titles, create shorts).
2. Build the `/tasks` page to list tasks, show due dates and allow the user to mark them as complete.

## Phase 8: Polish & deploy

1. Add error handling, loading states and edge case handling throughout the app.
2. Refactor common UI elements into reusable components.
3. Write tests for helper functions and server actions.
4. Deploy to Vercel or another platform, configure environment variables and test the full OAuth flow in production.
