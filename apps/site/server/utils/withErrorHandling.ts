import { getTranslation } from '../ssr/getTranslation';
import { ServerError } from '../error';
import { isRedirectError } from 'next/dist/client/components/redirect';

import type { FormMessages, NextBaseServerAction, ServerAction } from '../actions/types';

export function withErrorHandling<T>(action: NextBaseServerAction<T>): ServerAction<T> {
  return async (previousState: FormMessages<T>, formData: FormData) => {
    const { t } = await getTranslation();

    // TODO: zod error handling (400), auth errors (401, 403), server errors (500)

    try {
      const state = await action(previousState, formData);
      return state ?? {};
    } catch (error) {
      if (isRedirectError(error)) throw error;

      if (process.env.NODE_ENV !== 'production') console.error({ error });

      if (error instanceof ServerError) {
        const message = t('server-errors', error.key, error.context);
        if (error.context?.field) return { errors: { [error.context.field]: message } };
        return { errors: { root: message } };
      }

      return { errors: { root: t('server-errors', 'UNKNOWN_ERROR') } };
    }
  };
}
