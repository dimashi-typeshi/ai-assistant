import { ChatMessage } from './MessageBubble';

export type SavedChat = {
  id: string;
  title: string;
  updatedAt: string;
  messages: ChatMessage[];
};

type ChatHistoryPanelProps = {
  chats: SavedChat[];
  onClose: () => void;
  onOpen: (chat: SavedChat) => void;
  onDelete: (chatId: string) => void;
};

export function ChatHistoryPanel({ chats, onClose, onDelete, onOpen }: ChatHistoryPanelProps) {
  return (
    <div className="chat-history-backdrop" role="presentation">
      <section className="chat-history-panel" role="dialog" aria-modal="true" aria-labelledby="chat-history-title">
        <header>
          <h2 id="chat-history-title">История</h2>
          <button aria-label="Закрыть историю" onClick={onClose} type="button">×</button>
        </header>
        <div className="chat-history-list">
          {chats.length === 0 && <p>Пока нет сохранённых переписок.</p>}
          {chats.map((chat) => (
            <article className="chat-history-item" key={chat.id}>
              <button onClick={() => onOpen(chat)} type="button">
                <strong>{chat.title}</strong>
                <span>{new Date(chat.updatedAt).toLocaleString('ru-RU')}</span>
              </button>
              <button aria-label="Удалить переписку" onClick={() => onDelete(chat.id)} type="button">×</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
