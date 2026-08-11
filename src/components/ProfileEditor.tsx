import { FormEvent } from 'react';
import { ProfileData } from '../lib/profile';

type ProfileEditorProps = {
  email: string;
  profile: ProfileData;
  isEditing: boolean;
  onChangeEmail: (email: string) => void;
  onChangeProfile: (profile: ProfileData) => void;
  onCancel: () => void;
  onSave: () => Promise<void>;
};

export function ProfileEditor({ email, profile, isEditing, onCancel, onChangeEmail, onChangeProfile, onSave }: ProfileEditorProps) {
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSave();
  }

  if (!isEditing) {
    return (
      <section className="profile-card">
        <p><span>Имя</span>{profile.name || 'Не указано'}</p>
        <p><span>Email</span>{email}</p>
        <p><span>Телефон</span>{profile.phone || 'Не указан'}</p>
      </section>
    );
  }

  return (
    <form className="profile-form" onSubmit={submit}>
      <label>Имя<input onChange={(event) => onChangeProfile({ ...profile, name: event.target.value })} value={profile.name} /></label>
      <label>Email<input onChange={(event) => onChangeEmail(event.target.value)} type="email" value={email} /></label>
      <label>Телефон<input onChange={(event) => onChangeProfile({ ...profile, phone: event.target.value })} value={profile.phone} /></label>
      <div className="profile-actions">
        <button type="submit">Сохранить</button>
        <button onClick={onCancel} type="button">Отмена</button>
      </div>
    </form>
  );
}
