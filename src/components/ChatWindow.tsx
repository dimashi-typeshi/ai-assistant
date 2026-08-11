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
          <h2>Чем помочь бизнесу сегодня?</h2>
          <p>Напиши задачу или выбери готовый сценарий ниже.</p>
        </div>
      ) : (
        messages.map((message) => <MessageBubble key={message.id} message={message} />)
      )}

      {isLoading && (
        <article className="message-bubble message-bubble--assistant">
          <span>Ассистент</span>
          <p>Думаю над ответом...</p>
        </article>
      )}
    </section>
  );
}
