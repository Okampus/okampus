'use server';

import type { FormMessages, ServerAction, WrappedActionContext } from '../actions/types';

type OptimisticContext<T> = {
  setOptimistic: (data: T) => void;
};
export function withOptimistic<T extends Record<string, unknown>>(
  wrappedAction: (context: WrappedActionContext<T>, optimistic: OptimisticContext<T>) => Promise<FormMessages<T>>,
): (context: OptimisticContext<T>) => ServerAction<T> {
  return ({ setOptimistic }: OptimisticContext<T>) =>
    async (previousState, formData: FormData) => {
      const optimisticState = await wrappedAction({ previousState, formData }, { setOptimistic });
      return optimisticState;
    };
}
