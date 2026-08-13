import { ChangeEvent, ClipboardEvent, FormEvent } from 'react';

type ChatInputProps = {
  value: string;
  imageName: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onImageChange: (file: File | null) => void;
  onSubmit: () => void;
};

export function ChatInput({ value, imageName, isLoading, onChange, onImageChange, onSubmit }: ChatInputProps) {
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onSubmit();
  }

  function handleImageChange(event: ChangeEvent<HTMLInputElement>) {
    onImageChange(event.target.files?.[0] ?? null);
  }

  function handlePaste(event: ClipboardEvent<HTMLFormElement>) {
    const file = Array.from(event.clipboardData.files).find((item) => item.type.startsWith('image/'));
    if (!file) return;

    event.preventDefault();
    onImageChange(file);
  }

  return (
    <form className="chat-input" onPaste={handlePaste} onSubmit={handleSubmit}>
      <div className="chat-input__body">
        <textarea
          aria-label="Задача для AI-ассистента"
          disabled={isLoading}
          onChange={(event) => onChange(event.target.value)}
          placeholder="Например: ответь в роли администратора, дай совет по данным или проанализируй фото"
          rows={2}
          value={value}
        />
        <label className="chat-photo-button" aria-label="Добавить фото">
          <input accept="image/*" disabled={isLoading} onChange={handleImageChange} type="file" />
          <svg aria-hidden="true" viewBox="0 0 24 24">
            <path d="M8 7 9.4 5h5.2L16 7h2.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-7A2.5 2.5 0 0 1 5.5 7H8Z" />
            <circle cx="12" cy="13" r="3.2" />
          </svg>
        </label>
        {imageName && (
          <span className="chat-image-name">
            {imageName}
            <button aria-label="Убрать фото" onClick={() => onImageChange(null)} type="button">×</button>
          </span>
        )}
      </div>
      <button aria-label="Отправить" disabled={isLoading || (!value.trim() && !imageName)} type="submit">
        <svg aria-hidden="true" viewBox="0 0 24 24">
          <path d="M5 12h13" />
          <path d="m13 6 6 6-6 6" />
        </svg>
      </button>
    </form>
  );
}
