import { FormEvent, useState } from 'react';

type RentContractFormProps = {
  disabled: boolean;
  onCreate: (
    objectName: string,
    tenantName: string,
    startsAt: string,
    endsAt: string,
    monthlyAmount: number,
  ) => Promise<void>;
};

export function RentContractForm({ disabled, onCreate }: RentContractFormProps) {
  const [objectName, setObjectName] = useState('');
  const [tenantName, setTenantName] = useState('');
  const [startsAt, setStartsAt] = useState('');
  const [endsAt, setEndsAt] = useState('');
  const [monthlyAmount, setMonthlyAmount] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const amount = Number(monthlyAmount);
    if (!objectName.trim() || !tenantName.trim() || !startsAt || !endsAt || Number.isNaN(amount)) return;

    await onCreate(objectName.trim(), tenantName.trim(), startsAt, endsAt, amount);
    setObjectName('');
    setTenantName('');
    setStartsAt('');
    setEndsAt('');
    setMonthlyAmount('');
  }

  return (
    <form className="rent-form" onSubmit={handleSubmit}>
      <input disabled={disabled} onChange={(event) => setObjectName(event.target.value)} placeholder="Объект" value={objectName} />
      <input disabled={disabled} onChange={(event) => setTenantName(event.target.value)} placeholder="Арендатор" value={tenantName} />
      <div className="rent-form__row">
        <input disabled={disabled} onChange={(event) => setStartsAt(event.target.value)} type="date" value={startsAt} />
        <input disabled={disabled} onChange={(event) => setEndsAt(event.target.value)} type="date" value={endsAt} />
      </div>
      <input
        disabled={disabled}
        min="0"
        onChange={(event) => setMonthlyAmount(event.target.value)}
        placeholder="Сумма в месяц"
        type="number"
        value={monthlyAmount}
      />
      <button disabled={disabled || !objectName.trim() || !tenantName.trim() || !startsAt || !endsAt || !monthlyAmount} type="submit">
        Добавить договор
      </button>
    </form>
  );
}
