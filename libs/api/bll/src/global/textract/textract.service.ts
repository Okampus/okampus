import { loadConfig } from '../../shards/utils/load-config';

import { AnalyzeExpenseCommand, TextractClient } from '@aws-sdk/client-textract';

import { ConfigService } from '@nestjs/config';

import { EntityManager } from '@mikro-orm/core';
import { Injectable, Logger } from '@nestjs/common';

import { FileUpload } from '@okampus/api/dal';
import { BucketNames } from '@okampus/shared/enums';
import { extractDate, parsePositiveNumber, findLast } from '@okampus/shared/utils';

import type { ProcessedReceipt } from '@okampus/shared/types';

const isCorrectTax = (taxAmount: number, amount: number) => taxAmount / amount < 0.21 && taxAmount / amount > 0.02;

const BEFORE_DISCOUNT_STRINGS = ['avant remise', 'before discount'];
const roundDecimal = (num: number) => Math.round(num * 100) / 100;

@Injectable()
export class TextractService {
  client: TextractClient;
  receiptBucket: string;
  logger = new Logger(TextractService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly em: EntityManager,
  ) {
    const options = loadConfig(this.configService, 'textract');

    this.receiptBucket = loadConfig(this.configService, 's3.bucketNames')[BucketNames.Receipts];
    this.client = new TextractClient({
      region: options.region,
      credentials: { accessKeyId: options.accessKey, secretAccessKey: options.secretKey },
    });
  }

  public async processReceipt(key: string): Promise<ProcessedReceipt | null> {
    // TODO: security check
    const file = await this.em.findOneOrFail(FileUpload, { id: key });
    const name = file.url.split('/').pop();

    const params = { Document: { S3Object: { Bucket: this.receiptBucket, Name: name } } };

    const result = await this.client.send(new AnalyzeExpenseCommand(params));

    const document = result?.ExpenseDocuments?.[0];
    if (!document) return null;

    const lineItems =
      document.LineItemGroups?.map((group) => {
        return (
          group.LineItems?.map(({ LineItemExpenseFields: fields }) => ({
            name: fields?.find(({ Type }) => Type?.Text === 'ITEM')?.ValueDetection?.Text ?? 'Inconnu',
            price:
              parsePositiveNumber(fields?.find(({ Type }) => Type?.Text === 'PRICE')?.ValueDetection?.Text ?? '') ?? 0,
            quantity:
              parsePositiveNumber(fields?.find(({ Type }) => Type?.Text === 'QUANTITY')?.ValueDetection?.Text ?? '') ??
              1,
          })) ?? []
        );
      }).flat() ?? [];

    const summary = document.SummaryFields?.map((field) => {
      return {
        type: field.Type?.Text,
        value: field.ValueDetection?.Text,
        label: field.LabelDetection?.Text,
        properties: field.GroupProperties,
      };
    });

    const street = (summary && findLast(summary, ({ type }) => type === 'STREET')?.value) || null;
    const city = (summary && findLast(summary, ({ type }) => type === 'CITY')?.value) || null;
    const vendorName = summary?.find(({ type }) => type === 'VENDOR_NAME')?.value || street || city || null;

    const dateString = summary?.find(({ type }) => type === 'INVOICE_RECEIPT_DATE')?.value;
    const date = dateString ? extractDate(dateString)?.toISOString() ?? null : null;

    const phone = summary?.find(({ type }) => type === 'PHONE' || type === 'VENDOR_PHONE')?.value || null;
    const amount =
      Math.max(
        ...(summary
          ?.filter(
            ({ label, type }) =>
              (type === 'TOTAL' || type === 'SUBTOTAL' || type === 'AMOUNT_PAID') &&
              !BEFORE_DISCOUNT_STRINGS.some(
                (beforeDiscountString) => label?.toLowerCase().includes(beforeDiscountString),
              ),
          )
          .map(({ value }) => (value ? roundDecimal(parsePositiveNumber(value) ?? 0) : 0)) ?? []),
      ) || null;

    const tax =
      amount &&
      (summary
        ?.filter(({ type }) => type === 'TAX' || type === 'TOTAL' || type === 'SUBTOTAL' || type === 'AMOUNT_PAID')
        .map(({ value }) => (value ? roundDecimal(parsePositiveNumber(value) ?? 0) : 0) ?? [])
        .find((taxAmount) => isCorrectTax(taxAmount, amount)) ??
        null);

    let address = '';
    if (name) address += vendorName;
    // if (street) address += ` ${street}`;
    if (city) address += ` ${city}`;

    const sum = lineItems?.reduce((acc, { price, quantity }) => acc + price * quantity, 0) ?? 0;
    if (amount && sum < amount) lineItems.push({ name: 'Inconnu', price: amount - sum, quantity: 1 });

    this.logger.debug('Textract result', { lineItems, address, amount, tax, vendorName, date, phone });
    return { lineItems, address, amount, tax, vendorName, date, phone };
  }
}
