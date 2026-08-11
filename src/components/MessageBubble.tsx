export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

type MessageBubbleProps = {
  message: ChatMessage;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const label = message.role === 'user' ? 'Вы' : 'Ассистент';

  return (
    <article className={`message-bubble message-bubble--${message.role}`}>
      <span>{label}</span>
      <p>{message.text}</p>
    </article>
  );
}
