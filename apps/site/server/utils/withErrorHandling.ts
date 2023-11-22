import { getTranslation } from '../ssr/getTranslation';
import { ServerError } from '../error';
import { isRedirectError } from 'next/dist/client/components/redirect';

import debug from 'debug';

import type { NextBaseServerAction, ServerAction } from '@okampus/shared/types';

const debugLog = debug('okampus:server:withErrorHandling');
debug.enable('okampus:server:withErrorHandling');

export function withErrorHandling<T>(action: NextBaseServerAction<T>): ServerAction<T> {
  return async (formData: FormData) => {
    const { t } = await getTranslation();

    try {
      const state = await action(formData);
      return state === undefined ? {} : { data: state };
    } catch (error) {
      if (isRedirectError(error)) throw error;

      debugLog({ error });
      if (error instanceof ServerError) {
        const message = t('server-errors', error.key, error.context);
        if (error.context?.field) return { errors: { [error.context.field]: message } };
        return { errors: { root: message } };
      }

      return { errors: { root: t('server-errors', 'UNKNOWN_ERROR') } };
    }
  };
}
