import { Link } from 'wouter';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  imageUrl?: string;
  actionHref?: string;
  actionLabel?: string;
};

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const label = message.role === 'user' ? 'Вы' : 'AI';

  return (
    <article className={`message-bubble message-bubble--${message.role}`}>
      {message.role === 'assistant' && (
        <span className="ai-avatar" aria-hidden="true">
          <span />
        </span>
      )}
      <div className="message-content">
        <span>{label}</span>
        {message.imageUrl && <img className="message-image" alt="Прикреплённое фото" src={message.imageUrl} />}
        <p>{message.text}</p>
        {message.actionHref && message.actionLabel && <Link className="message-action-link" href={message.actionHref}>{message.actionLabel}</Link>}
      </div>
    </article>
  );
}
