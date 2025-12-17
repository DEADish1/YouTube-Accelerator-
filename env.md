# Environment variables

To run the AI YouTube Manager in either development or production you must provide the following environment variables.  Keep secrets out of your version control by storing them in `.env.local` (Next.js automatically loads this file in development).

| Variable | Description | Example |
|---------|-------------|---------|
| `NEXT_PUBLIC_SUPABASE_URL` | The URL of your Supabase project.  Exposed to the browser. | `https://abcxyz.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The anonymous/public API key for Supabase.  Exposed to the browser. | `eyJhbGciOiJI...` |
| `SUPABASE_SERVICE_ROLE_KEY` | A service role key with elevated privileges.  Used only in server actions or background jobs (never expose to the browser). | `eyJhbGciOiJI...` |
| `OPENAI_API_KEY` | API key for OpenAI if you intend to generate titles, descriptions or recommendations. | `sk-...` |
| `YOUTUBE_CLIENT_ID` | Google OAuth Client ID for your application. | `1234567890-abc.apps.googleusercontent.com` |
| `YOUTUBE_CLIENT_SECRET` | Google OAuth Client Secret for your application. | *(secret)* |
| `YOUTUBE_REDIRECT_URI` | Redirect URI registered in the Google console.  Should point to your Next.js callback route. | `http://localhost:3000/api/auth/callback/google` |
| `GOOGLE_API_SCOPES` | A space‑separated list of OAuth scopes needed to read analytics, manage uploads and schedule videos. | `https://www.googleapis.com/auth/youtube.readonly https://www.googleapis.com/auth/youtube.upload` |
| `APP_URL` | The base URL of your application.  Used when constructing OAuth callbacks and email links. | `http://localhost:3000` |

When deploying to production you may use a secrets manager (e.g. Supabase Config Vars or Vercel Environment Variables) to set these values securely.
