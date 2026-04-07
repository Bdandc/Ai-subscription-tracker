import { useState } from 'react';
import { CreditCard } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[--background] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-200 mb-4">
            <CreditCard className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-[--foreground] tracking-tight">SubTrack AI</h1>
          <p className="text-sm text-[--muted-foreground] mt-1">Sign in to manage your subscriptions</p>
        </div>

        <form onSubmit={handleLogin} className="card p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[--foreground]">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
              placeholder="you@example.com"
              className="w-full px-3 py-2.5 rounded-xl border border-[--border] bg-[--background] text-[--foreground] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[--foreground]">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              className="w-full px-3 py-2.5 rounded-xl border border-[--border] bg-[--background] text-[--foreground] text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-50 dark:bg-red-950/30 px-3 py-2 rounded-lg">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  );
}
