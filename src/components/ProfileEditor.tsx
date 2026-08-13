import { FormEvent } from 'react';
import { ProfileData } from '../lib/profile';

type PhoneCountry = {
  name: string;
  code: string;
  digits: number;
};

const phoneCountries: PhoneCountry[] = [
  { name: 'Казахстан', code: '+7', digits: 10 },
  { name: 'Кыргызстан', code: '+996', digits: 9 },
  { name: 'Узбекистан', code: '+998', digits: 9 },
  { name: 'США', code: '+1', digits: 10 },
];

type ProfileEditorProps = {
  email: string;
  profile: ProfileData;
  isEditing: boolean;
  onChangeEmail: (email: string) => void;
  onChangeProfile: (profile: ProfileData) => void;
  onCancel: () => void;
  onSave: () => Promise<void>;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

function getPhoneCountry(phone: string) {
  return phoneCountries.find((country) => phone.startsWith(country.code)) ?? phoneCountries[0];
}

function getLocalPhone(phone: string, country: PhoneCountry) {
  const codeDigits = onlyDigits(country.code);
  const phoneDigits = onlyDigits(phone);
  const localDigits = phoneDigits.startsWith(codeDigits) ? phoneDigits.slice(codeDigits.length) : phoneDigits;
  return localDigits.slice(0, country.digits);
}

function formatPhone(country: PhoneCountry, localDigits: string) {
  return `${country.code} ${localDigits}`.trim();
}

export function ProfileEditor({ email, profile, isEditing, onCancel, onChangeEmail, onChangeProfile, onSave }: ProfileEditorProps) {
  const selectedCountry = getPhoneCountry(profile.phone);
  const localPhone = getLocalPhone(profile.phone, selectedCountry);
  const phoneHelp = `${localPhone.length}/${selectedCountry.digits} цифр`;

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await onSave();
  }

  function changeCountry(countryCode: string) {
    const country = phoneCountries.find((item) => item.code === countryCode) ?? phoneCountries[0];
    onChangeProfile({ ...profile, phone: formatPhone(country, getLocalPhone(profile.phone, country)) });
  }

  function changePhone(value: string) {
    const localDigits = onlyDigits(value).slice(0, selectedCountry.digits);
    onChangeProfile({ ...profile, phone: formatPhone(selectedCountry, localDigits) });
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
      <label>
        Страна
        <select onChange={(event) => changeCountry(event.target.value)} value={selectedCountry.code}>
          {phoneCountries.map((country) => (
            <option key={country.code} value={country.code}>{country.name} {country.code}</option>
          ))}
        </select>
      </label>
      <label>
        Телефон
        <span className="phone-input-row">
          <b>{selectedCountry.code}</b>
          <input
            inputMode="numeric"
            maxLength={selectedCountry.digits}
            onChange={(event) => changePhone(event.target.value)}
            placeholder={'0'.repeat(selectedCountry.digits)}
            value={localPhone}
          />
        </span>
        <small>{phoneHelp}</small>
      </label>
      <div className="profile-actions">
        <button disabled={localPhone.length > 0 && localPhone.length !== selectedCountry.digits} type="submit">Сохранить</button>
        <button onClick={onCancel} type="button">Отмена</button>
      </div>
    </form>
  );
}
