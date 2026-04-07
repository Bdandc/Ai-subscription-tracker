import { StrictMode, useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { Session } from '@supabase/supabase-js';
import App from './App.tsx';
import LoginPage from './components/LoginPage.tsx';
import { supabase } from './lib/supabase.ts';
import './index.css';

function Root() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  if (session === undefined) return null; // loading
  return session ? <App session={session} /> : <LoginPage />;
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
);
