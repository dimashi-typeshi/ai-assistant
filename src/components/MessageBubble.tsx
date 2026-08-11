export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
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
        <p>{message.text}</p>
      </div>
    </article>
  );
}
