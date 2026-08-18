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

export function loadRequests() {
  return supabase
    .from('requests')
    .select('id, title, status, deadline_at, label_color, created_at')
    .order('created_at', { ascending: false });
}

export async function createRequest(title: string, deadlineAt: string | null, labelColor: string) {
  return await supabase
    .from('requests')
    .insert({
      deadline_at: deadlineAt,
      label_color: labelColor,
      title,
    })
    .select('id')
    .single();
}

export async function updateRequest(id: string, status: RequestStatus, deadlineAt: string | null, labelColor: string) {
  return await supabase
    .from('requests')
    .update({ deadline_at: deadlineAt, label_color: labelColor, status, updated_at: new Date().toISOString() })
    .eq('id', id);
}

export async function deleteRequest(id: string) {
  return await supabase.from('requests').delete().eq('id', id);
}

export async function seedDemoRequests() {
  await clearDemoRequests();
  return supabase.from('requests').insert([
    { deadline_at: '2026-08-20T09:00:00.000Z', is_demo: true, label_color: '#4f8cff', status: 'new', title: 'Ответить клиенту по баннеру' },
    { deadline_at: '2026-08-21T15:00:00.000Z', is_demo: true, label_color: '#10a37f', status: 'in_progress', title: 'Проверить оплату аренды' },
    { deadline_at: '2026-08-23T12:00:00.000Z', is_demo: true, label_color: '#f59e0b', status: 'new', title: 'Подготовить отчёт за неделю' },
  ]);
}

export async function clearDemoRequests() {
  return await supabase.from('requests').delete().eq('is_demo', true);
}

export function loadNotes(requestId: string) {
  return supabase
    .from('request_notes')
    .select('id, request_id, text, created_at, updated_at')
    .eq('request_id', requestId)
    .order('created_at', { ascending: false });
}

export async function createNote(requestId: string, text: string) {
  return await supabase.from('request_notes').insert({ request_id: requestId, text });
}

export async function updateNote(id: string, text: string) {
  return await supabase.from('request_notes').update({ text, updated_at: new Date().toISOString() }).eq('id', id);
}

export async function deleteNote(id: string) {
  return await supabase.from('request_notes').delete().eq('id', id);
}
