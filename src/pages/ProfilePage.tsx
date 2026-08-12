import { useEffect, useState } from 'react';
import { useLocation } from 'wouter';
import { Auth } from '../components/Auth';
import { ProfileActions } from '../components/ProfileActions';
import { ProfileEditor } from '../components/ProfileEditor';
import { ProfileHeader } from '../components/ProfileHeader';
import { SectionHeader } from '../components/SectionHeader';
import { ProfileData, loadProfile, sendPasswordReset, signOut, updateEmail, updateProfile } from '../lib/profile';
import { isSupabaseConfigured } from '../lib/supabase';

const emptyProfile: ProfileData = { name: '', phone: '', avatarUrl: '' };

export function ProfilePage() {
  const [, navigate] = useLocation();
  const [profile, setProfile] = useState<ProfileData>(emptyProfile);
  const [savedEmail, setSavedEmail] = useState('');
  const [email, setEmail] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [message, setMessage] = useState('');

  async function refresh() {
    const { data } = await loadProfile();
    const user = data.user;
    if (!user) {
      setSavedEmail('');
      setEmail('');
      setProfile(emptyProfile);
      setIsReady(true);
      return;
    }
    const metadata = user.user_metadata;
    setSavedEmail(user.email ?? '');
    setEmail(user.email ?? '');
    setProfile({
      avatarUrl: typeof metadata.avatar_url === 'string' ? metadata.avatar_url : '',
      name: typeof metadata.full_name === 'string' ? metadata.full_name : '',
      phone: typeof metadata.phone === 'string' ? metadata.phone : '',
    });
    setIsReady(true);
  }

  useEffect(() => {
    if (isSupabaseConfigured) void refresh();
  }, []);

  async function save() {
    setMessage('');
    const profileResult = await updateProfile(profile);
    if (profileResult.error) {
      setMessage(profileResult.error.message);
      return;
    }
    if (email !== savedEmail) {
      const emailResult = await updateEmail(email);
      if (emailResult.error) setMessage(emailResult.error.message);
      else setMessage('Проверь почту: Supabase отправил письмо для подтверждения нового email.');
    } else {
      setMessage('Профиль сохранён.');
    }
    setIsEditing(false);
    await refresh();
  }

  async function resetPassword() {
    const result = await sendPasswordReset(savedEmail);
    setMessage(result.error ? result.error.message : 'Письмо для смены пароля отправлено.');
  }

  async function leave() {
    await signOut();
    setSavedEmail('');
    setEmail('');
    setProfile(emptyProfile);
    setIsEditing(false);
    setMessage('');
    navigate('/profile');
  }

  return (
    <main className="mobile-app-shell">
      <section className="section-page profile-page">
        <SectionHeader subtitle="Минималистичный профиль с аватаром, данными аккаунта и действиями." title="Профиль" />
        {!isSupabaseConfigured && <p className="alert">Добавь Supabase URL и ключ в .env.</p>}
        {isSupabaseConfigured && isReady && !savedEmail && <Auth onAuthenticated={refresh} />}
        {savedEmail && (
          <>
            <ProfileHeader email={savedEmail} profile={profile} onAvatarChange={(avatarUrl) => setProfile({ ...profile, avatarUrl })} />
            <ProfileEditor
              email={email}
              isEditing={isEditing}
              onCancel={() => { setEmail(savedEmail); setIsEditing(false); }}
              onChangeEmail={setEmail}
              onChangeProfile={setProfile}
              onSave={save}
              profile={profile}
            />
            {message && <p className="profile-message">{message}</p>}
            <ProfileActions isEditing={isEditing} onEdit={() => setIsEditing(true)} onResetPassword={resetPassword} onSignOut={leave} />
          </>
        )}
      </section>
    </main>
  );
}
