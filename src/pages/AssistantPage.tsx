import { useState } from 'react';
import { ChatInput } from '../components/ChatInput';
import { ChatWindow } from '../components/ChatWindow';
import { ChatMessage } from '../components/MessageBubble';
import { PromptQuickActions } from '../components/PromptQuickActions';
import { SectionHeader } from '../components/SectionHeader';
import { askBusinessAssistant } from '../lib/ai';
import { isSupabaseConfigured } from '../lib/supabase';

function createMessage(role: ChatMessage['role'], text: string): ChatMessage {
  return {
    id: crypto.randomUUID(),
    role,
    text,
  };
}

export function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function sendPrompt(promptText = input) {
    const cleanPrompt = promptText.trim();
    if (!cleanPrompt || isLoading) return;

    setError('');
    setInput('');
    setIsLoading(true);
    setMessages((current) => [...current, createMessage('user', cleanPrompt)]);

    try {
      const answer = await askBusinessAssistant(cleanPrompt);
      setMessages((current) => [...current, createMessage('assistant', answer)]);
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
        <SectionHeader subtitle="Задай вопрос, попроси текст или собери план действий." title="Чат с ИИ" />
        <ChatWindow isLoading={isLoading} messages={messages} />

        {error && <p className="alert">{error}</p>}
        {!isSupabaseConfigured && <p className="alert">Сначала добавь Supabase URL и ключ в .env.</p>}

        <PromptQuickActions disabled={isLoading} onSelect={sendPrompt} />
        <ChatInput isLoading={isLoading} onChange={setInput} onSubmit={() => sendPrompt()} value={input} />
      </section>
    </main>
  );
}
