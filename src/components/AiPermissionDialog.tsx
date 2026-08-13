import { AiTabAction, getActionDetails, getActionTitle } from '../lib/aiTabActions';

type AiPermissionDialogProps = {
  actions: AiTabAction[];
  isSaving: boolean;
  onApprove: () => void;
  onCancel: () => void;
};

export function AiPermissionDialog({ actions, isSaving, onApprove, onCancel }: AiPermissionDialogProps) {
  if (actions.length === 0) return null;

  return (
    <div className="ai-permission-backdrop" role="presentation">
      <section className="ai-permission-dialog" role="dialog" aria-modal="true" aria-labelledby="ai-permission-title">
        <h2 id="ai-permission-title">Разрешить ИИ изменить вкладки?</h2>
        <p>ИИ нашёл данные, которые можно записать. Проверь список перед сохранением.</p>
        <div className="ai-permission-list">
          {actions.map((action, index) => (
            <article key={`${action.type}-${index}`}>
              <strong>{getActionTitle(action)}</strong>
              <span>{getActionDetails(action)}</span>
            </article>
          ))}
        </div>
        <div className="ai-permission-actions">
          <button disabled={isSaving} onClick={onApprove} type="button">
            {isSaving ? 'Сохраняю' : 'Разрешить'}
          </button>
          <button disabled={isSaving} onClick={onCancel} type="button">Отмена</button>
        </div>
      </section>
    </div>
  );
}
