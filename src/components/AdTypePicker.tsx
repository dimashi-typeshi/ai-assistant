export type AdType = 'instagram' | 'product';

type AdTypePickerProps = {
  value: AdType | '';
  onChange: (type: AdType) => void;
};

const options = [
  { type: 'instagram' as const, title: 'Баннер (Instagram)', text: 'Квадратный пост 1080x1080 с фото, оффером и контактами.' },
  { type: 'product' as const, title: 'Карточка товара', text: 'Маркетплейс-вид: фото, цена, скидка, рейтинг и кнопка покупки.' },
];

export function AdTypePicker({ value, onChange }: AdTypePickerProps) {
  return (
    <section className="ad-type-grid">
      {options.map((option) => (
        <button
          className={value === option.type ? 'ad-type-card ad-type-card--active' : 'ad-type-card'}
          key={option.type}
          onClick={() => onChange(option.type)}
          type="button"
        >
          <span>{option.type === 'instagram' ? 'IG' : 'MP'}</span>
          <strong>{option.title}</strong>
          <p>{option.text}</p>
        </button>
      ))}
    </section>
  );
}
