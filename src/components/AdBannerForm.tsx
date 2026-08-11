import { ChangeEvent } from 'react';
import { BannerData } from '../lib/banner';

type AdBannerFormProps = {
  data: BannerData;
  onChange: (data: BannerData) => void;
};

export function AdBannerForm({ data, onChange }: AdBannerFormProps) {
  function update(field: keyof BannerData, value: string) {
    onChange({ ...data, [field]: value });
  }

  function uploadImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update('imageUrl', String(reader.result));
    reader.readAsDataURL(file);
  }

  return (
    <form className="ad-form">
      <label>Заголовок<input onChange={(event) => update('title', event.target.value)} placeholder="Аренда квартиры у моря" value={data.title} /></label>
      <label>Описание<textarea onChange={(event) => update('description', event.target.value)} placeholder="2 комнаты, свежий ремонт, рядом парк и магазины" rows={4} value={data.description} /></label>
      <label>Цена или предложение<input onChange={(event) => update('offer', event.target.value)} placeholder="от 250 000 ₸" value={data.offer} /></label>
      <label>Контакт или ссылка<input onChange={(event) => update('contact', event.target.value)} placeholder="+7 777 000 00 00" value={data.contact} /></label>
      <label>Фото или логотип<input accept="image/*" onChange={uploadImage} type="file" /></label>
    </form>
  );
}
