/**
 * Helper functions for interacting with the YouTube Data API and
 * handling OAuth flows.  These functions are currently stubs and
 * return dummy values.  They are intended to be replaced with real
 * implementations using the Google OAuth endpoints and YouTube API.
 */

import { google } from 'googleapis';

// Define the scopes required for accessing channel data and uploading videos.
export const YOUTUBE_SCOPES = (process.env.GOOGLE_API_SCOPES ?? '').split(' ');

/**
 * Create an OAuth2 client using the Google APIs library.  The client
 * ID, secret and redirect URI are pulled from environment variables.
 */
function getOAuthClient() {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET;
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI;
  if (!clientId || !clientSecret || !redirectUri) {
    throw new Error('Missing Google OAuth environment variables');
  }
  return new google.auth.OAuth2(clientId, clientSecret, redirectUri);
}

/**
 * Returns a URL that the user can navigate to in order to grant this
 * application permission to access their YouTube account.  When the
 * user finishes authorising the app, Google will redirect them back
 * to the provided redirect URI with an auth code.  That code must be
 * exchanged for tokens using `exchangeCodeForTokens`.
 */
export function getAuthUrl() {
  const client = getOAuthClient();
  const url = client.generateAuthUrl({
    access_type: 'offline',
    scope: YOUTUBE_SCOPES,
    prompt: 'consent',
  });
  return url;
}

/**
 * Exchanges an authorisation code for an access token and a refresh
 * token.  The refresh token can be stored securely and used to
 * generate new access tokens without requiring the user to log in
 * again.  This function returns the tokens along with their expiry.
 */
export async function exchangeCodeForTokens(code: string) {
  const client = getOAuthClient();
  const { tokens } = await client.getToken(code);
  return tokens;
}

/**
 * Refreshes an access token using a stored refresh token.  The
 * returned object contains a new access token and its expiration
 * timestamp.  If the refresh token is invalid or expired, this
 * function will throw an error.
 */
export async function refreshAccessToken(refreshToken: string) {
  const client = getOAuthClient();
  client.setCredentials({ refresh_token: refreshToken });
  const { credentials } = await client.refreshAccessToken();
  return credentials;
}

/**
 * Fetches the authenticated user's channel statistics and recent
 * uploads.  The caller must provide a valid access token.  This
 * function demonstrates how to call the YouTube Data API v3 using
 * fetch.  You may replace fetch with the `googleapis` library if
 * preferred.
 */
export async function fetchChannelVideos(accessToken: string) {
  const params = new URLSearchParams({
    part: 'snippet,contentDetails,statistics',
    mine: 'true',
    maxResults: '50',
  });
  const res = await fetch(`https://www.googleapis.com/youtube/v3/videos?${params.toString()}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json',
    },
  });
  if (!res.ok) {
    throw new Error(`YouTube API request failed: ${res.status} ${await res.text()}`);
  }
  return res.json();
}

/**
 * Schedules a video upload.  This function inserts a record into the
 * `scheduled_uploads` table via Supabase.  A background job can
 * later read from this table and perform the actual upload.  Note
 * that this function does not upload the file itself; you must
 * upload the file to Supabase Storage or another storage provider
 * prior to calling this helper.
 */
import { supabase } from './supabaseClient';
export async function createScheduledUpload(channelId: string, title: string, description: string, tags: string[], videoPath: string, publishAt: string) {
  const { data, error } = await supabase
    .from('scheduled_uploads')
    .insert({
      channel_id: channelId,
      title,
      description,
      tags,
      video_path: videoPath,
      publish_at: publishAt,
    })
    .single();
  if (error) throw error;
  return data;
}