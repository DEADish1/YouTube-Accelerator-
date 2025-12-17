# High-level plan

This plan outlines the strategic steps required to complete the AI YouTube Manager.  It is a complement to the detailed tasks in `build-checklist.md`.

## 1. Foundation

Set up the Next.js application with TypeScript and Tailwind.  Configure Supabase for authentication, storage and database.  Test sign‑in flows locally.

## 2. OAuth integration

Implement the Google OAuth flow.  Users must be able to connect their YouTube account, and the app should store a refresh token for future API calls.  Create a route handler for the OAuth callback and handle error states (e.g. user denies permission).

## 3. Data ingestion

Use the refresh token to fetch the user’s channel and video data.  Write server actions to call the YouTube Data and Analytics APIs, parse responses and insert or update records in the database.  Implement pagination to handle channels with many videos.

## 4. User interface

Design the dashboard, upload manager, tasks page and settings page.  Use responsive design practices so the app works on mobile and desktop.  Keep the UI minimal and functional; add more embellishments later.

## 5. AI capabilities

Develop prompt templates for generating content ideas, titles, hooks and tags.  Write helper functions to call the OpenAI API with these prompts and parse the responses.  Store the outputs in the database and surface them in the UI.

## 6. Scheduling and background jobs

Leverage Supabase Functions or an external scheduler to run jobs on a regular cadence.  One job should synchronise analytics daily, another should process due scheduled uploads, and a weekly job should generate tasks and recommendations.

## 7. Polish, testing and deployment

Refine error handling and loading states.  Write unit and integration tests.  Deploy to a hosting provider (Vercel, Netlify, etc.), configure environment variables and test the OAuth flow in production.  Add logging and monitoring as needed.
