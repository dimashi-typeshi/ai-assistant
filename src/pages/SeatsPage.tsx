import { ClipboardEvent, ChangeEvent, PointerEvent, useEffect, useRef, useState } from 'react';
import { SectionHeader } from '../components/SectionHeader';
import { readPhotoAsDataUrl, splitDataUrl } from '../lib/photos';
import { analyzeSeatScheme, SeatMarker, SeatSchemeDesign } from '../lib/seatsAi';

type SeatAccent = SeatSchemeDesign['accent'];

type Scheme = {
  id: string;
  imageUrl: string;
  name: string;
  analysis: string;
  accent: SeatAccent;
  markers: SeatMarker[];
};

const schemesKey = 'seatSchemes';
const indexKey = 'seatSchemesActiveIndex';

function loadSchemes() {
  try {
    const parsed = JSON.parse(localStorage.getItem(schemesKey) ?? '[]') as Scheme[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function getMarkerIcon(marker: SeatMarker) {
  return marker.kind === 'bunk' ? 'II' : marker.state === 'free' ? '+' : '-';
}

export function SeatsPage() {
  const [schemes, setSchemes] = useState<Scheme[]>(loadSchemes);
  const [activeIndex, setActiveIndex] = useState(() => Number(localStorage.getItem(indexKey) ?? 0));
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isPriceMode, setIsPriceMode] = useState(false);
  const [editingMarkerId, setEditingMarkerId] = useState('');
  const [priceInput, setPriceInput] = useState('');
  const layerRef = useRef<HTMLDivElement>(null);
  const clickTimerRef = useRef<number | null>(null);
  const dragRef = useRef({ id: '', moved: false });
  const activeScheme = schemes[Math.min(activeIndex, Math.max(0, schemes.length - 1))];
  const markers = activeScheme?.markers ?? [];
  const freeCount = markers.filter((marker) => marker.state === 'free').length;
  const busyCount = markers.filter((marker) => marker.state === 'busy').length;

  useEffect(() => {
    localStorage.setItem(schemesKey, JSON.stringify(schemes));
  }, [schemes]);

  useEffect(() => {
    localStorage.setItem(indexKey, String(activeIndex));
  }, [activeIndex]);

  async function analyzeScheme(file: File) {
    const imageUrl = await readPhotoAsDataUrl(file);
    setIsAnalyzing(true);

    try {
      const image = splitDataUrl(imageUrl);
      const design = await analyzeSeatScheme(image);
      const nextScheme: Scheme = {
        accent: design.accent,
        analysis: design.summary,
        id: crypto.randomUUID(),
        imageUrl,
        markers: design.markers,
        name: file.name,
      };

      setSchemes((current) => {
        const nextSchemes = [...current, nextScheme];
        setActiveIndex(nextSchemes.length - 1);
        return nextSchemes;
      });
    } catch (error) {
      const fallbackScheme: Scheme = {
        accent: 'green',
        analysis: error instanceof Error ? error.message : 'Не получилось распознать схему.',
        id: crypto.randomUUID(),
        imageUrl,
        markers: [],
        name: file.name,
      };
      setSchemes((current) => {
        const nextSchemes = [...current, fallbackScheme];
        setActiveIndex(nextSchemes.length - 1);
        return nextSchemes;
      });
    } finally {
      setIsAnalyzing(false);
    }
  }

  function toggleMarker(id: string) {
    setSchemes((current) => current.map((scheme) => {
      if (scheme.id !== activeScheme?.id) return scheme;
      return {
        ...scheme,
        markers: scheme.markers.map((marker) => (
          marker.id === id ? { ...marker, state: marker.state === 'free' ? 'busy' : 'free' } : marker
        )),
      };
    }));
  }

  function addFreeMarker() {
    if (!activeScheme) return;
    const nextNumber = activeScheme.markers.length + 1;
    const marker: SeatMarker = {
      bottom: { price: 'цена не указана', state: 'free' },
      id: crypto.randomUUID(),
      kind: 'bed',
      label: `M${nextNumber}`,
      price: 'цена не указана',
      state: 'free',
      top: { price: 'цена не указана', state: 'free' },
      x: 50,
      y: 50,
    };

    setSchemes((current) => current.map((scheme) => (
      scheme.id === activeScheme.id ? { ...scheme, markers: [...scheme.markers, marker] } : scheme
    )));
  }

  function moveMarker(id: string, x: number, y: number) {
    setSchemes((current) => current.map((scheme) => {
      if (scheme.id !== activeScheme?.id) return scheme;
      return {
        ...scheme,
        markers: scheme.markers.map((marker) => (
          marker.id === id ? { ...marker, x, y } : marker
        )),
      };
    }));
  }

  function dragMarker(event: PointerEvent<HTMLButtonElement>, id: string) {
    const rect = layerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((event.clientY - rect.top) / rect.height) * 100));
    dragRef.current.moved = true;
    moveMarker(id, x, y);
  }

  function startMarkerDrag(event: PointerEvent<HTMLButtonElement>, id: string) {
    dragRef.current = { id, moved: false };
    event.currentTarget.setPointerCapture(event.pointerId);
  }

  function moveMarkerDrag(event: PointerEvent<HTMLButtonElement>, id: string) {
    if (dragRef.current.id !== id) return;
    dragMarker(event, id);
  }

  function stopMarkerDrag() {
    window.setTimeout(() => {
      dragRef.current = { id: '', moved: false };
    }, 0);
  }

  function handleMarkerClick(id: string) {
    if (dragRef.current.moved) return;
    if (isPriceMode) {
      openPriceEditor(id);
      return;
    }
    if (clickTimerRef.current) window.clearTimeout(clickTimerRef.current);
    clickTimerRef.current = window.setTimeout(() => {
      toggleMarker(id);
      clickTimerRef.current = null;
    }, 220);
  }

  function openPriceEditor(id: string) {
    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }
    const marker = activeScheme?.markers.find((item) => item.id === id);
    setEditingMarkerId(id);
    setPriceInput(marker?.price ?? '');
  }

  function saveMarkerPrice() {
    const cleanPrice = priceInput.trim() || 'цена не указана';
    setSchemes((current) => current.map((scheme) => {
      if (scheme.id !== activeScheme?.id) return scheme;
      return {
        ...scheme,
        markers: scheme.markers.map((item) => (
          item.id === editingMarkerId ? { ...item, bottom: { ...item.bottom, price: cleanPrice }, price: cleanPrice, top: { ...item.top, price: cleanPrice } } : item
        )),
      };
    }));
    setEditingMarkerId('');
    setPriceInput('');
  }

  function closePriceEditor() {
    setEditingMarkerId('');
    setPriceInput('');
  }

  function showPreviousScheme() {
    if (schemes.length < 2) return;
    setActiveIndex((current) => (current === 0 ? schemes.length - 1 : current - 1));
  }

  function showNextScheme() {
    if (schemes.length < 2) return;
    setActiveIndex((current) => (current === schemes.length - 1 ? 0 : current + 1));
  }

  function removeActiveScheme() {
    if (!activeScheme) return;
    setSchemes((current) => {
      const nextSchemes = current.filter((scheme) => scheme.id !== activeScheme.id);
      setActiveIndex((currentIndex) => Math.max(0, Math.min(currentIndex, nextSchemes.length - 1)));
      return nextSchemes;
    });
  }

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    for (const file of files) await analyzeScheme(file);
    event.target.value = '';
  }

  async function handlePaste(event: ClipboardEvent<HTMLElement>) {
    const files = Array.from(event.clipboardData.files).filter((item) => item.type.startsWith('image/'));
    if (files.length === 0) return;
    event.preventDefault();
    for (const file of files) await analyzeScheme(file);
  }

  return (
    <main className="mobile-app-shell">
      <section className="section-page seats-page">
        <SectionHeader subtitle="Схемы сохраняются после перезапуска, а ИИ отмечает свободные, занятые и двухъярусные кровати." title="Свободные места" />
        <section className="seats-uploader" onPaste={handlePaste} tabIndex={0}>
          <div>
            <strong>Фото схемы</strong>
            <span>{isAnalyzing ? 'ИИ анализирует новую схему...' : 'Загрузите одно или несколько фото, либо вставьте через Ctrl+V'}</span>
          </div>
          <label>
            <input accept="image/*" disabled={isAnalyzing} multiple onChange={handleFileChange} type="file" />
            Добавить схемы
          </label>
        </section>

        <section className="seats-summary">
          <article><strong>{freeCount}</strong><span>свободно</span></article>
          <article><strong>{busyCount}</strong><span>занято</span></article>
          <article><strong>{schemes.length}</strong><span>схем</span></article>
        </section>

        {activeScheme?.analysis && <p className="seats-analysis">{activeScheme.analysis}</p>}

        <button className={`price-mode-button${isPriceMode ? ' price-mode-button--active' : ''}`} onClick={() => setIsPriceMode((current) => !current)} type="button">
          Установить цену
        </button>
        <button className="add-seat-marker-button" disabled={!activeScheme} onClick={addFreeMarker} type="button">
          Добавить свободное место
        </button>

        <section className={`building-scheme building-scheme--${activeScheme?.accent ?? 'green'}`} aria-label="Схема свободных мест">
          <div className="scheme-legend" aria-label="Легенда схемы">
            <span><i className="legend-mark legend-mark--free" />Свободная кровать</span>
            <span><i className="legend-mark legend-mark--busy" />Занятая кровать</span>
            <span><i className="legend-mark legend-mark--bunk" />Двухъярусная кровать</span>
          </div>
          {activeScheme ? (
            <div className="scheme-image-wrap">
              <img alt={activeScheme.name} src={activeScheme.imageUrl} />
              <div className="scheme-marker-layer" aria-label="Кликабельные кровати" ref={layerRef}>
                {activeScheme.markers.map((marker) => (
                  <button
                    aria-label={`${marker.label}: ${marker.price}`}
                    className={`scheme-marker scheme-marker--${marker.state} scheme-marker--${marker.kind}`}
                    key={marker.id}
                    onClick={() => handleMarkerClick(marker.id)}
                    onDoubleClick={() => openPriceEditor(marker.id)}
                    onPointerDown={(event) => startMarkerDrag(event, marker.id)}
                    onPointerMove={(event) => moveMarkerDrag(event, marker.id)}
                    onPointerUp={stopMarkerDrag}
                    style={{ left: `${marker.x}%`, top: `${marker.y}%` }}
                    type="button"
                  >
                    <b>{getMarkerIcon(marker)}</b>
                    <span className={marker.kind === 'bunk' ? 'scheme-bunk-tooltip' : ''}>
                      {marker.kind === 'bunk' ? (
                        <>
                          <em className={`scheme-level scheme-level--${marker.top.state}`}>Верхний: {marker.top.price}</em>
                          <em className={`scheme-level scheme-level--${marker.bottom.state}`}>Нижний: {marker.bottom.price}</em>
                        </>
                      ) : marker.price}
                    </span>
                  </button>
                ))}
              </div>
              <div className="scheme-switcher" aria-label="Переключение схем">
                <button disabled={schemes.length < 2} onClick={showPreviousScheme} type="button">‹</button>
                <strong>{activeIndex + 1}/{schemes.length}</strong>
                <button disabled={schemes.length < 2} onClick={showNextScheme} type="button">›</button>
                <button className="scheme-remove-button" onClick={removeActiveScheme} type="button">×</button>
              </div>
            </div>
          ) : (
            <div className="scheme-empty">
              <strong>Загрузите фото схемы</strong>
              <span>ИИ поставит кликабельные значки прямо на найденные кровати.</span>
            </div>
          )}
        </section>
        {editingMarkerId && (
          <div className="price-editor-backdrop" role="presentation">
            <section className="price-editor-dialog" role="dialog" aria-modal="true" aria-labelledby="price-editor-title">
              <h2 id="price-editor-title">Цена кровати</h2>
              <input autoFocus onChange={(event) => setPriceInput(event.target.value)} placeholder="Например: 120 000 ₸" value={priceInput} />
              <div>
                <button onClick={saveMarkerPrice} type="button">Подтвердить</button>
                <button onClick={closePriceEditor} type="button">Отмена</button>
              </div>
            </section>
          </div>
        )}
      </section>
    </main>
  );
}
