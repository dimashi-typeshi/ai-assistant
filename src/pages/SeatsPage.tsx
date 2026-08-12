import { ClipboardEvent, ChangeEvent, useMemo, useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { askBusinessAssistant } from '../lib/ai';
import { readPhotoAsDataUrl, splitDataUrl } from '../lib/photos';

type SeatState = 'busy' | 'free';

type Seat = {
  id: string;
  row: number;
  side: 'left' | 'right';
  index: number;
  state: SeatState;
};

const rows = Array.from({ length: 20 }, (_, index) => index + 6);
const unavailableRows = new Set([6, 8, 9, 25]);

function createSeats() {
  return rows.flatMap((row) => {
    const leftCount = row <= 9 || row === 25 ? 3 : 4;
    const rightCount = row <= 9 || row === 25 ? 3 : 4;
    const left = Array.from({ length: leftCount }, (_, index) => ({
      id: `left-${row}-${index}`,
      index,
      row,
      side: 'left' as const,
      state: unavailableRows.has(row) ? 'busy' as SeatState : 'free' as SeatState,
    }));
    const right = Array.from({ length: rightCount }, (_, index) => ({
      id: `right-${row}-${index}`,
      index,
      row,
      side: 'right' as const,
      state: row <= 10 || unavailableRows.has(row) ? 'busy' as SeatState : 'free' as SeatState,
    }));

    return [...left, ...right];
  });
}

export function SeatsPage() {
  const [seats, setSeats] = useState<Seat[]>(createSeats);
  const [schemeUrl, setSchemeUrl] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const freeCount = seats.filter((seat) => seat.state === 'free').length;
  const busyCount = seats.length - freeCount;
  const seatsByRow = useMemo(() => (
    rows.map((row) => ({
      left: seats.filter((seat) => seat.row === row && seat.side === 'left'),
      right: seats.filter((seat) => seat.row === row && seat.side === 'right'),
      row,
    }))
  ), [seats]);

  function toggleSeat(id: string) {
    setSeats((current) => current.map((seat) => (
      seat.id === id ? { ...seat, state: seat.state === 'free' ? 'busy' : 'free' } : seat
    )));
  }

  async function analyzeScheme(file: File) {
    setSchemeUrl(URL.createObjectURL(file));
    setIsAnalyzing(true);
    setAnalysis('');

    try {
      const image = splitDataUrl(await readPhotoAsDataUrl(file));
      const answer = await askBusinessAssistant(
        'Проанализируй фото схемы здания или посадочных мест. Определи, какие места выглядят свободными, занятыми или недоступными. Ответь кратко по-русски и дай рекомендации, как пользователю отметить свободные места на схеме.',
        image,
      );
      setAnalysis(answer);
    } catch (error) {
      setAnalysis(error instanceof Error ? error.message : 'Не получилось распознать схему.');
    } finally {
      setIsAnalyzing(false);
    }
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) await analyzeScheme(file);
    event.target.value = '';
  }

  async function handlePaste(event: ClipboardEvent<HTMLElement>) {
    const file = Array.from(event.clipboardData.files).find((item) => item.type.startsWith('image/'));
    if (!file) return;
    event.preventDefault();
    await analyzeScheme(file);
  }

  return (
    <main className="mobile-app-shell">
      <section className="section-page seats-page">
        <SectionHeader subtitle="Загрузи фото схемы здания, а затем отмечай свободные места вручную." title="Свободные места" />
        <section className="seats-uploader" onPaste={handlePaste} tabIndex={0}>
          <div>
            <strong>Фото схемы</strong>
            <span>{isAnalyzing ? 'ИИ анализирует схему...' : 'Загрузите фото или вставьте его через Ctrl+V'}</span>
          </div>
          <label>
            <input accept="image/*" disabled={isAnalyzing} onChange={handleFileChange} type="file" />
            Добавить схему
          </label>
          {schemeUrl && <img alt="Загруженная схема" src={schemeUrl} />}
        </section>

        <section className="seats-summary">
          <article><strong>{freeCount}</strong><span>свободно</span></article>
          <article><strong>{busyCount}</strong><span>занято</span></article>
          <article><strong>{seats.length}</strong><span>всего</span></article>
        </section>

        {analysis && <p className="seats-analysis">{analysis}</p>}

        <section className="building-scheme" aria-label="Схема свободных мест">
          <div className="scheme-side-mark" />
          <div className="scheme-grid">
            {seatsByRow.map((group) => (
              <div className="scheme-row" key={group.row}>
                <div className="scheme-seats scheme-seats--left">
                  {group.left.map((seat) => (
                    <button
                      aria-label={`Ряд ${seat.row}, место ${seat.index + 1}`}
                      className={`scheme-seat scheme-seat--${seat.state}`}
                      key={seat.id}
                      onClick={() => toggleSeat(seat.id)}
                      type="button"
                    />
                  ))}
                </div>
                <strong>{group.row}</strong>
                <div className="scheme-seats scheme-seats--right">
                  {group.right.map((seat) => (
                    <button
                      aria-label={`Ряд ${seat.row}, место ${seat.index + 1}`}
                      className={`scheme-seat scheme-seat--${seat.state}`}
                      key={seat.id}
                      onClick={() => toggleSeat(seat.id)}
                      type="button"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="scheme-side-mark scheme-side-mark--right" />
        </section>
      </section>
    </main>
  );
}
