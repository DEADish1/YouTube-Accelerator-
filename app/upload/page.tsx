"use client";

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';

interface ScheduledUpload {
  id: string;
  title: string;
  publish_at: string;
  processed: boolean;
}

export default function UploadPage() {
  const [scheduled, setScheduled] = useState<ScheduledUpload[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [tags, setTags] = useState('');
  const [publishAt, setPublishAt] = useState('');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [channelId, setChannelId] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Fetch channel and scheduled uploads
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/');
        return;
      }
      const { data: channels } = await supabase
        .from('channels')
        .select('*')
        .eq('user_id', user.id);
      const channel = channels?.[0];
      if (channel) {
        setChannelId(channel.id);
        const { data: uploads } = await supabase
          .from('scheduled_uploads')
          .select('*')
          .eq('channel_id', channel.id)
          .order('publish_at', { ascending: true });
        setScheduled((uploads ?? []) as unknown as ScheduledUpload[]);
      }
    };
    fetchData();
  }, [router]);

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault();
    if (!channelId) {
      alert('No channel connected.  Please connect your channel in Settings.');
      return;
    }
    if (!videoFile) {
      alert('Please select a video file');
      return;
    }
    try {
      // Upload the video to Supabase Storage.  For simplicity we store
      // it under the "videos" bucket named by the current timestamp.
      const fileName = `${Date.now()}-${videoFile.name}`;
      const { data: storageData, error: storageError } = await supabase.storage
        .from('videos')
        .upload(fileName, videoFile);
      if (storageError) throw storageError;
      const videoPath = storageData?.path ?? fileName;
      // Insert into scheduled_uploads table
      const { error: dbError } = await supabase.from('scheduled_uploads').insert({
        channel_id: channelId,
        title,
        description,
        tags: tags.split(/,\s*/).filter(Boolean),
        video_path: videoPath,
        publish_at: publishAt,
      });
      if (dbError) throw dbError;
      alert('Scheduled upload created');
      setTitle('');
      setDescription('');
      setTags('');
      setPublishAt('');
      setVideoFile(null);
      // Refresh list
      const { data: uploads } = await supabase
        .from('scheduled_uploads')
        .select('*')
        .eq('channel_id', channelId)
        .order('publish_at', { ascending: true });
      setScheduled((uploads ?? []) as unknown as ScheduledUpload[]);
    } catch (err: any) {
      alert(err.message);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Upload Manager</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Schedule a new upload</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Video File</label>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files?.[0] ?? null)}
              className="block border border-gray-300 px-3 py-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="block border border-gray-300 px-3 py-2 rounded w-full"
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block border border-gray-300 px-3 py-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Tags (comma separated)</label>
            <input
              type="text"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              className="block border border-gray-300 px-3 py-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-medium mb-1">Publish At</label>
            <input
              type="datetime-local"
              value={publishAt}
              onChange={(e) => setPublishAt(e.target.value)}
              className="block border border-gray-300 px-3 py-2 rounded w-full"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Save Schedule
          </button>
        </form>
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Scheduled uploads</h2>
        {scheduled.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {scheduled.map((item) => (
              <li key={item.id} className="py-3">
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-gray-600">Publish At: {new Date(item.publish_at).toLocaleString()}</p>
                <p className="text-sm text-gray-600">Status: {item.processed ? 'Uploaded' : 'Pending'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No scheduled uploads yet.</p>
        )}
      </div>
    </div>
  );
}
