import { FormEvent, useState } from 'react';

type RentNoteFormProps = {
  disabled: boolean;
  onCreate: (objectName: string, text: string) => Promise<void>;
};

export function RentNoteForm({ disabled, onCreate }: RentNoteFormProps) {
  const [objectName, setObjectName] = useState('');
  const [text, setText] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanObjectName = objectName.trim();
    const cleanText = text.trim();
    if (!cleanObjectName || !cleanText) return;

    await onCreate(cleanObjectName, cleanText);
    setObjectName('');
    setText('');
  }

  return (
    <form className="rent-form" onSubmit={handleSubmit}>
      <input
        disabled={disabled}
        onChange={(event) => setObjectName(event.target.value)}
        placeholder="Объект"
        value={objectName}
      />
      <textarea
        disabled={disabled}
        onChange={(event) => setText(event.target.value)}
        placeholder="Заметка по объекту"
        rows={4}
        value={text}
      />
      <button disabled={disabled || !objectName.trim() || !text.trim()} type="submit">
        Добавить заметку
      </button>
    </form>
  );
}
