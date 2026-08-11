import { useMemo, useState } from 'react';
import { AdBannerForm } from '../components/AdBannerForm';
import { AdBannerPreview } from '../components/AdBannerPreview';
import { AdType, AdTypePicker } from '../components/AdTypePicker';
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

export function AdsPage() {
  const [type, setType] = useState<AdType | ''>('');
  const [banner, setBanner] = useState<BannerData>(initialBanner);
  const [product, setProduct] = useState<ProductCardData>(initialProduct);
  const bannerSvg = useMemo(() => createBannerSvg(banner), [banner]);
  const productSvg = useMemo(() => createProductCardSvg(product), [product]);

  return (
    <main className="mobile-app-shell">
      <section className="section-page ads-page">
        <SectionHeader subtitle="Выбери формат, заполни данные и скачай готовый макет." title="Создать рекламу" />
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
