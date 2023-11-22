import { goCardLessSecretId, goCardLessSecretKey } from '../secrets';
import { getNextLang } from '../ssr/getLang';
import { baseUrl, protocol } from '../../config';

import prisma from '../../database/prisma/db';

import { bankMinimal } from '../../types/prisma/Bank/bank-minimal';
import { jsonFetcher } from '../../utils/json-fetcher';

import { ActorType, PaymentMethod } from '@prisma/client';
import debug from 'debug';

import type { CountryCode, Currency, Prisma } from '@prisma/client';
import type { BankMinimal } from '../../types/prisma/Bank/bank-minimal';

const debugLog = debug('okampus:server:services:bank');

type GoCardLessBank = {
  id: string;
  name: string;
  bic: string;
  transaction_total_days: string;
  logo: string;
  countries: CountryCode[];
};

type GoCardLessRequisition = {
  id: string;
  redirect: string;
  link: string;
};

type GoCardLessAccount = {
  id: string;
  ownerName?: string;
  ownerAddressUnstructured?: string;
  name?: string;
  displayName?: string;
  details?: string;
  status?: string;
  usage?: string;
  iban?: string;
};

type GoCardLessAccountBalance = {
  balanceAmount: { amount: string; currency: Currency };
  referenceDate?: string;
};

export type GoCardLessParsedBankAccount = GoCardLessAccount & {
  balance: number;
  currency: Currency;
  referenceDate?: Date;
};

type GoCardLessTransaction = {
  transactionAmount: { amount: string; currency: Currency };
  currencyExchange?: { exchangeRate: string; targetCurrency: Currency; sourceCurrency: Currency }[];
  remittanceInformationStructured?: string;
  remittanceInformationStructuredArray?: string[];
  remittanceInformationUnstructured?: string;
  remittanceInformationUnstructuredArray?: string[];
  entryReference?: string;
  transactionId?: string;
  internalTransactionId: string;
  bookingDate?: string;
  valueDate?: string;
  additionalInformation?: string;
  creditorName?: string;
  creditorAccount?: { iban?: string };
  debtorName?: string;
  debtorAccount?: { iban?: string };
};

export async function getGoCardLessAccessToken() {
  const data: { access: string } = await jsonFetcher('https://bankaccountdata.gocardless.com/api/v2/token/new/', {
    method: 'POST',
    body: JSON.stringify({ secret_id: goCardLessSecretId, secret_key: goCardLessSecretKey }),
    headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
  });

  return data.access;
}

export async function getGoCardLessBank(goCardLessInstitutionId: string) {
  try {
    const goCardLessResult: { data: GoCardLessBank } = await jsonFetcher(
      `https://bankaccountdata.gocardless.com/api/v2/institutions/${goCardLessInstitutionId}`,
      { headers: { Accept: 'application/json', Authorization: `Bearer ${await getGoCardLessAccessToken()}` } },
    );

    const { id, bic, countries, logo, name, transaction_total_days } = goCardLessResult.data;
    const transactionTotalDays = Number.parseInt(transaction_total_days) || 90;
    const actor = { create: { avatar: logo, name, type: ActorType.Bank } };
    return await prisma.bank.upsert({
      where: { goCardLessInstitutionId },
      update: {
        bic,
        countries,
        name,
        goCardLessInstitutionId: id,
        transactionTotalDays,
        actor: { update: actor.create },
      },
      create: { goCardLessInstitutionId, bic, countries, name, transactionTotalDays, actor },
      select: bankMinimal.select,
    });
  } catch {
    return null;
  }
}

