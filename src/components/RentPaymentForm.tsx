import { FormEvent, useState } from 'react';

type RentPaymentFormProps = {
  disabled: boolean;
  onCreate: (objectName: string, dueAt: string, amount: number) => Promise<void>;
};

export function RentPaymentForm({ disabled, onCreate }: RentPaymentFormProps) {
  const [objectName, setObjectName] = useState('');
  const [dueAt, setDueAt] = useState('');
  const [amount, setAmount] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanObjectName = objectName.trim();
    const paymentAmount = Number(amount);
    if (!cleanObjectName || !dueAt || Number.isNaN(paymentAmount) || paymentAmount < 0) return;

    await onCreate(cleanObjectName, dueAt, paymentAmount);
    setObjectName('');
    setDueAt('');
    setAmount('');
  }

  return (
    <form className="rent-payment-form" onSubmit={handleSubmit}>
      <input
        disabled={disabled}
        onChange={(event) => setObjectName(event.target.value)}
        placeholder="Объект аренды"
        value={objectName}
      />
      <div className="rent-payment-form__row">
        <input disabled={disabled} onChange={(event) => setDueAt(event.target.value)} type="date" value={dueAt} />
        <input
          disabled={disabled}
          min="0"
          onChange={(event) => setAmount(event.target.value)}
          placeholder="Сумма"
          type="number"
          value={amount}
        />
      </div>
      <button disabled={disabled || !objectName.trim() || !dueAt || !amount} type="submit">
        Добавить платёж
      </button>
    </form>
  );
}
