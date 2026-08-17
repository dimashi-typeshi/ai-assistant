import { supabase } from './supabase';

export type Review = {
  id: string;
  author_name: string;
  text: string;
  created_at: string;
};

export async function loadReviews() {
  return supabase
    .from('reviews')
    .select('id, author_name, text, created_at')
    .order('created_at', { ascending: false })
    .limit(4);
}

export async function createReview(text: string, authorName: string) {
  return supabase
    .from('reviews')
    .insert({ author_name: authorName, text })
    .select('id')
    .single();
}
