import { registerEnumType } from '@nestjs/graphql';

export enum InterestCategoryEnum {
  SPORTS = 'SPORTS',
  MUSIC = 'MUSIC',
  FINANCE = 'FINANCE',
  REAL_ASSETS = 'REAL_ASSETS',
  TECHNOLOGY = 'TECHNOLOGY',
  LIFESTYLE = 'LIFESTYLE',
}

registerEnumType(InterestCategoryEnum, { name: 'InterestCategoryEnum' });
