import { ServerError } from '../error';
import debug from 'debug';

import { isRedirectError } from 'next/dist/client/components/redirect';
import { getTranslations } from 'next-intl/server';

import type { NextBaseServerAction, ServerAction } from '@okampus/shared/types';

const debugLog = debug('okampus:server:withErrorHandling');
debug.enable('okampus:server:withErrorHandling');

export function withErrorHandling<T>(action: NextBaseServerAction<T>): ServerAction<T> {
  return async (formData: FormData) => {
    const t = await getTranslations();

    try {
      const state = await action(formData);
      return state === undefined ? {} : { data: state };
    } catch (error) {
      if (isRedirectError(error)) throw error;

      debugLog({ error });
      if (error instanceof ServerError) {
        const message = t(`ServerErrors.${error.key}`);
        if (error.context?.field) return { errors: { [error.context.field]: message } };
        return { errors: { root: message } };
      }

      return { errors: { root: t('ServerErrors.UNKNOWN_ERROR') } };
    }
  };
}
