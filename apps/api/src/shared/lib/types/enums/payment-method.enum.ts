import { registerEnumType } from '@nestjs/graphql';

export enum PaymentMethod {
  Cash = 'Cash',
  CreditCard = 'CreditCard',
  Transfer = 'Transfer',
  Check = 'Check',
  MobilePayment = 'MobilePayment',
}

registerEnumType(PaymentMethod, { name: 'PaymentMethod' });
