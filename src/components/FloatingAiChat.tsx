import { FormEvent, MouseEvent, PointerEvent, useRef, useState } from 'react';
import { useLocation } from 'wouter';
import { askBusinessAssistant } from '../lib/ai';

type MiniMessage = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
};

const startPosition = { x: 18, y: 86 };

export function FloatingAiChat() {
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<MiniMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(startPosition);
  const dragRef = useRef({ dx: 0, dy: 0, active: false });

  if (location === '/chat') return null;

  function startDrag(event: PointerEvent<HTMLElement>) {
    dragRef.current = {
      active: true,
      dx: event.clientX - position.x,
      dy: event.clientY - position.y,
    };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveDialog(event: PointerEvent<HTMLElement>) {
    if (!dragRef.current.active) return;
    const nextX = Math.max(8, Math.min(window.innerWidth - 280, event.clientX - dragRef.current.dx));
    const nextY = Math.max(8, Math.min(window.innerHeight - 220, event.clientY - dragRef.current.dy));
    setPosition({ x: nextX, y: nextY });
  }

  function stopDrag() {
    dragRef.current.active = false;
  }

  function closeChat(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    setIsOpen(false);
  }

  async function send(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const prompt = input.trim();
    if (!prompt || isLoading) return;

    setInput('');
    setIsLoading(true);
    setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'user', text: prompt }]);

    try {
      const answer = await askBusinessAssistant(prompt);
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'assistant', text: answer }]);
    } catch (caughtError) {
      const text = caughtError instanceof Error ? caughtError.message : 'Не получилось получить ответ.';
      setMessages((current) => [...current, { id: crypto.randomUUID(), role: 'assistant', text }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button className="floating-ai-button" aria-label="Открыть мини-чат ИИ" onClick={() => setIsOpen(true)} type="button">
        <span />
      </button>

      {isOpen && (
        <section className="floating-ai-window" style={{ left: position.x, top: position.y }}>
          <header
            className="floating-ai-window__header"
            onPointerCancel={stopDrag}
            onPointerDown={startDrag}
            onPointerMove={moveDialog}
            onPointerUp={stopDrag}
          >
            <strong>ИИ помощник</strong>
            <button
              aria-label="Закрыть мини-чат"
              onClick={closeChat}
              onPointerDown={(event) => event.stopPropagation()}
              type="button"
            >
              ×
            </button>
          </header>
          <div className="floating-ai-window__messages">
            {messages.length === 0 && <p>Спроси коротко, я помогу не уходя со страницы.</p>}
            {messages.map((message) => (
              <article className={`floating-ai-message floating-ai-message--${message.role}`} key={message.id}>
                {message.text}
              </article>
            ))}
            {isLoading && <article className="floating-ai-message floating-ai-message--assistant">Думаю...</article>}
          </div>
          <form className="floating-ai-window__form" onSubmit={send}>
            <input onChange={(event) => setInput(event.target.value)} placeholder="Сообщение" value={input} />
            <button aria-label="Отправить" disabled={isLoading || !input.trim()} type="submit">›</button>
          </form>
        </section>
      )}
    </>
  );
}
