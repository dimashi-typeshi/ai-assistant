import { useMemo, useState } from 'react';
import { AdBannerForm } from '../components/AdBannerForm';
import { AdBannerPreview } from '../components/AdBannerPreview';
import { AdType, AdTypePicker } from '../components/AdTypePicker';
import { DemoActions } from '../components/DemoActions';
import { ProductCardForm } from '../components/ProductCardForm';
import { SectionHeader } from '../components/SectionHeader';
import { BannerData, ProductCardData, createBannerSvg, createProductCardSvg } from '../lib/banner';

const initialBanner: BannerData = { title: '', description: '', offer: '', contact: '', imageUrl: '' };
const initialProduct: ProductCardData = {
  title: '',
  description: '',
  price: '',
  oldPrice: '',
  rating: '',
  reviews: '',
  imageUrl: '',
};

const demoBanner: BannerData = {
  contact: '+7 777 000 00 00',
  description: 'Уютная студия рядом с метро, свежий ремонт и быстрый заезд.',
  imageUrl: '',
  offer: 'от 250 000 ₸',
  title: 'Аренда квартиры у моря',
};

const demoProduct: ProductCardData = {
  description: 'AMOLED экран, защита от воды, до 10 дней работы.',
  imageUrl: '',
  oldPrice: '29 990 ₸',
  price: '19 990 ₸',
  rating: '4.9',
  reviews: '128 отзывов',
  title: 'Смарт-часы Nova Fit Pro',
};

export function AdsPage() {
  const [type, setType] = useState<AdType | ''>('');
  const [banner, setBanner] = useState<BannerData>(initialBanner);
  const [product, setProduct] = useState<ProductCardData>(initialProduct);
  const bannerSvg = useMemo(() => createBannerSvg(banner), [banner]);
  const productSvg = useMemo(() => createProductCardSvg(product), [product]);

  function seedDemo() {
    setType('instagram');
    setBanner(demoBanner);
    setProduct(demoProduct);
  }

  function clearDemo() {
    setBanner(initialBanner);
    setProduct(initialProduct);
  }

  return (
    <main className="mobile-app-shell">
      <section className="section-page ads-page">
        <SectionHeader subtitle="Выбери формат, заполни данные и скачай готовый макет." title="Создать рекламу" />
        <DemoActions onClear={clearDemo} onSeed={seedDemo} />
        <AdTypePicker value={type} onChange={setType} />

        {type === 'instagram' && (
          <>
            <AdBannerForm data={banner} onChange={setBanner} />
            <AdBannerPreview
              fileName="instagram-banner.png"
              svg={bannerSvg}
              title="Баннер Instagram 1080x1080"
              onResetImage={() => setBanner((current) => ({ ...current, imageUrl: '' }))}
            />
          </>
        )}

        {type === 'product' && (
          <>
            <ProductCardForm data={product} onChange={setProduct} />
            <AdBannerPreview
              fileName="marketplace-product-card.png"
              svg={productSvg}
              title="Карточка товара 1080x1080"
              onResetImage={() => setProduct((current) => ({ ...current, imageUrl: '' }))}
            />
          </>
        )}
      </section>
    </main>
  );
}
