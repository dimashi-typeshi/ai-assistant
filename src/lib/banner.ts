export type BannerData = {
  title: string;
  description: string;
  offer: string;
  contact: string;
  imageUrl: string;
};

export type ProductCardData = {
  title: string;
  description: string;
  price: string;
  oldPrice: string;
  rating: string;
  reviews: string;
  imageUrl: string;
};

function escapeXml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function lines(value: string, maxLength: number, maxLines: number) {
  const words = value.trim().split(/\s+/);
  const result: string[] = [];

  for (const word of words) {
    const current = result.length > 0 ? result[result.length - 1] : '';
    if (!current || `${current} ${word}`.length > maxLength) result.push(word);
    else result[result.length - 1] = `${current} ${word}`;
    if (result.length === maxLines) break;
  }

  return result;
}

export function createBannerSvg(data: BannerData) {
  const title = lines(data.title || 'Название рекламы', 18, 3);
  const description = lines(data.description || 'Короткое описание предложения', 34, 4);
  const offer = data.offer || 'Специальное предложение';
  const contact = data.contact || '@contact или ссылка';

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a1a1a"/>
      <stop offset="100%" stop-color="#0d0d0d"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#4f8cff"/>
      <stop offset="100%" stop-color="#2f6fed"/>
    </linearGradient>
    <clipPath id="photoClip"><rect x="80" y="90" width="920" height="430" rx="42"/></clipPath>
  </defs>
  <rect width="1080" height="1080" fill="url(#bg)"/>
  <rect x="46" y="46" width="988" height="988" rx="56" fill="none" stroke="rgba(255,255,255,0.12)" stroke-width="2"/>
  ${data.imageUrl ? `<image href="${escapeXml(data.imageUrl)}" x="80" y="90" width="920" height="430" preserveAspectRatio="xMidYMid slice" clip-path="url(#photoClip)"/>` : `<rect x="80" y="90" width="920" height="430" rx="42" fill="#151515"/><text x="540" y="315" text-anchor="middle" fill="#71717a" font-size="36" font-family="Inter, Arial">Фото или логотип</text>`}
  <rect x="80" y="560" width="330" height="58" rx="29" fill="url(#accent)"/>
  <text x="245" y="599" text-anchor="middle" fill="#ffffff" font-size="28" font-weight="800" font-family="Inter, Arial">${escapeXml(offer)}</text>
  ${title.map((line, index) => `<text x="80" y="${700 + index * 76}" fill="#f4f4f5" font-size="68" font-weight="850" font-family="Inter, Arial">${escapeXml(line)}</text>`).join('')}
  ${description.map((line, index) => `<text x="84" y="${880 + index * 42}" fill="#a1a1aa" font-size="34" font-family="Inter, Arial">${escapeXml(line)}</text>`).join('')}
  <text x="80" y="1010" fill="#cfe0ff" font-size="32" font-weight="760" font-family="Inter, Arial">${escapeXml(contact)}</text>
</svg>`.trim();
}

export function createProductCardSvg(data: ProductCardData) {
  const title = lines(data.title || 'Название товара', 27, 3);
  const description = lines(data.description || 'Краткие характеристики товара', 34, 3);
  const price = data.price || '19 990 ₸';
  const rating = data.rating || '4.9';
  const reviews = data.reviews || '128 отзывов';

  return `
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1080" viewBox="0 0 1080 1080">
  <defs>
    <linearGradient id="page" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#161616"/>
      <stop offset="100%" stop-color="#0d0d0d"/>
    </linearGradient>
    <clipPath id="productClip"><rect x="96" y="96" width="888" height="520" rx="42"/></clipPath>
  </defs>
  <rect width="1080" height="1080" fill="url(#page)"/>
  <rect x="54" y="54" width="972" height="972" rx="54" fill="#f8f8f8"/>
  ${data.imageUrl ? `<image href="${escapeXml(data.imageUrl)}" x="96" y="96" width="888" height="520" preserveAspectRatio="xMidYMid slice" clip-path="url(#productClip)"/>` : `<rect x="96" y="96" width="888" height="520" rx="42" fill="#eeeeee"/><text x="540" y="370" text-anchor="middle" fill="#9a9a9a" font-size="36" font-family="Inter, Arial">Фото товара</text>`}
  <rect x="96" y="642" width="174" height="54" rx="27" fill="#ef4444"/>
  <text x="183" y="679" text-anchor="middle" fill="#ffffff" font-size="28" font-weight="850" font-family="Inter, Arial">Скидка</text>
  <text x="96" y="760" fill="#151515" font-size="54" font-weight="850" font-family="Inter, Arial">${escapeXml(price)}</text>
  ${data.oldPrice ? `<text x="96" y="808" fill="#8a8a8a" font-size="30" font-family="Inter, Arial" text-decoration="line-through">${escapeXml(data.oldPrice)}</text>` : ''}
  ${title.map((line, index) => `<text x="96" y="${858 + index * 42}" fill="#242424" font-size="34" font-weight="760" font-family="Inter, Arial">${escapeXml(line)}</text>`).join('')}
  ${description.map((line, index) => `<text x="96" y="${966 + index * 32}" fill="#737373" font-size="26" font-family="Inter, Arial">${escapeXml(line)}</text>`).join('')}
  <text x="790" y="680" fill="#f59e0b" font-size="34" font-weight="850" font-family="Inter, Arial">★ ${escapeXml(rating)}</text>
  <text x="790" y="724" fill="#737373" font-size="24" font-family="Inter, Arial">${escapeXml(reviews)}</text>
  <rect x="744" y="922" width="240" height="72" rx="22" fill="#7c3aed"/>
  <text x="864" y="968" text-anchor="middle" fill="#ffffff" font-size="30" font-weight="850" font-family="Inter, Arial">Купить</text>
</svg>`.trim();
}

export async function downloadBannerPng(svg: string, fileName = 'instagram-banner.png') {
  const image = new Image();
  const svgUrl = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  await new Promise<void>((resolve, reject) => {
    image.onload = () => resolve();
    image.onerror = reject;
    image.src = svgUrl;
  });
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  canvas.getContext('2d')?.drawImage(image, 0, 0);
  URL.revokeObjectURL(svgUrl);
  const link = document.createElement('a');
  link.download = fileName;
  link.href = canvas.toDataURL('image/png');
  link.click();
}
