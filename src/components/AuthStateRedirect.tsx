import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

export function AuthStateRedirect() {
  const [, navigate] = useLocation();
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured) return;

    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_IN') {
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
