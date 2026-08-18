import { useEffect, useRef, useState } from 'react';
import { ChatHistoryPanel, SavedChat } from '../components/ChatHistoryPanel';
import { ChatInput } from '../components/ChatInput';
import { ChatWindow } from '../components/ChatWindow';
import { ChatMessage } from '../components/MessageBubble';
import { PromptQuickActions } from '../components/PromptQuickActions';
import { SectionHeader } from '../components/SectionHeader';
import { askBusinessAssistant } from '../lib/ai';
import { applySuggestedTabActions } from '../lib/aiTabActions';
import { readPhotoAsDataUrl, splitDataUrl } from '../lib/photos';
import { isSupabaseConfigured } from '../lib/supabase';

const historyKey = 'aiChatHistory';

function createMessage(role: ChatMessage['role'], text: string, imageUrl?: string): ChatMessage {
  return { id: crypto.randomUUID(), imageUrl, role, text };
}

function loadSavedChats() {
  try {
    const parsed = JSON.parse(localStorage.getItem(historyKey) ?? '[]') as SavedChat[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getChatTitle(messages: ChatMessage[]) {
  return messages.find((message) => message.role === 'user')?.text.slice(0, 54) || 'Новая переписка';
}

export function AssistantPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [savedChats, setSavedChats] = useState<SavedChat[]>(loadSavedChats);
  const [activeChatId, setActiveChatId] = useState<string>(crypto.randomUUID());
  const [input, setInput] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const typingTimerRef = useRef<number | null>(null);
  const messagesRef = useRef<ChatMessage[]>([]);

  useEffect(() => () => {
    if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);
  }, []);

  function updateMessages(nextMessages: ChatMessage[]) {
    messagesRef.current = nextMessages;
    setMessages(nextMessages);
  }

  function saveChat(nextMessages: ChatMessage[]) {
    const cleanMessages = nextMessages.map(({ actionHref, actionLabel, id, role, text }) => ({ actionHref, actionLabel, id, role, text }));
    const nextChat: SavedChat = {
      id: activeChatId,
      messages: cleanMessages,
      title: getChatTitle(cleanMessages),
      updatedAt: new Date().toISOString(),
    };
    const nextChats = [nextChat, ...savedChats.filter((chat) => chat.id !== activeChatId)].slice(0, 20);
    setSavedChats(nextChats);
    localStorage.setItem(historyKey, JSON.stringify(nextChats));
  }

  function showAnswerGradually(answer: string) {
    const messageId = crypto.randomUUID();
    let index = 0;
    updateMessages([...messagesRef.current, { id: messageId, role: 'assistant', text: '' }]);
    if (typingTimerRef.current) window.clearInterval(typingTimerRef.current);

    typingTimerRef.current = window.setInterval(() => {
      index += 2;
      const nextMessages = messagesRef.current.map((message) => (
        message.id === messageId ? { ...message, text: answer.slice(0, index) } : message
      ));
      updateMessages(nextMessages);

      if (index >= answer.length && typingTimerRef.current) {
        window.clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
        saveChat(nextMessages);
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
    updateMessages([...messagesRef.current, createMessage('user', userText, imageUrl)]);

    try {
      const imageDataUrl = imageFile ? await readPhotoAsDataUrl(imageFile) : '';
      const image = imageDataUrl ? splitDataUrl(imageDataUrl) : undefined;
      const prompt = image
        ? `${userText}\n\nОпредели, что на фото. Вытащи даты, суммы, контакты, объекты, задачи, товары и сразу обнови подходящие вкладки приложения.`
        : userText;
      const answer = await askBusinessAssistant(prompt, image);
      showAnswerGradually(answer);

      const actionResult = await applySuggestedTabActions(prompt);
      if (actionResult.error) setError(actionResult.error);
      else if (actionResult.appliedCount > 0) {
        updateMessages([...messagesRef.current, {
          ...createMessage('assistant', `Готово, я обновил записи: ${actionResult.appliedCount}`),
          actionHref: actionResult.href,
          actionLabel: actionResult.label,
        }]);
        saveChat(messagesRef.current);
      }

      setImageFile(null);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : 'Не получилось получить ответ.');
    } finally {
      setIsLoading(false);
    }
  }

  function openSavedChat(chat: SavedChat) {
    setActiveChatId(chat.id);
    updateMessages(chat.messages);
    setIsHistoryOpen(false);
  }

  function deleteSavedChat(chatId: string) {
    const nextChats = savedChats.filter((chat) => chat.id !== chatId);
    setSavedChats(nextChats);
    localStorage.setItem(historyKey, JSON.stringify(nextChats));
  }

  return (
    <main className="assistant-shell">
      <section className="assistant-panel">
        <div className="chat-title-row">
          <SectionHeader subtitle="ИИ может отвечать, анализировать фото и самостоятельно обновлять подходящие записи." title="Чат с ИИ" />
          <button className="chat-history-button" onClick={() => setIsHistoryOpen(true)} type="button">История</button>
        </div>
        <ChatWindow isLoading={isLoading} messages={messages}>
          <ChatInput
            imageName={imageFile?.name ?? ''}
            isLoading={isLoading}
            onChange={setInput}
            onImageChange={setImageFile}
            onSubmit={() => sendPrompt()}
            value={input}
          />
        </ChatWindow>
        <p className="ai-disclaimer">ИИ может ошибаться</p>

        {error && <p className="alert">{error}</p>}
        {!isSupabaseConfigured && <p className="alert">Сначала добавь Supabase URL и ключ в .env.</p>}

        <PromptQuickActions disabled={isLoading} onSelect={sendPrompt} />
        {isHistoryOpen && (
          <ChatHistoryPanel chats={savedChats} onClose={() => setIsHistoryOpen(false)} onDelete={deleteSavedChat} onOpen={openSavedChat} />
        )}
      </section>
    </main>
  );
}
