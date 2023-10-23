import { getNextLang } from '../../ssr/getLang';
import { getTranslation } from '../../ssr/getTranslation';
import { ServerError } from '../../error';
import { isRedirectError } from 'next/dist/client/components/redirect';

import type { NextFormMessages, NextBaseServerAction, NextServerAction } from '../../types';

export function wrapAction<T>(action: NextBaseServerAction<T>): NextServerAction<T> {
  return async (previousState: NextFormMessages<T>, formData: FormData) => {
    const { t } = await getTranslation(getNextLang());

    try {
      const state = await action(previousState, formData);
      return state ?? {};
    } catch (error) {
      console.log({ error });
      if (isRedirectError(error)) throw error;

      if (error instanceof ServerError) {
        const message = t('server-errors', error.key, error.context);
        if (error.context?.field) return { errors: { [error.context.field]: message } };
        return { errors: { root: message } };
      }
      return { errors: { root: t('server-errors', 'UNKNOWN_ERROR') } };
    }
  };
}
