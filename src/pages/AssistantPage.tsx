import { useState } from 'react';
import { ChatInput } from '../components/ChatInput';
import { ChatWindow } from '../components/ChatWindow';
import { ChatMessage } from '../components/MessageBubble';
import { PromptQuickActions } from '../components/PromptQuickActions';
import { SectionHeader } from '../components/SectionHeader';
import { askBusinessAssistant } from '../lib/ai';
import { readPhotoAsDataUrl, splitDataUrl } from '../lib/photos';
import { isSupabaseConfigured } from '../lib/supabase';

function createMessage(role: ChatMessage['role'], text: string, imageUrl?: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    imageUrl,
    role,
    text,
  };
}

export function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function sendPrompt(promptText = input) {
    const cleanPrompt = promptText.trim();
    if ((!cleanPrompt && !imageFile) || isLoading) return;

    setError('');
    setInput('');
    setIsLoading(true);
    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : undefined;
    const userText = cleanPrompt || 'Проанализируй фото и распредели информацию по нужным вкладкам.';
    setMessages((current) => [...current, createMessage('user', userText, imageUrl)]);

    try {
      const imageDataUrl = imageFile ? await readPhotoAsDataUrl(imageFile) : '';
      const image = imageDataUrl ? splitDataUrl(imageDataUrl) : undefined;
      const prompt = image
        ? `${userText}\n\nОпредели, что на фото, и предложи, какие данные добавить во вкладки: Аренда, Платежи, Заявки, Реклама, Профиль. Если видишь чек, договор, дату, сумму, объект или задачу - выпиши это структурировано.`
        : userText;
      const answer = await askBusinessAssistant(prompt, image);
      setMessages((current) => [...current, createMessage('assistant', answer)]);
      setImageFile(null);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Не получилось получить ответ.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="assistant-shell">
      <section className="assistant-panel">
        <SectionHeader subtitle="Задай вопрос, приложи фото или попроси разложить данные по вкладкам." title="Чат с ИИ" />
        <ChatWindow isLoading={isLoading} messages={messages} />

        {error && <p className="alert">{error}</p>}
        {!isSupabaseConfigured && <p className="alert">Сначала добавь Supabase URL и ключ в .env.</p>}

        <PromptQuickActions disabled={isLoading} onSelect={sendPrompt} />
        <ChatInput
          imageName={imageFile?.name ?? ''}
          isLoading={isLoading}
          onChange={setInput}
          onImageChange={setImageFile}
          onSubmit={() => sendPrompt()}
          value={input}
        />
      </section>
    </main>
  );
}
