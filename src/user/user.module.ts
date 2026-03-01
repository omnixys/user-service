import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ValkeyModule } from '../valkey/valkey.module.js';
import { RegisterResolver } from './resolvers/registration.resolver.js';
import { SecurityResolver } from './resolvers/security.resolver.js';
import { UserFieldsResolver } from './resolvers/user-fields.resolver.js';
import { UserMutationResolver } from './resolvers/user-mutation.resolver.js';
import { UserQueryResolver } from './resolvers/user-query.resolver.js';
import { RegisterService } from './services/register.service.js';
import { SecurityService } from './services/security.service.js';
import { UserReadService } from './services/user-read.service.js';
import { UserWriteService } from './services/user-write.service.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule, PrismaModule, ValkeyModule],
  providers: [
    RegisterResolver,
    UserMutationResolver,
    UserQueryResolver,
    UserFieldsResolver,
    SecurityResolver,

    UserWriteService,
    UserReadService,
    SecurityService,
    RegisterService,
  ],
  exports: [UserWriteService, UserReadService, RegisterService],
})
export class UserModule {}
