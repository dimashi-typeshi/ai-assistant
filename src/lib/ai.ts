import { supabase } from './supabase';

const systemPrompt = [
  'Ты AI-ассистент для малого бизнеса.',
  'Отвечай на русском языке, кратко и по делу.',
  'Давай практичные шаги, готовые тексты и конкретные идеи.',
  'Если данных мало, сделай разумное предположение и предложи, что уточнить.',
].join(' ');

type AiResponse = {
  text?: string;
  error?: string;
};

export type AiImageInput = {
  data: string;
  mimeType: string;
};

export async function askBusinessAssistant(prompt: string, image?: AiImageInput) {
  const { data, error } = await supabase.functions.invoke<AiResponse>('ai', {
    body: { image, prompt, system: systemPrompt },
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data?.error) {
    throw new Error(data.error);
  }

  if (!data?.text) {
    throw new Error('AI вернул пустой ответ. Попробуй переформулировать задачу.');
  }

  return data.text;
}
