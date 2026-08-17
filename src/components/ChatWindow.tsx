import { ChatMessage, MessageBubble } from './MessageBubble';
import { EmptyState } from './EmptyState';
import type { ReactNode } from 'react';

type ChatWindowProps = {
  messages: ChatMessage[];
  isLoading: boolean;
  children?: ReactNode;
};

export function ChatWindow({ children, messages, isLoading }: ChatWindowProps) {
  return (
    <section className="chat-window" aria-label="История чата">
      {messages.length === 0 ? (
        <EmptyState
          icon="AI"
          text="Опишите задачу обычными словами или выберите готовый сценарий ниже. ИИ поможет разложить хаос по полкам."
          title="С чего начнём?"
        />
      ) : (
        messages.map((message) => <MessageBubble key={message.id} message={message} />)
      )}

      {isLoading && (
        <article className="message-bubble message-bubble--assistant">
          <span className="thinking-loader" aria-hidden="true" />
          <div className="message-content">
            <span>AI</span>
            <p className="thinking-text">Думаю</p>
          </div>
        </article>
      )}
      {children}
    </section>
  );
}
