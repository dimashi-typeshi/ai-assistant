type ProfileActionsProps = {
  isEditing: boolean;
  onEdit: () => void;
  onResetPassword: () => Promise<void>;
  onSignOut: () => Promise<void>;
};

export function ProfileActions({ isEditing, onEdit, onResetPassword, onSignOut }: ProfileActionsProps) {
  if (isEditing) return null;

  return (
    <section className="profile-actions profile-actions--stack">
      <button onClick={onEdit} type="button">Редактировать профиль</button>
      <button onClick={() => void onResetPassword()} type="button">Сменить пароль</button>
      <button onClick={() => void onSignOut()} type="button">Выйти</button>
    </section>
  );
}
