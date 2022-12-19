import { registerEnumType } from '@nestjs/graphql';

export enum PaymentMethod {
  Cash = 'Cash',
  CreditCard = 'CreditCard',
  Transfer = 'Transfer',
  RegularTransfer = 'RegularTransfer',
  Check = 'Check',
  MobilePayment = 'MobilePayment',
  Other = 'Other',
}

registerEnumType(PaymentMethod, { name: 'PaymentMethod' });
