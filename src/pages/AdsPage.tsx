import { useMemo, useState } from 'react';
import { AdBannerForm } from '../components/AdBannerForm';
import { AdBannerPreview } from '../components/AdBannerPreview';
import { SectionHeader } from '../components/SectionHeader';
import { BannerData, createBannerSvg } from '../lib/banner';

const initialBanner: BannerData = {
  title: '',
  description: '',
  offer: '',
  contact: '',
  imageUrl: '',
};

export function AdsPage() {
  const [banner, setBanner] = useState<BannerData>(initialBanner);
  const svg = useMemo(() => createBannerSvg(banner), [banner]);

  return (
    <main className="mobile-app-shell">
      <section className="section-page ads-page">
        <SectionHeader subtitle="Заполни данные, посмотри превью и скачай баннер 1080x1080 для Instagram." title="Создать рекламу" />
        <AdBannerForm data={banner} onChange={setBanner} />
        <AdBannerPreview svg={svg} onResetImage={() => setBanner((current) => ({ ...current, imageUrl: '' }))} />
      </section>
    </main>
  );
}
