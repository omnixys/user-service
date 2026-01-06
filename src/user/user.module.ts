import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { SecurityResolver } from './resolvers/security.resolver.js';
import { UserFieldsResolver } from './resolvers/user-fields.resolver.js';
import { UserMutationResolver } from './resolvers/user-mutation.resolver.js';
import { UserQueryResolver } from './resolvers/user-query.resolver.js';
import { SecurityService } from './services/security.service.js';
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
    SecurityResolver,
    SecurityService,
    UserFieldsResolver,
  ],
  exports: [UserWriteService, UserReadService],
})
export class UserModule {}
