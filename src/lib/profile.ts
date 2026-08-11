import { supabase } from './supabase';

export type ProfileData = {
  name: string;
  phone: string;
  avatarUrl: string;
};

export async function loadProfile() {
  return supabase.auth.getUser();
}

export async function updateProfile(data: ProfileData) {
  return supabase.auth.updateUser({
    data: {
      avatar_url: data.avatarUrl,
      full_name: data.name,
      phone: data.phone,
    },
  });
}

export async function updateEmail(email: string) {
  return supabase.auth.updateUser(
    { email },
    { emailRedirectTo: window.location.origin },
  );
}

export async function sendPasswordReset(email: string) {
  return supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin,
  });
}

export async function signOut() {
  return supabase.auth.signOut();
}
