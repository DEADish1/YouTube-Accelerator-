# Coding rules and conventions

Follow these rules when contributing to or extending the AI YouTube Manager codebase.  They ensure consistency, security and clarity across the project.

1. **Keep secrets safe**
   - Never expose the `SUPABASE_SERVICE_ROLE_KEY`, YouTube refresh tokens or OpenAI API keys on the client side.  Only use them in server actions or background jobs.
   - Use environment variables (`process.env.*`) rather than hard‑coding any keys into the source code.

2. **Server actions vs client components**
   - Sensitive operations (database writes, token exchanges, API calls) must happen in server actions.  Mark these functions with `'use server'` and place them in server components or route handlers.
   - Use client components for forms and interactions that need local state or event handlers.  Keep them as lightweight as possible, delegating heavy lifting to the server.

3. **Database interactions**
   - Use Supabase’s Row Level Security to enforce user isolation.  Always scope queries by the current user’s `auth.uid()` when reading or writing data.
   - Normalize data where possible (e.g. separate tables for channels, videos, metrics).  Avoid storing large arrays of objects in a single column.

4. **Modular code**
   - Place third‑party API wrappers and helper functions in `lib/`.  Do not mix UI code with data fetching logic.
   - Keep server logic in route handlers or server components so that it never runs in the browser.

5. **Tailwind styling**
   - Use Tailwind CSS classes consistently.  Avoid inline styles unless necessary.
   - Create reusable components for common UI patterns (cards, buttons, forms) as the project grows.

6. **Type safety**
   - Use TypeScript throughout the project.  Define interfaces for data coming from Supabase and external APIs.
   - When working with dynamic data (`any` or untyped JSON), validate the shape before using it.

7. **Testing**
   - Write unit tests for non‑trivial functions in `lib/` (e.g. AI prompt helpers) to ensure they behave correctly.
   - Use integration tests for server actions to check database interactions and error handling.

8. **Documentation**
   - Keep the docs in the `docs/` folder up to date.  Whenever you add a new feature or modify existing behaviour, update the relevant markdown files.
   - Comment your code liberally.  Explain the purpose of complex functions and any non‑obvious logic.
