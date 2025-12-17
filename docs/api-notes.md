# YouTube API & OAuth notes

This document summarises important details about the YouTube APIs and the OAuth 2.0 flow used by the AI YouTube Manager.  Refer to the official Google documentation for up to date information.

## OAuth 2.0 flow

1. **Request authorisation** – Generate a URL via Google’s OAuth endpoints with your client ID, redirect URI and requested scopes.  Redirect the user to that URL.  The scopes you need include:
   - `https://www.googleapis.com/auth/youtube.readonly` (read channel data and analytics)
   - `https://www.googleapis.com/auth/youtube.upload` (upload videos and manage metadata)
   - `https://www.googleapis.com/auth/youtube` (manage account—optional for some features)
2. **User grants permission** – Google prompts the user to accept or decline the requested scopes.  On success, the user is redirected back to your redirect URI with a `code` parameter.
3. **Exchange code for tokens** – On the server, call Google’s token endpoint (`https://oauth2.googleapis.com/token`) with the code, client ID, client secret and redirect URI to obtain an **access token** and a **refresh token**.  Save the refresh token securely.
4. **Refresh tokens** – Access tokens expire after one hour.  Use the refresh token to obtain a new access token without requiring the user to log in again.  If the refresh token becomes invalid (e.g. the user revokes access), you must prompt them to reconnect.

## YouTube Data API

The YouTube Data API v3 is used to retrieve information about a user’s channel and videos, and to upload and schedule new videos.

- **List videos** – `GET https://www.googleapis.com/youtube/v3/videos` with `part=snippet,contentDetails,statistics` and `mine=true` will return metadata for the user’s uploads.  You can paginate results with the `pageToken` parameter.
- **List analytics** – For detailed metrics (watch time, average view duration, click through rate) you must call the **YouTube Analytics API** (`https://youtubeanalytics.googleapis.com/v2/reports`).  This requires additional scopes.
- **Upload videos** – Use the **resumable upload** protocol: send a POST request to `https://www.googleapis.com/upload/youtube/v3/videos?uploadType=resumable&part=snippet,status,schedule` with the video metadata (title, description, tags, publish time) and then upload the file in chunks to the returned session URI.  Set `status.privacyStatus` to `private` and `status.publishAt` to schedule a future release.
- **Set tags and metadata** – When uploading, include `snippet.tags` (array of strings) and `snippet.categoryId` (optional).  For scheduling, include `status.publishAt` in RFC3339 format.

## Rate limits

The YouTube Data API has quota costs for each endpoint (e.g. 1 unit per `videos.list`, 50 units per `videos.insert`).  Make sure to batch requests and only fetch the data you need.  For more information see the [quota calculator](https://developers.google.com/youtube/v3/getting-started#quota).

## Error handling

When calling Google APIs:

- Inspect the HTTP status code and the error body.  Common errors include 401 (invalid token), 403 (insufficient permissions), 404 (resource not found) and 429 (quota exceeded).
- Retry requests that fail due to transient errors, but do not retry on authentication failures without refreshing the token.
- Inform the user if their connection has been revoked and prompt them to reconnect.

## Testing

Google offers the [OAuth playground](https://developers.google.com/oauthplayground/) to manually test OAuth flows and API calls.  You can use it to experiment with different scopes and endpoints before integrating them into your application.
