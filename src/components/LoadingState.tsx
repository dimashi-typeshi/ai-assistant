type LoadingStateProps = {
  text?: string;
};

export function LoadingState({ text = 'Загружаем данные...' }: LoadingStateProps) {
  return (
    <div className="loading-state" role="status" aria-live="polite">
      <span aria-hidden="true" />
      <p>{text}</p>
    </div>
  );
}
