import { FormEvent, useState } from 'react';
import { ImportedRequestDraft, parseTelegramRequest, requestLabelColors } from '../lib/requestImport';

type TelegramImportFormProps = {
  disabled: boolean;
  onCreate: (title: string, deadlineAt: string | null, labelColor: string, details: string) => Promise<void>;
};

const emptyDraft: ImportedRequestDraft = { title: '', deadline: '', details: '', labelColor: requestLabelColors[0] };

export function TelegramImportForm({ disabled, onCreate }: TelegramImportFormProps) {
  const [text, setText] = useState('');
  const [draft, setDraft] = useState<ImportedRequestDraft>(emptyDraft);

  function parse() {
    setDraft(parseTelegramRequest(text));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!draft.title.trim()) return;
    await onCreate(
      draft.title.trim(),
      draft.deadline ? new Date(draft.deadline).toISOString() : null,
      draft.labelColor,
      draft.details,
    );
    setText('');
    setDraft(emptyDraft);
  }

  return (
    <section className="telegram-import">
      <h2>Импорт из Telegram</h2>
      <textarea
        disabled={disabled}
        onChange={(event) => setText(event.target.value)}
        placeholder={'Вставь сообщение из Telegram. Например:\nЗаявка: дизайн баннера\nДедлайн: 25.08 14:30\nНужно подготовить 3 варианта'}
        rows={5}
        value={text}
      />
      <button disabled={disabled || !text.trim()} onClick={parse} type="button">Распознать</button>
      {draft.title && (
        <form className="import-draft" onSubmit={submit}>
          <input onChange={(event) => setDraft({ ...draft, title: event.target.value })} value={draft.title} />
          <input onChange={(event) => setDraft({ ...draft, deadline: event.target.value })} type="datetime-local" value={draft.deadline} />
          <div className="color-picker">
            {requestLabelColors.map((color) => (
              <button
                className={draft.labelColor === color ? 'color-dot color-dot--active' : 'color-dot'}
                key={color}
                onClick={() => setDraft({ ...draft, labelColor: color })}
                style={{ backgroundColor: color }}
                type="button"
              />
            ))}
          </div>
          <button disabled={disabled || !draft.title.trim()} type="submit">Добавить в календарь</button>
        </form>
      )}
    </section>
  );
}
