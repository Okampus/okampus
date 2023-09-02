import type { SocialType, TeamType } from '@okampus/shared/enums';

type SocialData = {
  pseudo: string;
  type: SocialType;
  url: string;
};

export type TeamData = {
  name: string;
  type: TeamType;
  socials: SocialData[];
  email?: string;
  website?: string;
  status?: string;
  bio?: string;
  categories?: string[];
  slug?: string;
  avatar?: Buffer | null;
  parent?: string;
  originalCreationDay?: number;
  originalCreationMonth?: number;
  originalCreationYear?: number;
  bankInfo?: {
    bankName: string;
    bicSwift: string;
    iban: string;
  };
};