export async function getGoCardLessRequisition(institutionId: string, teamSlug: string, domain: string) {
  const lang = getNextLang().slice(0, 2).toUpperCase();
  const redirect = `${protocol}://${domain}.${baseUrl}/manage/team/${teamSlug}/bank/onboard/${institutionId}`;

  const data: GoCardLessRequisition = await jsonFetcher(`https://bankaccountdata.gocardless.com/api/v2/requisitions/`, {
    method: 'POST',
    body: JSON.stringify({ institution_id: institutionId, redirect, user_language: lang }),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${await getGoCardLessAccessToken()}`,
    },
  });

  return data;
}

export async function getGoCardLessBankAccounts(requisitionId: string) {
  const data: { accounts: string[] } = await jsonFetcher(
    `https://bankaccountdata.gocardless.com/api/v2/requisitions/${requisitionId}/`,
    { headers: { Accept: 'application/json', Authorization: `Bearer ${await getGoCardLessAccessToken()}` } },
  );

  const accounts: GoCardLessParsedBankAccount[] = [];
  if (Array.isArray(data.accounts)) {
    for (const accountId of data.accounts) {
      const accountData: { account: GoCardLessAccount } = await jsonFetcher(
        `https://bankaccountdata.gocardless.com/api/v2/accounts/${accountId}/details`,
        { headers: { Accept: 'application/json', Authorization: `Bearer ${await getGoCardLessAccessToken()}` } },
      );

      const balanceData: { balances: GoCardLessAccountBalance[] } = await jsonFetcher(
        `https://bankaccountdata.gocardless.com/api/v2/accounts/${accountId}/balances`,
        { headers: { Accept: 'application/json', Authorization: `Bearer ${await getGoCardLessAccessToken()}` } },
      );

      const { amount, currency } = balanceData.balances[0].balanceAmount;
      const date = balanceData.balances[0].referenceDate;
      accounts.push({
        ...accountData.account,
        currency,
        id: accountId,
        balance: Number.parseFloat(amount),
        referenceDate: date ? new Date(date) : new Date(),
      });
    }
  }

  return accounts;
}

// TODO: ChatGPT parsing?
export async function getGoCardLessTransactions(
  accountId: string,
  expectedCurrency: Currency,
): Promise<Omit<Prisma.BankTransactionCreateInput, 'moneyAccount'>[]> {
  const data: { transactions: { booked: GoCardLessTransaction[] } } = await jsonFetcher(
    `https://bankaccountdata.gocardless.com/api/v2/accounts/${accountId}/transactions`,
    { headers: { Accept: 'application/json', Authorization: `Bearer ${await getGoCardLessAccessToken()}` } },
  );

  debugLog('Transactions', { data });

  return data.transactions.booked.map((transaction) => {
    let currencyExchange: { rate: number; currency: Currency } | undefined;
    if (Array.isArray(transaction.currencyExchange)) {
      const rate = Number.parseFloat(transaction.currencyExchange.at(0)?.exchangeRate ?? '');
      if (rate) {
        const targetCurrency = transaction.currencyExchange.at(0)?.targetCurrency;
        const currency =
          targetCurrency === expectedCurrency ? transaction.currencyExchange.at(0)?.sourceCurrency : targetCurrency;

        if (currency) currencyExchange = { rate, currency };
      }
    }

    const referenceId = transaction.entryReference ?? transaction.transactionId;
    return {
      goCardLessTransactionId: transaction.internalTransactionId,
      referenceId: transaction.entryReference ?? transaction.transactionId,
      amount: Number.parseFloat(transaction.transactionAmount.amount),
      counterPartyName: transaction.creditorName ?? transaction.debtorName,
      paymentMethod: transaction.creditorAccount ? PaymentMethod.DirectDebit : PaymentMethod.BankTransfer,
      iban: transaction.creditorAccount?.iban ?? transaction.debtorAccount?.iban,
      bookedAt: transaction.bookingDate ? new Date(transaction.bookingDate) : new Date(),
      payedAt: transaction.valueDate ? new Date(transaction.valueDate) : undefined,
      currencyExchangeRate: currencyExchange?.rate,
      currencyTarget: currencyExchange?.currency,
      wording:
        transaction.remittanceInformationUnstructured ??
        transaction.remittanceInformationUnstructuredArray?.join(' / ') ??
        `REF ${referenceId ?? 'INCONNUE'}`,
    };
  });
}

// TODO: augment data with bankCodes, websites, legal unit, etc.
export async function getGoCardLessBanks(countryCode: CountryCode) {
  const banks: BankMinimal[] = [];

  try {
    const data: GoCardLessBank[] = await jsonFetcher(
      `https://bankaccountdata.gocardless.com/api/v2/institutions/?country=${countryCode}`,
      { headers: { Accept: 'application/json', Authorization: `Bearer ${await getGoCardLessAccessToken()}` } },
    );

    for (const { id, bic, countries, logo, name, transaction_total_days } of data) {
      const transactionTotalDays = Number.parseInt(transaction_total_days) || 90;
      const actor = { create: { avatar: logo, name, type: ActorType.Bank } };
      const bank = await prisma.bank.upsert({
        where: { goCardLessInstitutionId: id },
        update: { bic, countries, name, transactionTotalDays, actor: { update: actor.create } },
        create: { goCardLessInstitutionId: id, bic, countries, name, transactionTotalDays, actor },
        select: bankMinimal.select,
      });
      banks.push(bank);
    }
    return banks;
  } catch {
    return banks;
  }
}

export async function getBank(goCardLessInstitutionId: string) {
  const bank = await prisma.bank.findUnique({ where: { goCardLessInstitutionId } });
  if (!bank) {
    const geoapifyAddress = await getGoCardLessBank(goCardLessInstitutionId);
    if (!geoapifyAddress) throw new Error(`Address not found for geoapifyId: ${goCardLessInstitutionId}`);
    return geoapifyAddress;
  }
  return bank;
}

export async function getAllRequisitions() {
  const data: { results: GoCardLessRequisition[] } = await jsonFetcher(
    `https://bankaccountdata.gocardless.com/api/v2/requisitions/`,
    { headers: { Accept: 'application/json', Authorization: `Bearer ${await getGoCardLessAccessToken()}` } },
  );

  return data.results;
}

export async function resetRequisition(id: string) {
  await fetch(`https://bankaccountdata.gocardless.com/api/v2/requisitions/${id}/`, {
    method: 'DELETE',
    headers: { Accept: 'application/json', Authorization: `Bearer ${await getGoCardLessAccessToken()}` },
  }).then(async (res) => {
    debugLog.enabled && debugLog(res.statusText, await res.json());
  });
}
