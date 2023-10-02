'use client';

import { IconPlus } from '@tabler/icons-react';

export type AddItemProps = { label: string; onClick: () => void };

export default function AddItem({ label, onClick }: AddItemProps) {
  return (
    <div
      className="flex items-center px-5 py-3 gap-4 hover:bg-[var(--bg-1)] border rounded-lg border-color-3 cursor-pointer"
      onClick={onClick}
    >
      <IconPlus className="h-6 aspect-square text-2" />
      <div className="w-full flex items-start justify-between gap-4">
        <div className="font-medium line-clamp-1">{label}</div>
        <span className="add-button">Ajouter</span>
      </div>
    </div>
  );
}
