You are a senior full‑stack engineer working in the Cursor code‑first environment.  Your mission is to generate and refine the full codebase for an **AI YouTube Manager** web application.  The application should allow creators to log in, connect their YouTube channel, analyse performance, schedule uploads with custom tags and descriptions, and receive AI‑generated content ideas.

The project lives in the `ai-youtube-manager` folder.  It already contains a basic Next.js 14 scaffold with Supabase integration and Tailwind CSS.  Your task is to fill in the missing pieces so that the app works end‑to‑end.  Do not modify files outside of this folder unless explicitly instructed.

### Key requirements

1. **Authentication & user management**
   - Use Supabase for sign‑in/sign‑up (magic link) and manage user sessions.
   - Create a `profiles` table for additional user metadata.
   - Each user should be able to connect exactly one YouTube channel.

2. **YouTube OAuth integration**
   - Implement the full OAuth flow with Google: generate an auth URL, exchange the code for tokens and store the refresh token securely.
   - Use the refresh token to fetch the user’s channel details and recent uploads from the YouTube Data API v3 and the YouTube Analytics API.
   - Store channel metadata and video information in the database tables defined in `db/schema.sql`.

3. **Dashboard**
   - Show a list of the user’s recent videos with thumbnails, titles and basic statistics.
   - Display AI‑generated recommendations (ideas, titles, hooks, descriptions) once available.
   - Provide charts or tables summarising channel growth using data from `video_metrics_daily`.

4. **AI content assistant**
   - Write functions to call OpenAI (or another LLM) to generate content ideas, titles, hooks, descriptions and tags based on the user’s top‑performing videos.  See `docs/prompts.md` for guidance on prompts and expected output shape.
   - Save the outputs in the `content_ideas` and `ai_outputs` tables.

5. **Upload manager**
   - Build a client interface to schedule new uploads.  The form should accept a video file, title, description, list of tags and a publish datetime.
   - Store the uploaded file in Supabase Storage under a `videos` bucket and persist the scheduled record in the `scheduled_uploads` table.
   - Write a server action or cron job that checks for due uploads and calls the YouTube API to upload the video, set its metadata (title, description, tags) and schedule the publish time (`publishAt` property).  Mark the record as processed after success.

6. **Tasks and weekly reports**
   - Generate weekly tasks for the user based on their analytics (e.g. “Rewrite the title of Video X” or “Create three shorts from Video Y”).  Use a scheduled job or server action to populate the `tasks` table.
   - Present tasks in the UI with the ability to mark them as complete.

7. **Settings**
   - Provide a page where the user can connect or disconnect their YouTube channel.
   - Add a button to trigger a manual sync of videos and metrics.

### Implementation notes

- Use **Next.js App Router** with server components and server actions.  Keep sensitive operations on the server side.
- Leverage **Supabase Row Level Security** (RLS) as defined in `db/schema.sql` to isolate user data.  Use the service role key only for background jobs.
- Use **Tailwind CSS** for styling and maintain a clean, minimal user interface.
- Keep your code modular: place API calls in `lib/youtube.ts` and AI logic in `lib/ai.ts`.
- Write comprehensive error handling and loading states for each network request.

### Deliverables

By the end of the project the following should be true:

1. The user can sign in, connect their YouTube channel via OAuth and see their recent videos on the dashboard.
2. The app can schedule new uploads with a publish date, tags and description, and a background process uploads the video when due.
3. The user receives AI‑generated suggestions and tasks based on their analytics.
4. The code is well organised, documented and ready to deploy.
