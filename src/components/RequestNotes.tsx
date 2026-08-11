import { FormEvent, useEffect, useState } from 'react';
import { RequestNote, createNote, deleteNote, loadNotes, updateNote } from '../lib/requests';

export function RequestNotes({ requestId }: { requestId: string }) {
  const [notes, setNotes] = useState<RequestNote[]>([]);
  const [text, setText] = useState('');
  const [editingId, setEditingId] = useState('');
  const [error, setError] = useState('');

  async function refresh() {
    const { data, error } = await loadNotes(requestId);
    if (error) setError(error.message);
    else setNotes((data ?? []) as RequestNote[]);
  }

  useEffect(() => {
    void refresh();
  }, [requestId]);

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!text.trim()) return;
    const result = editingId ? await updateNote(editingId, text.trim()) : await createNote(requestId, text.trim());
    if (result.error) setError(result.error.message);
    else {
      setText('');
      setEditingId('');
      await refresh();
    }
  }

  return (
    <div className="request-notes">
      <form className="note-form" onSubmit={save}>
        <textarea onChange={(event) => setText(event.target.value)} placeholder="Добавить запись" rows={2} value={text} />
        <button disabled={!text.trim()} type="submit">{editingId ? 'Сохранить' : 'Добавить'}</button>
      </form>
      {error && <p className="alert">{error}</p>}
      {notes.map((note) => (
        <article className="note-card" key={note.id}>
          <p>{note.text}</p>
          <div>
            <button onClick={() => { setEditingId(note.id); setText(note.text); }} type="button">Редактировать</button>
            <button onClick={() => void deleteNote(note.id).then(refresh)} type="button">Удалить</button>
          </div>
        </article>
      ))}
    </div>
  );
}
