import { RentContractForm } from './RentContractForm';
import { formatRentAmount, formatRentDate, RentContract } from '../lib/rent';

type RentContractsPanelProps = {
  contracts: RentContract[];
  disabled: boolean;
  onCreate: (
    objectName: string,
    tenantName: string,
    startsAt: string,
    endsAt: string,
    monthlyAmount: number,
  ) => Promise<void>;
};

function daysLeft(endsAt: string) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const end = new Date(endsAt);
  end.setHours(0, 0, 0, 0);
  return Math.ceil((end.getTime() - today.getTime()) / 86_400_000);
}

function getStatusText(contract: RentContract) {
  const left = daysLeft(contract.endsAt);
  if (!contract.isActive) return 'Завершён';
  if (left < 0) return 'Срок истёк';
  if (left === 0) return 'Заканчивается сегодня';
  return `Осталось ${left} дн.`;
}

export function RentContractsPanel({ contracts, disabled, onCreate }: RentContractsPanelProps) {
  return (
    <>
      <RentContractForm disabled={disabled} onCreate={onCreate} />
      <div className="rent-contract-list">
        {contracts.map((contract) => (
          <article className="rent-contract-card" key={contract.id}>
            <span className="rent-contract-card__marker" />
            <div>
              <h2>{contract.objectName}</h2>
              <p>{contract.tenantName}</p>
              <small>
                {formatRentDate(contract.startsAt)} - {formatRentDate(contract.endsAt)}
              </small>
            </div>
            <div className="rent-contract-card__side">
              <strong>{formatRentAmount(contract.monthlyAmount)}</strong>
              <span>{getStatusText(contract)}</span>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
