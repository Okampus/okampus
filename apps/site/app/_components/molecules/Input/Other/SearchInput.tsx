'use client';

import { MagnifyingGlass } from '@phosphor-icons/react';
import clsx from 'clsx';
import { useRef, useState } from 'react';

export type SearchInputProps = {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  placeholder?: string;
};

export default function SearchInput({ value, onChange, className, placeholder }: SearchInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const ref = useRef<HTMLInputElement>(null);

  return (
    <div
      className={clsx(className, 'input cursor-pointer', isFocused && 'focus')}
      onFocus={() => ref.current?.focus()}
      onClick={() => ref.current?.focus()}
    >
      <MagnifyingGlass className="mr-2" />
      <input
        type="text"
        ref={ref}
        className="w-full h-full outline-none bg-transparent"
        placeholder={placeholder ?? 'Rechercher'}
        value={value}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}
