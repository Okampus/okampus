'use client';

import { List } from '@phosphor-icons/react';

export default function SidebarButton() {
  return (
    <button
      type="button"
      className="md:hidden"
      onClick={() => document.querySelector('#sidebar')?.classList.toggle('active')}
    >
      <List className="h-6 w-6" />
    </button>
  );
}
