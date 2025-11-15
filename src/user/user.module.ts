import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { UserMutationResolver } from './resolvers/user-mutation.resolver.js';
import { UserQueryResolver } from './resolvers/user-query.resolver.js';
import { UserReadService } from './services/user-read.service.js';
import { UserWriteService } from './services/user-write.service.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule, PrismaModule],
  providers: [
    UserMutationResolver,
    UserQueryResolver,
    UserWriteService,
    UserReadService,
  ],
  exports: [UserWriteService, UserReadService],
})
export class UserModule {}
