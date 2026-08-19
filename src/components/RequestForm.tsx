import { FormEvent, useState } from 'react';
import { requestLabelColors } from '../lib/requestImport';

type RequestFormProps = {
  disabled: boolean;
  onCreate: (title: string, deadlineAt: string | null, labelColor: string) => Promise<void>;
};

export function RequestForm({ disabled, onCreate }: RequestFormProps) {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');
  const [labelColor, setLabelColor] = useState(requestLabelColors[0]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    await onCreate(title.trim(), deadline ? new Date(deadline).toISOString() : null, labelColor);
    setTitle('');
    setDeadline('');
  }

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <input
        className="request-title-input"
        disabled={disabled}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Название заявки"
        value={title}
      />
      <input disabled={disabled} onChange={(event) => setDeadline(event.target.value)} type="datetime-local" value={deadline} />
      <div className="color-picker" aria-label="Цвет заявки">
        {requestLabelColors.map((color) => (
          <button
            className={labelColor === color ? 'color-dot color-dot--active' : 'color-dot'}
            disabled={disabled}
            key={color}
            onClick={() => setLabelColor(color)}
            style={{ backgroundColor: color }}
            type="button"
          />
        ))}
      </div>
      <button disabled={disabled || !title.trim()} type="submit">Создать</button>
    </form>
  );
}
