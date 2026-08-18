export function friendlyError(message: string) {
  const text = message.toLowerCase();

  if (text.includes('invalid login') || text.includes('invalid credentials')) {
    return 'Почта или пароль не подошли. Проверь данные и попробуй ещё раз.';
  }

  if (text.includes('email not confirmed')) {
    return 'Почту ещё нужно подтвердить. Открой письмо от Supabase и попробуй снова.';
  }

  if (text.includes('jwt') || text.includes('session')) {
    return 'Сессия устарела. Войди в аккаунт ещё раз, и всё продолжится.';
  }

  if (text.includes('network') || text.includes('fetch') || text.includes('failed to fetch')) {
    return 'Не получилось связаться с сервером. Проверь интернет и попробуй ещё раз.';
  }

  if (text.includes('row-level security') || text.includes('permission denied') || text.includes('policy')) {
    return 'Нет доступа к этим данным. Войди в правильный аккаунт и повтори действие.';
  }

  if (text.includes('duplicate') || text.includes('already registered')) {
    return 'Такая запись уже есть. Проверь список или используй другие данные.';
  }

  return message || 'Что-то пошло не так. Попробуй ещё раз через минуту.';
}
