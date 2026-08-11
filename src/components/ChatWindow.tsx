import { ChatMessage, MessageBubble } from './MessageBubble';

type ChatWindowProps = {
  messages: ChatMessage[];
  isLoading: boolean;
};

export function ChatWindow({ messages, isLoading }: ChatWindowProps) {
  return (
    <section className="chat-window" aria-label="История чата">
      {messages.length === 0 ? (
        <div className="chat-empty">
          <span className="ai-avatar ai-avatar--large" aria-hidden="true">
            <span />
          </span>
          <h2>Чем помочь сегодня?</h2>
          <p>Напиши задачу или выбери готовый сценарий ниже.</p>
        </div>
      ) : (
        messages.map((message) => <MessageBubble key={message.id} message={message} />)
      )}

      {isLoading && (
        <article className="message-bubble message-bubble--assistant">
          <span className="ai-avatar" aria-hidden="true">
            <span />
          </span>
          <div className="message-content">
            <span>AI</span>
            <p>Думаю над ответом...</p>
          </div>
        </article>
      )}
    </section>
  );
}
