import Section from '../../_components/atoms/Container/Section';
import { useState } from 'react';
import type { BankTransaction } from '@prisma/client';

export type VerifyTransactionsViewProps = { transactions: BankTransaction[] };

export default function VerifyTransactionsView({ transactions }: VerifyTransactionsViewProps) {
  const [transactionIdx, setTransactionIdx] = useState<number>(0);
  return <Section title={`Transaction ${transactionIdx + 1} / ${transactions.length}`}>{/* <Verify */}</Section>;
}
