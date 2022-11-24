import { registerEnumType } from '@nestjs/graphql';

export enum Colors {
  Amber = 'Amber',
  Blue = 'Blue',
  Cyan = 'Cyan',
  Emerald = 'Emerald',
  Fuchsia = 'Fuchsia',
  Gray = 'Gray',
  Green = 'Green',
  Indigo = 'Indigo',
  Lime = 'Lime',
  Neutral = 'Neutral',
  Orange = 'Orange',
  Pink = 'Pink',
  Purple = 'Purple',
  Red = 'Red',
  Rose = 'Rose',
  Sky = 'Sky',
  Slate = 'Slate',
  Stone = 'Stone',
  Teal = 'Teal',
  Violet = 'Violet',
  Yellow = 'Yellow',
  Zinc = 'Zinc',
}

registerEnumType(Colors, { name: 'Colors' });