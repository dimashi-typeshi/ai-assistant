const prompts = [
  'Напиши пост для Instagram о скидке в небольшом кафе',
  'Помоги вежливо ответить клиенту, который недоволен заказом',
  'Придумай акцию на неделю для салона красоты',
  'Составь план задач на день для владельца магазина',
  'Улучши описание услуги репетитора по английскому языку',
];

type PromptQuickActionsProps = {
  onSelect: (prompt: string) => void;
  disabled: boolean;
};

export function PromptQuickActions({ onSelect, disabled }: PromptQuickActionsProps) {
  return (
    <section className="quick-actions" aria-label="Быстрые сценарии">
      {prompts.map((prompt) => (
        <button
          className="quick-action"
          disabled={disabled}
          key={prompt}
          onClick={() => onSelect(prompt)}
          type="button"
        >
          {prompt}
        </button>
      ))}
    </section>
  );
}
