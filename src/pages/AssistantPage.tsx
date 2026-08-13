import { useEffect, useRef, useState } from 'react';
import { AiPermissionDialog } from '../components/AiPermissionDialog';
import { ChatInput } from '../components/ChatInput';
import { ChatWindow } from '../components/ChatWindow';
import { ChatMessage } from '../components/MessageBubble';
import { PromptQuickActions } from '../components/PromptQuickActions';
import { SectionHeader } from '../components/SectionHeader';
import { askBusinessAssistant } from '../lib/ai';
import { AiTabAction, applyTabAction, suggestTabActions } from '../lib/aiTabActions';
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
  const [isSavingActions, setIsSavingActions] = useState(false);
  const [pendingActions, setPendingActions] = useState<AiTabAction[]>([]);
  const typingTimerRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);
  }, []);

  function showAnswerGradually(answer: string) {
    const messageId = crypto.randomUUID();
    let index = 0;

    setMessages((current) => [...current, { id: messageId, role: 'assistant', text: '' }]);
    if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);

    typingTimerRef.current = window.setInterval(() => {
      index += 2;
      setMessages((current) => current.map((message) => (
        message.id === messageId ? { ...message, text: answer.slice(0, index) } : message
      )));

      if (index >= answer.length && typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    }, 18);
  }

  async function sendPrompt(promptText = input) {
    const cleanPrompt = promptText.trim();
    if ((!cleanPrompt && !imageFile) || isLoading) return;

    setError('');
    setInput('');
    setIsLoading(true);
    const imageUrl = imageFile ? URL.createObjectURL(imageFile) : undefined;
    const userText = cleanPrompt || 'Проанализируй фото и вытащи нужную информацию для моего бизнеса.';
    setMessages((current) => [...current, createMessage('user', userText, imageUrl)]);

    try {
      const imageDataUrl = imageFile ? await readPhotoAsDataUrl(imageFile) : '';
      const image = imageDataUrl ? splitDataUrl(imageDataUrl) : undefined;
      const prompt = image
        ? `${userText}\n\nОпредели, что на фото. Вытащи даты, суммы, контакты, объекты, задачи, товары и предложи, во какие вкладки это добавить: Аренда, Платежи, Заявки, Реклама, Профиль.`
        : userText;
      const answer = await askBusinessAssistant(prompt, image);
      showAnswerGradually(answer);
      const actions = await suggestTabActions(prompt);
      if (actions.length > 0) setPendingActions(actions);
      setImageFile(null);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Не получилось получить ответ.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  async function approveActions() {
    setIsSavingActions(true);
    setError('');

    try {
      const results = await Promise.all(pendingActions.map(applyTabAction));
      const failed = results.find((result) => result.error);
      if (failed?.error) {
        setError(failed.error.message);
        return;
      }

      setMessages((current) => [
        ...current,
        createMessage('assistant', `Готово, записал во вкладки: ${pendingActions.length}`),
      ]);
      setPendingActions([]);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Не получилось записать данные во вкладки.');
    } finally {
      setIsSavingActions(false);
    }
  }

  return (
    <main className="assistant-shell">
      <section className="assistant-panel">
        <SectionHeader subtitle="Генерируй ответы, получай советы по данным, проси роль персонажа или анализ фото." title="Чат с ИИ" />
        <ChatWindow isLoading={isLoading} messages={messages} />
        <p className="ai-disclaimer">ИИ может ошибаться</p>

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
        <AiPermissionDialog
          actions={pendingActions}
          isSaving={isSavingActions}
          onApprove={() => void approveActions()}
          onCancel={() => setPendingActions([])}
        />
      </section>
    </main>
  );
}
