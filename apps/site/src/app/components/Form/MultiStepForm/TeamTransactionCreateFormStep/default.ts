import { AddressType, PayedByType, FinanceCategory, PaymentMethod } from '@okampus/shared/enums';
import type { GeocodeLocation, SelectItem } from '@okampus/shared/types';

export const teamTransactionCreateDefaultValues: {
  name: string;
  amount: number;
  description: string;
  projectId: string | null;
  eventId: string | null;
  fileUploadId: string | null;
  file: File | null;
  addressItem: SelectItem<GeocodeLocation> | null;
  addressType: AddressType;
  addressQuery: string;
  payedById: string | null;
  payedByType: PayedByType;
  payedAt: Date;
  category: FinanceCategory;
  method: PaymentMethod;
} = {
  name: '',
  amount: 0,
  description: '',
  projectId: null,
  eventId: null,
  fileUploadId: null,
  file: null,
  addressItem: null,
  addressType: AddressType.Known,
  addressQuery: '',
  payedById: null,
  payedByType: PayedByType.Manual,
  payedAt: new Date(),
  category: FinanceCategory.Other,
  method: PaymentMethod.Cash,
};
