import { getAuthUrl } from '../../lib/youtube';
import { getSupabaseClient } from '../../lib/supabaseClient';
import Link from 'next/link';

/**
 * Settings page.  Allows the user to connect/disconnect their YouTube
 * channel and trigger a manual sync.  The OAuth link is created
 * server-side to avoid exposing secrets in the browser.
 */
export default async function SettingsPage() {
  const supabase = getSupabaseClient(true);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Settings</h1>
        <p>Please sign in first.</p>
      </div>
    );
  }
  // Fetch existing channel connection
  const { data: channels } = await supabase
    .from('channels')
    .select('*')
    .eq('user_id', user.id);
  const channel = channels?.[0];
  const authUrl = getAuthUrl();

  async function disconnectChannel() {
    'use server';
    if (!channel) return;
    const supa = getSupabaseClient(true);
    await supa.from('channels').delete().eq('id', channel.id);
  }

  async function syncVideos() {
    'use server';
    // Placeholder for server action that fetches the user's videos from YouTube
    // using the refresh token and upserts them into the database.  This
    // action should be implemented in a real app.
    console.log('Syncing videos...');
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      {channel ? (
        <div className="space-y-4">
          <p>
            Connected channel: <span className="font-medium">{channel.yt_channel_id}</span>
          </p>
          <form action={disconnectChannel}>
            <button type="submit" className="bg-red-500 text-white px-4 py-2 rounded">
              Disconnect Channel
            </button>
          </form>
          <form action={syncVideos}>
            <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
              Sync Videos
            </button>
          </form>
        </div>
      ) : (
        <div>
          <p>No channel connected yet.</p>
          <Link
            href={authUrl}
            className="inline-block mt-4 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Connect YouTube Channel
          </Link>
        </div>
      )}
    </div>
  );
}
