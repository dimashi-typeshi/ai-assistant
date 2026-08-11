import { ChangeEvent } from 'react';
import { ProfileData } from '../lib/profile';

type ProfileHeaderProps = {
  email: string;
  profile: ProfileData;
  onAvatarChange: (avatarUrl: string) => void;
};

function initials(name: string, email: string) {
  const source = name.trim() || email;
  return source.slice(0, 2).toUpperCase();
}

export function ProfileHeader({ email, profile, onAvatarChange }: ProfileHeaderProps) {
  function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onAvatarChange(String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <section className="profile-hero">
      <label className="avatar-control">
        {profile.avatarUrl ? <img alt="Аватар пользователя" src={profile.avatarUrl} /> : <span>{initials(profile.name, email)}</span>}
        <input accept="image/*" onChange={uploadAvatar} type="file" />
      </label>
      <div>
        <h2>{profile.name || 'Новый профиль'}</h2>
        <p>{email}</p>
      </div>
    </section>
  );
}
