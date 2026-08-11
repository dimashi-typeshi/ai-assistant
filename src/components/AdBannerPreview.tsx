import { downloadBannerPng } from '../lib/banner';

type AdBannerPreviewProps = {
  fileName: string;
  svg: string;
  title: string;
  onResetImage: () => void;
};

export function AdBannerPreview({ fileName, svg, title, onResetImage }: AdBannerPreviewProps) {
  const previewUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

  async function share() {
    if (!navigator.share) return;
    await navigator.share({
      title,
      text: 'Готовый рекламный макет',
      url: window.location.href,
    });
  }

  return (
    <section className="ad-preview">
      <h2>{title}</h2>
      <div className="ad-preview__frame">
        <img alt={title} src={previewUrl} />
      </div>
      <div className="ad-actions">
        <button onClick={() => void downloadBannerPng(svg, fileName)} type="button">Скачать PNG</button>
        <button onClick={() => void share()} type="button">Поделиться</button>
        <button onClick={onResetImage} type="button">Убрать фото</button>
      </div>
    </section>
  );
}
