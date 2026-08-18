import { AiImageInput } from './ai';
import { invokeAi } from './aiFunction';

export type BedLevel = {
  state: 'free' | 'busy';
  price: string;
};

export type SeatMarker = {
  id: string;
  label: string;
  price: string;
  kind: 'bed' | 'bunk';
  top: BedLevel;
  bottom: BedLevel;
  x: number;
  y: number;
  state: 'free' | 'busy';
};

export type SeatSchemeDesign = {
  accent: string;
  summary: string;
  freeRows: number[];
  busyRows: number[];
  markers: SeatMarker[];
};

type SeatSchemeResponse = {
  text?: string;
  error?: string;
  accent?: string;
  summary?: string;
  freeRows?: number[];
  busyRows?: number[];
  markers?: unknown[];
};

const systemPrompt = [
  'Ты анализируешь фото схемы комнат, кроватей и двухъярусных кроватей для молодого бизнеса.',
  'Верни только JSON без markdown.',
  'Формат: {"summary":"...", "accent":"green|blue|amber|pink", "freeRows":[числа], "busyRows":[числа], "markers":[{"label":"B1","price":"120 000 ₸","kind":"bunk","top":{"state":"free","price":"120 000 ₸"},"bottom":{"state":"busy","price":"100 000 ₸"},"x":12,"y":30,"state":"free"}]}.',
  'markers - это кликабельные значки кроватей на фото. x и y указывай в процентах от ширины и высоты изображения, от 0 до 100.',
  'Отмечай только кровати: обычные кровати kind="bed", двухъярусные кровати kind="bunk". Комнаты без кровати не отмечай.',
  'Для bunk обязательно заполни top и bottom. Если статус или цена яруса не видны, сделай разумное предположение, price="цена не указана".',
  'state у всего marker ставь busy, если оба яруса заняты; иначе free. Для обычной кровати top и bottom могут повторять общий state и price.',
  'Если на схеме видна цена, запиши её. Если цены не видно, price="цена не указана".',
  'Определи до 40 самых понятных кроватей. Стены, коридоры, текст и комнаты без кроватей не отмечай.',
].join(' ');

const allowedAccents = ['green', 'blue', 'amber', 'pink'];
const defaultPrice = 'цена не указана';

function cleanRows(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => Number(item))
    .filter((item) => Number.isInteger(item) && item > 0 && item < 100);
}

function cleanPercent(value: unknown) {
  const number = Number(value);
  if (!Number.isFinite(number)) return null;
  return Math.max(0, Math.min(100, number));
}

function cleanPrice(value: unknown) {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, 24) : defaultPrice;
}

function cleanLevel(value: unknown, fallbackState: 'free' | 'busy', fallbackPrice: string): BedLevel {
  if (!value || typeof value !== 'object') return { price: fallbackPrice, state: fallbackState };
  const level = value as Record<string, unknown>;
  return {
    price: cleanPrice(level.price) === defaultPrice ? fallbackPrice : cleanPrice(level.price),
    state: level.state === 'busy' ? 'busy' : 'free',
  };
}

function cleanMarkers(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value.flatMap((item, index) => {
    if (!item || typeof item !== 'object') return [];
    const marker = item as Record<string, unknown>;
    const x = cleanPercent(marker.x);
    const y = cleanPercent(marker.y);
    if (x === null || y === null) return [];

    const kind = marker.kind === 'bunk' ? 'bunk' as const : 'bed' as const;
    const state = marker.state === 'busy' ? 'busy' as const : 'free' as const;
    const price = cleanPrice(marker.price);
    const top = cleanLevel(marker.top, state, price);
    const bottom = kind === 'bunk' ? cleanLevel(marker.bottom, state, price) : top;

    return [{
      bottom,
      id: crypto.randomUUID(),
      kind,
      label: typeof marker.label === 'string' && marker.label.trim() ? marker.label.trim().slice(0, 8) : String(index + 1),
      price,
      state: kind === 'bunk' && top.state === 'busy' && bottom.state === 'busy' ? 'busy' as const : state,
      top,
      x,
      y,
    }];
  }).slice(0, 40);
}

function normalizeDesign(value: SeatSchemeResponse): SeatSchemeDesign {
  const accent = typeof value.accent === 'string' && allowedAccents.includes(value.accent) ? value.accent : 'green';
  return {
    accent,
    busyRows: cleanRows(value.busyRows),
    freeRows: cleanRows(value.freeRows),
    markers: cleanMarkers(value.markers),
    summary: typeof value.summary === 'string' && value.summary.trim()
      ? value.summary.trim()
      : 'ИИ проанализировал фото схемы и отметил найденные кровати.',
  };
}

function parseDesign(text = '') {
  try {
    const cleanText = text.replace(/```json|```/g, '').trim();
    return normalizeDesign(JSON.parse(cleanText) as SeatSchemeResponse);
  } catch {
    return normalizeDesign({ summary: text });
  }
}

export async function analyzeSeatScheme(image: AiImageInput) {
  const prompt = [
    'Проанализируй фото схемы кроватей.',
    'Найди обычные и двухъярусные кровати, верни markers с координатами x/y в процентах.',
    'Для двухъярусных кроватей отдельно укажи верхний и нижний ярус.',
  ].join(' ');

  const data = await invokeAi<SeatSchemeResponse>({ image, prompt, system: systemPrompt });
  return data?.text ? parseDesign(data.text) : normalizeDesign(data ?? {});
}
