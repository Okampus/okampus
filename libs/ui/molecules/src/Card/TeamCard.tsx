import React from 'react';
import { Avatar } from '@okampus/ui/atoms';

type Tag = {
  name: string;
  color: string;
};

type TeamCardProps = {
  name: string;
  description?: string | null;
  tags?: Tag[];
};

export function TeamCard({ name, description, tags = [] }: TeamCardProps) {
  return (
    <div className="flex flex-col border border-color-2 rounded-lg bg-2">
      <img
        src={
          Math.random() > 0.25
            ? 'https://picsum.photos/300/100'
            : Math.random() > 0.5
            ? 'https://picsum.photos/300/101'
            : Math.random() > 0.5
            ? 'https://picsum.photos/300/102'
            : 'https://picsum.photos/300/103'
        }
        alt=""
        className="rounded-t-lg"
      />
      <div className="pt-3 pb-5 px-4 flex flex-col gap-2">
        <div className="text-0 flex gap-2 items-center">
          <Avatar name={name} />
          {name}
        </div>
        {description && <div className="text-2">{description}</div>}
        <div className="mt-2 flex gap-2 flex-wrap items-center">
          {tags.map((tag) => (
            <div className="rounded-lg text-white py-0.5 px-2 text-sm" style={{ backgroundColor: tag.color }}>
              {tag.name}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
