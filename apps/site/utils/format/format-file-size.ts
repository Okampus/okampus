import { formatAsBytes, formatAsOctets } from '@okampus/shared/utils';
import type { Locale } from '../../server/ssr/getLang';

export function formatFileSize(locale: Locale, size: number) {
  return locale === 'fr-FR' ? formatAsOctets(size) : formatAsBytes(size);
}
