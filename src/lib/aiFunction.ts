import { supabase } from './supabase';

type FunctionErrorWithContext = {
  context?: unknown;
  message?: unknown;
};

async function readFunctionError(error: unknown) {
  const context = (error as FunctionErrorWithContext).context;

  if (context instanceof Response) {
    try {
      const body = (await context.clone().json()) as { error?: unknown };
      if (typeof body.error === 'string' && body.error.trim()) return body.error;
    } catch {
      return 'AI сейчас не ответил. Попробуй еще раз чуть позже.';
    }
  }

  const message = (error as FunctionErrorWithContext).message;
  return typeof message === 'string' && message.trim()
    ? message
    : 'Не получилось обратиться к AI. Попробуй еще раз.';
}

export async function invokeAi<ResponseBody extends { error?: string }>(body: object) {
  const { data, error } = await supabase.functions.invoke<ResponseBody>('ai', { body });

  if (error) {
    throw new Error(await readFunctionError(error));
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  return data;
}
