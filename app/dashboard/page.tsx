import { getSupabaseClient } from '../../lib/supabaseClient';
import Link from 'next/link';

/**
 * Dashboard page.
 *
 * This server component fetches the current user's channels and a few
 * recent videos from Supabase.  If there is no channel connected it
 * prompts the user to connect one in the settings page.
 */
export default async function DashboardPage() {
  const supabase = getSupabaseClient(true);
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>You are not logged in.  Please sign in from the home page.</p>
      </div>
    );
  }
  // Fetch the user's channels
  const { data: channels } = await supabase
    .from('channels')
    .select('*')
    .eq('user_id', user.id);
  const channel = channels?.[0];
  if (!channel) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <p>No channel connected.  Head to <Link href="/settings" className="underline">Settings</Link> to connect your YouTube channel.</p>
      </div>
    );
  }
  // Fetch recent videos.  Limit to 5 for the dashboard preview.
  const { data: videos } = await supabase
    .from('videos')
    .select('*')
    .eq('channel_id', channel.id)
    .order('published_at', { ascending: false })
    .limit(5);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Recent Videos</h2>
        {videos && videos.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {videos.map((video) => (
              <li key={video.id} className="py-3 flex gap-4 items-start">
                {video.thumbnail_url && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={video.thumbnail_url} alt={video.title} className="w-24 h-14 object-cover rounded" />
                )}
                <div>
                  <p className="font-medium">{video.title}</p>
                  <p className="text-sm text-gray-600">Published: {new Date(video.published_at).toLocaleDateString()}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No videos found.  Sync your channel from the settings page.</p>
        )}
      </div>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Top Recommendations</h2>
        <p className="text-gray-600">AI-generated ideas and suggestions will appear here once the analysis engine has run.</p>
      </div>
    </div>
  );
}
