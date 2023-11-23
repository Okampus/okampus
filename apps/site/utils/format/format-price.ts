import { Currency } from '@prisma/client';
import type { Locale } from '../../server/ssr/getLang';

export const i18nStringFree: Record<Locale, string> = { 'fr-FR': 'Gratuit', 'en-US': 'Free' };

export function formatPrice(locale: Locale, price: number, currency: Currency): string {
  if (price === 0) return i18nStringFree[locale];
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(price);
}
