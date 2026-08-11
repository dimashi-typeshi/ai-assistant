import { FormEvent } from 'react';

type ChatInputProps = {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onSubmit: () => void;
};

export function ChatInput({ value, isLoading, onChange, onSubmit }: ChatInputProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <textarea
        aria-label="Задача для AI-ассистента"
        disabled={isLoading}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Например: придумай 5 идей постов для кофейни на эту неделю"
        rows={3}
        value={value}
      />
      <button disabled={isLoading || !value.trim()} type="submit">
        {isLoading ? 'Ждём ответ' : 'Отправить'}
      </button>
    </form>
  );
}
