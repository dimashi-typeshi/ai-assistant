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
          placeholder="Например: проанализируй фото. Можно вставить картинку через Ctrl+V"
          rows={3}
          value={value}
        />
        <label className="chat-photo-button">
          <input accept="image/*" disabled={isLoading} onChange={handleImageChange} type="file" />
          Фото
        </label>
        {imageName && <span className="chat-image-name">{imageName}</span>}
      </div>
      <button disabled={isLoading || (!value.trim() && !imageName)} type="submit">
        {isLoading ? 'Ждём ответ' : 'Отправить'}
      </button>
    </form>
  );
}
