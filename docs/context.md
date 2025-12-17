# Project context

The AI YouTube Manager is an experiment in combining modern web technologies (Next.js, Supabase) with machine learning to help content creators grow their channels.  The app is designed to be extensible: additional features such as competitor analysis, thumbnail generation or A/B testing can be added over time.

Key pieces of context to keep in mind:

1. **Limited API scope** – For security reasons the app requests only the scopes needed to read analytics, upload videos and manage metadata.  It does not request permission to delete or modify content without the user’s consent.
2. **Supabase as backend** – Supabase provides authentication, a PostgreSQL database with row level security, object storage (for video files) and scheduled functions (for cron jobs).  Use these capabilities instead of introducing additional infrastructure unless necessary.
3. **Privacy & compliance** – YouTube’s API policies require that you store user data securely, ask for only the minimum necessary scopes and provide a way for users to disconnect.  This project is structured to meet those requirements.
4. **AI assistance** – The AI features should enhance, not replace, the creator’s workflow.  Provide suggestions but allow the user to make the final decisions.

Throughout the project we prioritise maintainability, security and user control over their data.
