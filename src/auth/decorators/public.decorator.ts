/* eslint-disable @typescript-eslint/explicit-function-return-type */
// TODO Resolve eslint

import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
