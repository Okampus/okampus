'use client';

import ActionButton from '../../molecules/Button/ActionButton';
import { notificationAtom } from '../../../_context/global';

import { ActionType, ToastType } from '@okampus/shared/types';
import { deepEqual, isNotNull, objectFilter } from '@okampus/shared/utils';

import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useAtom } from 'jotai';
import { useEffect, useState } from 'react';

export type Errors = Record<string, Error | null>;
export type FormProps<T extends Record<string, unknown>> = {
  initialValues: T;
  onSubmit: (values: Partial<T>) => void;
  className?: string;
  onCancel?: () => void;
  renderChildren: (props: {
    checkingValues: Record<string, boolean | undefined>;
    changeCheckingValues: (checkingValues: Record<string, boolean | undefined>) => void;
    values: T;
    changeValues: (newValues: (current: T) => T) => void;
    changeErrors: (errors: Errors) => void;
  }) => React.ReactNode;
  checkFields?: boolean | Array<string>;
};

export default function Form<T extends Record<string, unknown>>({
  initialValues,
  onSubmit,
  className = 'relative flex flex-col',
  onCancel,
  renderChildren,
  checkFields = true,
}: FormProps<T>) {
  const [, setNotification] = useAtom(notificationAtom);

  const [currentInitialValues, setCurrentInitialValues] = useState<T>(initialValues);
  const [isValidating, setIsValidating] = useState(false);
  const [values, setValues] = useState<T>(structuredClone(initialValues));
  const [errors, setErrors] = useState<Errors>({});

  const checkFieldsDep = Array.isArray(checkFields) ? checkFields.length : checkFields;

  const [checkingValues, setCheckingValues] = useState<Record<string, boolean | undefined>>({});
  useEffect(() => {
    if (checkFields)
      setCheckingValues(
        Array.isArray(checkFields)
          ? Object.fromEntries(checkFields.map((key) => [key, true]))
          : Object.fromEntries(Object.keys(values).map((key) => [key, true])),
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [checkFieldsDep]);

  const changeErrors = (newErrors: Errors) => setErrors((current) => ({ ...current, ...newErrors }));
  const changeValues = (newValues: (current: T) => T) => setValues(newValues);
  const changeCheckingValues = (newCheckingValues: Record<string, boolean | undefined>) => {
    setCheckingValues((current) => ({ ...current, ...newCheckingValues }));
  };

  const differentKeys = new Set(Object.keys(values).filter((key) => !deepEqual(values[key], initialValues[key], true)));
  const changeSet = objectFilter(values, (key) => typeof key === 'string' && differentKeys.has(key));

  useEffect(() => {
    if (!deepEqual(initialValues, currentInitialValues, true)) {
      setCurrentInitialValues(structuredClone(initialValues));
      setValues(structuredClone(initialValues));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialValues]);

  useEffect(() => {
    if (isValidating && !Object.values(checkingValues).some(Boolean)) {
      setIsValidating(false);
      if (Object.values(errors).some(isNotNull)) {
        setNotification({ type: ToastType.Error, message: 'Veuillez corriger les erreurs avant de sauvegarder.' });
      } else {
        onSubmit(changeSet);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isValidating, checkingValues]);

  const resetChecking = () => {
    setCheckingValues(
      Object.fromEntries(
        Object.entries(checkingValues).map(([key, value]) => [key, value === undefined ? undefined : true]),
      ),
    );
  };

  return (
    <div className={className}>
      {renderChildren({ checkingValues, changeCheckingValues, values, changeValues, changeErrors })}
      <AnimatePresence>
        {differentKeys.size > 0 &&
          !Object.values(errors).some(isNotNull) &&
          !Object.values(checkingValues).some(Boolean) && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className={clsx(
                'left-0 md:left-1/2 md:-translate-x-1/2 md-max:w-screen md-max:bottom-0',
                'fixed z-20 bottom-4 md:rounded-xl flex justify-between items-center font-semibold text-sm text-1 md:gap-20 pl-6 pr-4 py-2.5 bg-2 shadow-2xl',
              )}
            >
              <div className="shrink-0">Sauvegarder ?</div>
              <div className="flex gap-4 shrink-0">
                <ActionButton
                  small={true}
                  action={{
                    label: 'Annuler',
                    linkOrActionOrMenu: () => (setValues(initialValues), onCancel?.(), resetChecking()),
                  }}
                />
                <ActionButton
                  small={true}
                  action={{
                    label: 'Sauvegarder',
                    type: ActionType.Success,
                    linkOrActionOrMenu: () => (setIsValidating(true), resetChecking()),
                  }}
                />
              </div>
            </motion.div>
          )}
      </AnimatePresence>
    </div>
  );
}
