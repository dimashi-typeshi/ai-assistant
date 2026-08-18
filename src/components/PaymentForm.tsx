import { FormEvent, useState } from 'react';

type PaymentFormProps = {
  buttonLabel: string;
  dateLabel: string;
  disabled: boolean;
  hideAmount?: boolean;
  onCreate: (title: string, amount: number, date: string) => Promise<void>;
  titleLabel: string;
};

export function PaymentForm({ buttonLabel, dateLabel, disabled, hideAmount = false, onCreate, titleLabel }: PaymentFormProps) {
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanAmount = hideAmount ? 0 : Number(amount);
    if (!title.trim() || !date || (!hideAmount && (!Number.isFinite(cleanAmount) || cleanAmount < 0))) return;
    await onCreate(title.trim(), cleanAmount, date);
    setTitle('');
    setAmount('');
    setDate('');
  }

  return (
    <form className="rent-form" onSubmit={submit}>
      <input disabled={disabled} onChange={(event) => setTitle(event.target.value)} placeholder={titleLabel} value={title} />
      <div className="rent-form__row">
        {!hideAmount && <input disabled={disabled} onChange={(event) => setAmount(event.target.value)} placeholder="Сумма" type="number" value={amount} />}
        <input aria-label={dateLabel} disabled={disabled} onChange={(event) => setDate(event.target.value)} type="date" value={date} />
      </div>
      <button disabled={disabled || !title.trim() || !date} type="submit">{buttonLabel}</button>
    </form>
  );
}
