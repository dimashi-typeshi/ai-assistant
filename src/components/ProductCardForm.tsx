import { ChangeEvent } from 'react';
import { ProductCardData } from '../lib/banner';

type ProductCardFormProps = {
  data: ProductCardData;
  onChange: (data: ProductCardData) => void;
};

export function ProductCardForm({ data, onChange }: ProductCardFormProps) {
  function update(field: keyof ProductCardData, value: string) {
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
      <label>Название товара<input onChange={(event) => update('title', event.target.value)} placeholder="Смарт-часы Nova Fit Pro" value={data.title} /></label>
      <label>Краткое описание<textarea onChange={(event) => update('description', event.target.value)} placeholder="AMOLED экран, влагозащита, до 10 дней работы" rows={4} value={data.description} /></label>
      <label>Цена<input onChange={(event) => update('price', event.target.value)} placeholder="19 990 ₸" value={data.price} /></label>
      <label>Старая цена<input onChange={(event) => update('oldPrice', event.target.value)} placeholder="29 990 ₸" value={data.oldPrice} /></label>
      <div className="ad-form__row">
        <label>Рейтинг<input onChange={(event) => update('rating', event.target.value)} placeholder="4.9" value={data.rating} /></label>
        <label>Отзывы<input onChange={(event) => update('reviews', event.target.value)} placeholder="128 отзывов" value={data.reviews} /></label>
      </div>
      <label>Фото товара<input accept="image/*" onChange={uploadImage} type="file" /></label>
    </form>
  );
}
