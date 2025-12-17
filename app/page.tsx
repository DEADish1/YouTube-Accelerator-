"use client";
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
      if (data.session) {
        router.push('/dashboard');
      }
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        router.push('/dashboard');
      }
    });
    return () => {
      listener.subscription?.unsubscribe();
    };
  }, [router]);

  const signInWithEmail = async () => {
    const email = prompt('Enter your email address to receive a magic link');
    if (!email) return;
    const { error } = await supabase.auth.signInWithOtp({ email });
    if (error) alert(error.message);
    else alert('Check your email for the login link');
  };

  return (
    <div className="max-w-xl mx-auto mt-12 text-center">
      <h1 className="text-3xl font-bold mb-4">Welcome to your AI‑powered channel assistant</h1>
      <p className="mb-8">
        Sign in to connect your YouTube channel, schedule uploads, and receive personalised
        recommendations to grow your audience.
      </p>
      {loading ? (
        <p>Loading…</p>
      ) : session ? (
        <p>Redirecting…</p>
      ) : (
        <>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={() => signInWithEmail()}
          >
            Sign in with Email
          </button>
        </>
      )}
    </div>
  );
}
