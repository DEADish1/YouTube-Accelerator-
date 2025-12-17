# Architecture

The AI YouTube Manager follows a layered architecture built on top of **Next.js (App Router)** and **Supabase**.  It separates concerns into distinct layers to improve maintainability and testability.

## Layers

### 1. Frontend (UI)

Implemented in React and powered by the Next.js App Router.  Pages live in `app/` and by default are server components.  Client components are used where stateful interactions are needed (forms, file uploads, etc.).  Tailwind CSS provides styling and simple theming.

### 2. API layer

Supabase’s API (PostgreSQL) handles all data persistence.  We interact with it via the `@supabase/supabase-js` client and server actions.  Row level security enforces user isolation.  Object storage (Supabase Storage) is used for video files uploaded via the upload manager.

### 3. External services

- **Google OAuth** – The app uses Google OAuth to connect the user’s YouTube account.  The OAuth code is exchanged for access and refresh tokens on the server side.  The refresh token is stored in the `channels` table.
- **YouTube Data API & YouTube Analytics API** – These APIs provide metadata about the user’s channel and videos.  They also accept uploads and allow scheduled publishing via the `publishAt` property.  All calls to these APIs are made from server actions to protect tokens.
- **OpenAI (optional)** – The AI helper uses OpenAI to generate content ideas, titles, hooks and tags.  These calls happen server side using your `OPENAI_API_KEY`.

## Flows

### Connecting a channel
1. The user clicks “Connect YouTube Channel” in the Settings page.
2. The server renders an OAuth URL using `getAuthUrl()` and the page returns a link.
3. The user authorises the app.  Google redirects back to `/api/auth/callback/google` with an auth code.
4. A server action exchanges the code for tokens, stores the refresh token in the `channels` table and fetches basic channel information.
5. The user is redirected to the dashboard.

### Syncing videos
1. The user triggers a sync from the Settings page (or a scheduled job runs automatically).
2. A server action uses the stored refresh token to obtain a new access token.
3. The action calls the YouTube Data API to fetch the user’s videos and their analytics.
4. The results are upserted into the `videos` and `video_metrics_daily` tables.

### Scheduling uploads
1. The user navigates to `/upload` and selects a video file, enters a title, description, tags and a future publish time.
2. The client uploads the file to Supabase Storage and then inserts a record into `scheduled_uploads`.
3. A scheduled job wakes up periodically, queries for uploads with `publish_at` <= now() and `processed = false`, uploads the video via the YouTube API, sets the metadata and scheduled publish time, and then marks the record as processed.

### Generating ideas
1. A scheduled job or server action analyses the top performing videos using metrics from `video_metrics_daily`.
2. It calls OpenAI with custom prompts defined in `prompts.md` to generate content ideas and associated metadata.
3. It stores the results in the `content_ideas` and `ai_outputs` tables.
4. The dashboard displays the generated ideas and suggestions to the user.

This architecture ensures that sensitive operations remain on the server, while the user interface stays responsive and easy to use.
