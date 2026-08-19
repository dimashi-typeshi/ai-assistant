import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

function isAuthCallbackUrl() {
  const authParams = new URLSearchParams(`${window.location.search}&${window.location.hash.replace(/^#/, '')}`);
  return authParams.has('code') || authParams.has('access_token') || authParams.has('refresh_token');
}

export function AuthStateRedirect() {
  const [, navigate] = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN' && isAuthCallbackUrl()) {
        setShowSuccess(true);
        navigate('/dashboard');
      }
    });

    return () => data.subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    if (!showSuccess) return;

    const timer = window.setTimeout(() => setShowSuccess(false), 2400);
    return () => window.clearTimeout(timer);
  }, [showSuccess]);

  if (!showSuccess) return null;

  return (
    <div className="auth-toast" role="status" aria-live="polite">
      Успешная верификация
    </div>
  );
}
