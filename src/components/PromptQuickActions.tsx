const prompts = [
  'Сгенерируй вежливый ответ клиенту, который спрашивает цену и сроки.',
  'Дай совет по моим данным: что улучшить в продажах, если заявок много, а оплат мало?',
  'Ответь в роли опытного управляющего кофейней: как спокойно решить конфликт с клиентом?',
  'Проанализируй фото и вытащи нужную информацию: суммы, даты, задачи и что добавить во вкладки.',
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
