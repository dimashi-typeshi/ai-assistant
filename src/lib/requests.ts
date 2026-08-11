import { supabase } from './supabase';

export type RequestStatus = 'new' | 'in_progress' | 'done';

export type RequestItem = {
  id: string;
  title: string;
  status: RequestStatus;
  deadline_at: string | null;
  label_color: string;
  created_at: string;
};

export type RequestNote = {
  id: string;
  request_id: string;
  text: string;
  created_at: string;
  updated_at: string;
};

export async function loadRequests() {
  return supabase
    .from('requests')
    .select('id, title, status, deadline_at, label_color, created_at')
    .order('created_at', { ascending: false });
}

export async function createRequest(title: string, deadlineAt: string | null, labelColor: string) {
  return supabase
    .from('requests')
    .insert({
      label_color: labelColor,
      title,
      deadline_at: deadlineAt,
    })
    .select('id')
    .single();
}

export async function updateRequest(id: string, status: RequestStatus, deadlineAt: string | null, labelColor: string) {
  return supabase
    .from('requests')
    .update({ status, deadline_at: deadlineAt, label_color: labelColor, updated_at: new Date().toISOString() })
    .eq('id', id);
}

export async function deleteRequest(id: string) {
  return supabase.from('requests').delete().eq('id', id);
}

export async function loadNotes(requestId: string) {
  return supabase
    .from('request_notes')
    .select('id, request_id, text, created_at, updated_at')
    .eq('request_id', requestId)
    .order('created_at', { ascending: false });
}

export async function createNote(requestId: string, text: string) {
  return supabase.from('request_notes').insert({ request_id: requestId, text });
}

export async function updateNote(id: string, text: string) {
  return supabase.from('request_notes').update({ text, updated_at: new Date().toISOString() }).eq('id', id);
}

export async function deleteNote(id: string) {
  return supabase.from('request_notes').delete().eq('id', id);
}
