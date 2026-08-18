import { supabase } from './supabase';

export type RentContract = {
  id: string;
  objectName: string;
  tenantName: string;
  startsAt: string;
  endsAt: string;
  monthlyAmount: number;
  isActive: boolean;
};

export type RentContractRow = {
  id: string;
  object_name: string;
  tenant_name: string;
  starts_at: string;
  ends_at: string;
  monthly_amount: number;
  is_active: boolean;
  created_at: string;
};

export type RentPayment = {
  id: string;
  objectName: string;
  dueAt: string;
  amount: number;
  isPaid: boolean;
};

export type RentPaymentRow = {
  id: string;
  object_name: string;
  due_at: string;
  amount: number;
  is_paid: boolean;
  created_at: string;
};

export type RentNote = {
  id: string;
  objectName: string;
  text: string;
  createdAt: string;
};

export type RentNoteRow = {
  id: string;
  object_name: string;
  text: string;
  created_at: string;
};

export function mapRentContract(row: RentContractRow): RentContract {
  return {
    endsAt: row.ends_at,
    id: row.id,
    isActive: row.is_active,
    monthlyAmount: Number(row.monthly_amount),
    objectName: row.object_name,
    startsAt: row.starts_at,
    tenantName: row.tenant_name,
  };
}

export function mapRentPayment(row: RentPaymentRow): RentPayment {
  return {
    amount: Number(row.amount),
    dueAt: row.due_at,
    id: row.id,
    isPaid: row.is_paid,
    objectName: row.object_name,
  };
}

export function mapRentNote(row: RentNoteRow): RentNote {
  return {
    createdAt: row.created_at,
    id: row.id,
    objectName: row.object_name,
    text: row.text,
  };
}

export function loadRentContracts() {
  return supabase
    .from('rent_contracts')
    .select('id, object_name, tenant_name, starts_at, ends_at, monthly_amount, is_active, created_at')
    .order('ends_at', { ascending: true });
}

export async function createRentContract(
  objectName: string,
  tenantName: string,
  startsAt: string,
  endsAt: string,
  monthlyAmount: number,
) {
  return await supabase.from('rent_contracts').insert({
    ends_at: endsAt,
    monthly_amount: monthlyAmount,
    object_name: objectName,
    starts_at: startsAt,
    tenant_name: tenantName,
  });
}

export function loadRentPayments() {
  return supabase
    .from('rent_payments')
    .select('id, object_name, due_at, amount, is_paid, created_at')
    .order('due_at', { ascending: true });
}

export async function createRentPayment(objectName: string, dueAt: string, amount: number) {
  return await supabase.from('rent_payments').insert({
    amount,
    due_at: dueAt,
    object_name: objectName,
  });
}

export function loadRentNotes() {
  return supabase
    .from('rent_notes')
    .select('id, object_name, text, created_at')
    .order('created_at', { ascending: false });
}

export async function createRentNote(objectName: string, text: string) {
  return await supabase.from('rent_notes').insert({
    object_name: objectName,
    text,
  });
}

export async function seedDemoRent() {
  await clearDemoRent();

  const [contracts, payments, notes] = await Promise.all([
    supabase.from('rent_contracts').insert([
      { ends_at: '2026-11-30', is_demo: true, monthly_amount: 280000, object_name: 'Квартира на Абая', starts_at: '2026-06-01', tenant_name: 'Айдана' },
      { ends_at: '2027-02-15', is_demo: true, monthly_amount: 420000, object_name: 'Офис в центре', starts_at: '2026-08-15', tenant_name: 'TOO Orion' },
    ]),
    supabase.from('rent_payments').insert([
      { amount: 280000, due_at: '2026-08-20', is_demo: true, object_name: 'Квартира на Абая' },
      { amount: 420000, due_at: '2026-09-01', is_demo: true, object_name: 'Офис в центре' },
    ]),
    supabase.from('rent_notes').insert([
      { is_demo: true, object_name: 'Квартира на Абая', text: 'Проверить счётчики воды перед оплатой.' },
      { is_demo: true, object_name: 'Офис в центре', text: 'Уточнить дату продления договора.' },
    ]),
  ]);

  return { error: contracts.error ?? payments.error ?? notes.error };
}

export async function clearDemoRent() {
  const [contracts, payments, notes] = await Promise.all([
    supabase.from('rent_contracts').delete().eq('is_demo', true),
    supabase.from('rent_payments').delete().eq('is_demo', true),
    supabase.from('rent_notes').delete().eq('is_demo', true),
  ]);

  return { error: contracts.error ?? payments.error ?? notes.error };
}

export function formatRentDate(value: string) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(value));
}

export function formatRentAmount(value: number) {
  return new Intl.NumberFormat('ru-KZ', {
    currency: 'KZT',
    maximumFractionDigits: 0,
    style: 'currency',
  }).format(value);
}
