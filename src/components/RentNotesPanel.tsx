import { EmptyState } from './EmptyState';
import { PhotoUpload } from './PhotoUpload';
import { RentNoteForm } from './RentNoteForm';
import { formatRentDate, RentNote } from '../lib/rent';

type RentNotesPanelProps = {
  disabled: boolean;
  notes: RentNote[];
  onCreate: (objectName: string, text: string) => Promise<void>;
};

export function RentNotesPanel({ disabled, notes, onCreate }: RentNotesPanelProps) {
  return (
    <>
      <PhotoUpload disabled={disabled} section="rent-notes" title="Фото по объектам" />
      <RentNoteForm disabled={disabled} onCreate={onCreate} />
      {notes.length === 0 ? (
        <EmptyState icon="ID" text="Сохраните важную деталь по объекту: ремонт, условия, контакт или договорённость." title="Заметок пока нет" />
      ) : (
        <div className="rent-note-list">
          {notes.map((note) => (
            <article className="rent-note-card" key={note.id}>
              <span className="rent-note-card__marker" />
              <div>
                <h2>{note.objectName}</h2>
                <p>{note.text}</p>
                <small>{formatRentDate(note.createdAt)}</small>
              </div>
            </article>
          ))}
        </div>
      )}
    </>
  );
}
