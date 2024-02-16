'use client';

import Field from '../../Field';
import { useUncontrolledInputConfig } from '../../../../../_hooks/useUncontrolledInputConfig';
import { forwardRef, memo, useImperativeHandle, useRef } from 'react';
import type { UncontrolledInput } from '@okampus/shared/types';

export type TextAreaInputProps = UncontrolledInput<string> & { onChange?: (value: string) => void; rows?: number };
export default memo(
  forwardRef<HTMLTextAreaElement, TextAreaInputProps>(function TextAreaInput(props, forwardedRef) {
    const localRef = useRef<HTMLTextAreaElement>();
    const { onChange, defaultValue, disabled, placeholder, rows, ...field } = props;

    const { ref, ...registerProps } = useUncontrolledInputConfig({ name: field.name, ...(onChange && { onChange }) });

    useImperativeHandle(ref, () => localRef.current as HTMLTextAreaElement);
    useImperativeHandle(forwardedRef, () => localRef.current as HTMLTextAreaElement);

    const a11yProps = { 'aria-invalid': typeof field.error === 'string', 'aria-description': field.description };
    const inputProps = { disabled, placeholder, defaultValue, className: 'input !h-auto !max-h-max', rows };

    const input = <textarea {...registerProps} {...a11yProps} {...inputProps} />;
    return <Field {...field}>{input}</Field>;
  }),
);
