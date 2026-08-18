alter table public.payment_operations
  alter column status set default 'Оплачено';

update public.payment_operations
set status = 'Оплачено'
where status = 'РћРїР»Р°С‡РµРЅРѕ';
