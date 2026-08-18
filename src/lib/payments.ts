import { supabase } from './supabase';

export type PaymentOperation = {
  id: string;
  title: string;
  amount: number;
  paidAt: string;
  status: string;
};

export type PendingPayment = {
  id: string;
  title: string;
  amount: number;
  dueAt: string;
};

export type PaymentReminder = {
  id: string;
  title: string;
  remindAt: string;
};

export type PaymentOperationRow = {
  id: string;
  title: string;
  amount: number;
  paid_at: string;
  status: string;
};

export type PendingPaymentRow = {
  id: string;
  title: string;
  amount: number;
  due_at: string;
};

export type PaymentReminderRow = {
  id: string;
  title: string;
  remind_at: string;
};

export function mapPaymentOperation(row: PaymentOperationRow): PaymentOperation {
  return { amount: Number(row.amount), id: row.id, paidAt: row.paid_at, status: row.status, title: row.title };
}

export function mapPendingPayment(row: PendingPaymentRow): PendingPayment {
  return { amount: Number(row.amount), dueAt: row.due_at, id: row.id, title: row.title };
}

export function mapPaymentReminder(row: PaymentReminderRow): PaymentReminder {
  return { id: row.id, remindAt: row.remind_at, title: row.title };
}

export function loadPaymentOperations() {
  return supabase.from('payment_operations').select('id, title, amount, paid_at, status').order('paid_at', { ascending: false });
}

export async function createPaymentOperation(title: string, amount: number, paidAt: string) {
  return await supabase.from('payment_operations').insert({ amount, paid_at: paidAt, status: 'Оплачено', title });
}

export function loadPendingPayments() {
  return supabase.from('pending_payments').select('id, title, amount, due_at').order('due_at', { ascending: true });
}

export async function createPendingPayment(title: string, amount: number, dueAt: string) {
  return await supabase.from('pending_payments').insert({ amount, due_at: dueAt, title });
}

export function loadPaymentReminders() {
  return supabase.from('payment_reminders').select('id, title, remind_at').order('remind_at', { ascending: true });
}

export async function createPaymentReminder(title: string, remindAt: string) {
  return await supabase.from('payment_reminders').insert({ remind_at: remindAt, title });
}

export async function seedDemoPayments() {
  await clearDemoPayments();

  const [operations, pending, reminders] = await Promise.all([
    supabase.from('payment_operations').insert([
      { amount: 420000, is_demo: true, paid_at: '2026-08-15', status: 'Оплачено', title: 'Аренда офиса' },
      { amount: 38500, is_demo: true, paid_at: '2026-08-16', status: 'Оплачено', title: 'Коммунальные услуги' },
    ]),
    supabase.from('pending_payments').insert([
      { amount: 280000, due_at: '2026-08-20', is_demo: true, title: 'Квартира на Абая' },
      { amount: 15000, due_at: '2026-08-25', is_demo: true, title: 'Интернет офиса' },
    ]),
    supabase.from('payment_reminders').insert([
      { is_demo: true, remind_at: '2026-08-19', title: 'Проверить оплату аренды' },
      { is_demo: true, remind_at: '2026-08-21', title: 'Отправить чек арендатору' },
    ]),
  ]);

  return { error: operations.error ?? pending.error ?? reminders.error };
}

export async function clearDemoPayments() {
  const [operations, pending, reminders] = await Promise.all([
    supabase.from('payment_operations').delete().eq('is_demo', true),
    supabase.from('pending_payments').delete().eq('is_demo', true),
    supabase.from('payment_reminders').delete().eq('is_demo', true),
  ]);

  return { error: operations.error ?? pending.error ?? reminders.error };
}

export function formatPaymentDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(value));
}

export function formatPaymentAmount(value: number) {
  return new Intl.NumberFormat('ru-KZ', { currency: 'KZT', maximumFractionDigits: 0, style: 'currency' }).format(value);
}
