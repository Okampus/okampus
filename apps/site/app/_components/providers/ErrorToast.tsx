'use client';

import { ErrorCode } from '../../../server/error';
import { useTranslation } from '../../_hooks/context/useTranslation';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';

import type { Locale } from '../../../config/i18n';

const unauthorizedMessage: Record<Locale, string> = {
  'fr-FR': 'Vous devez vous connecter pour accéder à cette page.',
  'en-US': 'You must be signed in to access this page.',
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
  const { locale } = useTranslation();
  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  if (
    error === ErrorCode.Unauthorized ||
    error === ErrorCode.Forbidden ||
    error === ErrorCode.InternalServerError ||
    error === ErrorCode.NotFound
  )
    toast.error(errorMessages[error][locale], { duration: 5000 });

  return null;
}
