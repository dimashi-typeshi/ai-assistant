import { FormEvent, useState } from 'react';

type RequestFormProps = {
  disabled: boolean;
  onCreate: (title: string, deadlineAt: string | null) => Promise<void>;
};

export function RequestForm({ disabled, onCreate }: RequestFormProps) {
  const [title, setTitle] = useState('');
  const [deadline, setDeadline] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!title.trim()) return;
    await onCreate(title.trim(), deadline ? new Date(deadline).toISOString() : null);
    setTitle('');
    setDeadline('');
  }

  return (
    <form className="request-form" onSubmit={handleSubmit}>
      <input
        disabled={disabled}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Название заявки"
        value={title}
      />
      <input disabled={disabled} onChange={(event) => setDeadline(event.target.value)} type="datetime-local" value={deadline} />
      <button disabled={disabled || !title.trim()} type="submit">
        Создать
      </button>
    </form>
  );
}
