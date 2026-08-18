import { ChangeEvent, ClipboardEvent, useState } from 'react';
import { UploadedPhoto, uploadSectionPhoto } from '../lib/photos';
import { friendlyError } from '../lib/uiMessages';

type PhotoUploadProps = {
  disabled?: boolean;
  section: string;
  title?: string;
};

export function PhotoUpload({ disabled = false, section, title = 'Фото' }: PhotoUploadProps) {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  async function uploadPhoto(file: File) {
    if (!file) return;

    setIsUploading(true);
    setError('');
    try {
      const uploaded = await uploadSectionPhoto(file, section);
      setPhotos((current) => [uploaded, ...current]);
    } catch (caughtError) {
      setError(caughtError instanceof Error ? friendlyError(caughtError.message) : 'Не получилось загрузить фото. Попробуй выбрать файл ещё раз.');
    } finally {
      setIsUploading(false);
    }
  }

  async function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      await uploadPhoto(file);
      event.target.value = '';
    }
  }

  async function handlePaste(event: ClipboardEvent<HTMLElement>) {
    const file = Array.from(event.clipboardData.files).find((item) => item.type.startsWith('image/'));
    if (!file) return;

    event.preventDefault();
    await uploadPhoto(file);
  }

  return (
    <section className="photo-upload" onPaste={handlePaste} tabIndex={0}>
      <div>
        <strong>{title}</strong>
        <span>{isUploading ? 'Загрузка...' : 'Загрузите фото или вставьте его через Ctrl+V'}</span>
      </div>
      <label>
        <input accept="image/*" disabled={disabled || isUploading} onChange={handleChange} type="file" />
        Добавить фото
      </label>
      {error && <p className="photo-upload__error">{error}</p>}
      {photos.length > 0 && (
        <div className="photo-upload__grid">
          {photos.map((photo) => (
            <a href={photo.url} key={photo.path} rel="noreferrer" target="_blank">
              <img alt={photo.name} src={photo.url} />
            </a>
          ))}
        </div>
      )}
    </section>
  );
}
