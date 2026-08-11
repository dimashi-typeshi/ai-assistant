import { downloadBannerPng } from '../lib/banner';

type AdBannerPreviewProps = {
  svg: string;
  onResetImage: () => void;
};

export function AdBannerPreview({ svg, onResetImage }: AdBannerPreviewProps) {
  const previewUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  async function share() {
    if (!navigator.share) return;
    await navigator.share({
      title: 'Рекламный баннер',
      text: 'Готовый баннер для Instagram',
      url: window.location.href,
    });
  }

  return (
    <section className="ad-preview">
      <div className="ad-preview__frame">
        <img alt="Превью рекламного баннера" src={previewUrl} />
      </div>
      <div className="ad-actions">
        <button onClick={() => void downloadBannerPng(svg)} type="button">Скачать PNG</button>
        <button onClick={() => void share()} type="button">Поделиться</button>
        <button onClick={onResetImage} type="button">Убрать фото</button>
      </div>
    </section>
  );
}
