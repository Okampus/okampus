'use client';

import { ErrorCode } from '../../../server/error';

import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { toast } from 'sonner';

import type { Locale } from '../../../server/ssr/getLang';

const unauthorizedMessage: Record<Locale, string> = {
  'fr-FR': 'Vous devez vous connecter pour accéder à cette page.',
  'en-US': 'You must be signed in order to access this page.',
};

const forbiddenMessage: Record<Locale, string> = {
  'fr-FR': "Vous n'avez pas accès à cette page.",
  'en-US': "You don't have access to this page.",
};

const notFoundErrorMessage: Record<Locale, string> = {
  'fr-FR': 'Ressource non trouvée.',
  'en-US': 'Resource not found.',
};

const internalServerErrorMessage: Record<Locale, string> = {
  'fr-FR': 'Une erreur est survenue.',
  'en-US': 'An error has occurred.',
};

const errorMessages = {
  [ErrorCode.Unauthorized]: unauthorizedMessage,
  [ErrorCode.Forbidden]: forbiddenMessage,
  [ErrorCode.NotFound]: notFoundErrorMessage,
  [ErrorCode.InternalServerError]: internalServerErrorMessage,
};

export default function ErrorToast() {
  const locale = useLocale() as Locale;
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  if (
    error === ErrorCode.Unauthorized ||
    error === ErrorCode.Forbidden ||
    error === ErrorCode.InternalServerError ||
    error === ErrorCode.NotFound
  ) {
    setTimeout(() => toast.error(errorMessages[error][locale], { duration: 5000 }), 100);
  }

  return null;
}
