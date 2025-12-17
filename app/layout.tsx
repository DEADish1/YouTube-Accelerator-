import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import { supabase } from '../lib/supabaseClient';

export const metadata: Metadata = {
  title: 'AI YouTube Manager',
  description: 'Grow your channel with AI‑powered insights and scheduling',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Check user session.  In a real app you might redirect to /login if
  // there is no active session.  The client side will handle further
  // authentication states.
  let sessionUser;
  try {
    const { data } = await supabase.auth.getUser();
    sessionUser = data.user;
  } catch (e) {
    sessionUser = null;
  }
  return (
    <html lang="en">
      <body className="min-h-screen bg-gray-50 text-gray-900">
        <header className="bg-white shadow">
          <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
            <Link href="/" className="font-bold text-xl">
              AI YouTube Manager
            </Link>
            {sessionUser && (
              <ul className="flex gap-4">
                <li>
                  <Link href="/dashboard" className="hover:underline">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/upload" className="hover:underline">
                    Upload
                  </Link>
                </li>
                <li>
                  <Link href="/tasks" className="hover:underline">
                    Tasks
                  </Link>
                </li>
                <li>
                  <Link href="/settings" className="hover:underline">
                    Settings
                  </Link>
                </li>
              </ul>
            )}
          </nav>
        </header>
        <main className="container mx-auto px-4 py-6">{children}</main>
      </body>
    </html>
  );
}
