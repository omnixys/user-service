// TODO resolve eslint
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';

@Module({
  imports: [
    HttpModule.register({
      timeout: 10000,
      maxRedirects: 5,
    }),
  ],
  exports: [HttpModule],
})
export class HttpModule {}
