import { registerEnumType } from '@nestjs/graphql';

export enum Colors {
  Amber = 'amber',
  Blue = 'blue',
  Cyan = 'cyan',
  Emerald = 'emerald',
  Fuchsia = 'fuchsia',
  Gray = 'gray',
  Green = 'green',
  Indigo = 'indigo',
  Lime = 'lime',
  Neutral = 'neutral',
  Orange = 'orange',
  Pink = 'pink',
  Purple = 'purple',
  Red = 'red',
  Rose = 'rose',
  Sky = 'sky',
  Slate = 'slate',
  Stone = 'stone',
  Teal = 'teal',
  Violet = 'violet',
  Yellow = 'yellow',
  Zinc = 'zinc',
}

registerEnumType(Colors, { name: 'Colors' });
