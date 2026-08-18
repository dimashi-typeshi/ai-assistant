type DemoActionsProps = {
  disabled?: boolean;
  onClear: () => void;
  onSeed: () => void;
};

export function DemoActions({ disabled = false, onClear, onSeed }: DemoActionsProps) {
  return (
    <section className="demo-actions" aria-label="Примеры данных">
      <div>
        <strong>Не знаете, с чего начать?</strong>
        <span>Заполните раздел примерами, посмотрите как всё работает, а потом уберите их одной кнопкой.</span>
      </div>
      <button disabled={disabled} onClick={onSeed} type="button">Заполнить примерами</button>
      <button disabled={disabled} onClick={onClear} type="button">Убрать примеры</button>
    </section>
  );
}
