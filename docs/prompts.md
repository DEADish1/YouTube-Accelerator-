# AI prompt templates

This file documents suggested prompt formats for interacting with large language models when generating content ideas, titles, hooks, descriptions and tags for YouTube videos.  These templates are intentionally structured to yield JSON responses that can be stored directly in the database.

## 1. Content idea generation

Use this prompt to generate a ranked list of content ideas for a channel.  The model should base its suggestions on existing top‑performing videos and current trends in the channel’s niche.

```
You are an expert YouTube strategist.  Given the following summary of a channel’s top‑performing videos, propose **ten** new video ideas that will likely attract more views and subscribers.  For each idea provide:
  - a short title (max 60 characters)
  - a one‑sentence description explaining why the idea is promising
  - a format: "long" (8+ minutes), "short" (<=60 seconds) or "community" (poll or text post)
  - a score from 0 to 1 indicating how strong the idea is

Return the results as a JSON array under the key `ideas` with objects containing `title`, `description`, `format` and `score` fields.

Channel summary:
{channel_summary}
```

Replace `{channel_summary}` with aggregated analytics data for the channel’s recent videos (e.g. topics, views, retention, subscriber gains).

## 2. Title and hook generation

After selecting an idea, use this prompt to generate an attention‑grabbing title and the opening hook of a script:

```
You are a creative YouTube title generator.  For the following video idea, create five engaging titles (max 100 characters) and three opening hooks (1‑2 sentences each) that will captivate viewers within the first five seconds.  Provide the results as JSON with two keys: `titles` (array of strings) and `hooks` (array of strings).

Video idea: {idea}
Audience: {audience_description}

```

## 3. Description and tags

To write a description and tags for a video, use this prompt:

```
You are a YouTube SEO assistant.  Write a compelling description for the following video that explains its value, encourages viewers to subscribe and includes a call to action.  Then suggest up to ten tags (single words or short phrases) that would improve discoverability.  Provide the output as JSON with keys `description` and `tags` (array of strings).

Video title: {title}
Video topic: {topic}

```

## Usage

- In `lib/ai.ts`, build functions that fill in these templates and send them to your LLM of choice (OpenAI ChatGPT, Anthropic Claude, etc.).
- Parse the JSON response and store each element in the appropriate table (`content_ideas` and `ai_outputs`).
- When designing new prompts, ensure they request structured JSON output to simplify parsing.
