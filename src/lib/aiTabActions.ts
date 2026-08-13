import { supabase } from './supabase';
import { createRentContract, createRentNote, createRentPayment } from './rent';
import { createRequest } from './requests';

export type AiTabAction =
  | {
      type: 'rent_contract';
      objectName: string;
      tenantName: string;
      startsAt: string;
      endsAt: string;
      monthlyAmount: number;
    }
  | {
      type: 'rent_payment';
      objectName: string;
      dueAt: string;
      amount: number;
    }
  | {
      type: 'rent_note';
      objectName: string;
      text: string;
    }
  | {
      type: 'request';
      title: string;
      deadlineAt: string | null;
    };

type AiActionResponse = {
  text?: string;
  actions?: AiTabAction[];
  error?: string;
};

const actionSystemPrompt = [
  'Ты извлекаешь из сообщения пользователя данные для вкладок приложения молодого бизнеса.',
  'Верни только JSON без markdown.',
  'Формат: {"actions":[...]}',
  'Разрешённые type: rent_contract, rent_payment, rent_note, request.',
  'Для rent_contract нужны objectName, tenantName, startsAt, endsAt, monthlyAmount.',
  'Для rent_payment нужны objectName, dueAt, amount.',
  'Для rent_note нужны objectName, text.',
  'Для request нужны title, deadlineAt. Если даты нет, deadlineAt=null.',
  'Даты возвращай в формате YYYY-MM-DD. Суммы возвращай числом.',
  'Если данных для записи недостаточно, верни {"actions":[]}.',
].join(' ');

function isDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

function cleanText(value: unknown) {
  return typeof value === 'string' ? value.trim() : '';
}

function cleanAmount(value: unknown) {
  const amount = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(amount) && amount >= 0 ? amount : null;
}

function normalizeAction(value: unknown): AiTabAction | null {
  if (!value || typeof value !== 'object') return null;
  const item = value as Record<string, unknown>;

  if (item.type === 'rent_contract') {
    const monthlyAmount = cleanAmount(item.monthlyAmount);
    const objectName = cleanText(item.objectName);
    const tenantName = cleanText(item.tenantName);
    const startsAt = cleanText(item.startsAt);
    const endsAt = cleanText(item.endsAt);
    if (!monthlyAmount || !objectName || !tenantName || !isDate(startsAt) || !isDate(endsAt)) return null;
    return { type: 'rent_contract', objectName, tenantName, startsAt, endsAt, monthlyAmount };
  }

  if (item.type === 'rent_payment') {
    const amount = cleanAmount(item.amount);
    const objectName = cleanText(item.objectName);
    const dueAt = cleanText(item.dueAt);
    if (!amount || !objectName || !isDate(dueAt)) return null;
    return { type: 'rent_payment', objectName, dueAt, amount };
  }

  if (item.type === 'rent_note') {
    const objectName = cleanText(item.objectName);
    const text = cleanText(item.text);
    if (!objectName || !text) return null;
    return { type: 'rent_note', objectName, text };
  }

  if (item.type === 'request') {
    const title = cleanText(item.title);
    const deadlineAt = item.deadlineAt === null ? null : cleanText(item.deadlineAt);
    if (!title || (deadlineAt !== null && !isDate(deadlineAt))) return null;
    return { type: 'request', title, deadlineAt };
  }

  return null;
}

export async function suggestTabActions(prompt: string) {
  const { data, error } = await supabase.functions.invoke<AiActionResponse>('ai', {
    body: { prompt, system: actionSystemPrompt },
  });

  if (error || data?.error) return [];
  const rawActions = data?.actions ?? parseActions(data?.text);
  return rawActions.map(normalizeAction).filter((action): action is AiTabAction => action !== null);
}

function parseActions(text = '') {
  try {
    const cleanText = text.replace(/```json|```/g, '').trim();
    const parsed = JSON.parse(cleanText) as { actions?: unknown[] };
    return Array.isArray(parsed.actions) ? parsed.actions : [];
  } catch {
    return [];
  }
}

export async function applyTabAction(action: AiTabAction) {
  if (action.type === 'rent_contract') {
    return createRentContract(action.objectName, action.tenantName, action.startsAt, action.endsAt, action.monthlyAmount);
  }

  if (action.type === 'rent_payment') {
    return createRentPayment(action.objectName, action.dueAt, action.amount);
  }

  if (action.type === 'rent_note') {
    return createRentNote(action.objectName, action.text);
  }

  return createRequest(action.title, action.deadlineAt, '#4f8cff');
}

export async function applySuggestedTabActions(prompt: string) {
  const actions = await suggestTabActions(prompt);
  if (actions.length === 0) return { appliedCount: 0, error: '' };

  const results = await Promise.all(actions.map(applyTabAction));
  const failed = results.find((result) => result.error);
  return {
    appliedCount: failed?.error ? 0 : actions.length,
    error: failed?.error?.message ?? '',
  };
}

export function getActionTitle(action: AiTabAction) {
  if (action.type === 'rent_contract') return `Договор: ${action.objectName}`;
  if (action.type === 'rent_payment') return `Оплата: ${action.objectName}`;
  if (action.type === 'rent_note') return `Заметка: ${action.objectName}`;
  return `Заявка: ${action.title}`;
}

export function getActionDetails(action: AiTabAction) {
  if (action.type === 'rent_contract') {
    return `${action.tenantName}, ${action.startsAt} - ${action.endsAt}, ${action.monthlyAmount} ₸`;
  }

  if (action.type === 'rent_payment') return `${action.dueAt}, ${action.amount} ₸`;
  if (action.type === 'rent_note') return action.text;
  return action.deadlineAt ? `Дедлайн: ${action.deadlineAt}` : 'Без дедлайна';
}
