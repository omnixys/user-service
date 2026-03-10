import { AuthModule } from '../auth/auth.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { ValkeyModule } from '../valkey/valkey.module.js';
import { CustomerFieldsResolver } from './resolvers/customer-field.resolver.js';
import { CustomerInterestFieldsResolver } from './resolvers/customer-interest-field.resolver.js';
import { InteresCategoryFieldsResolver } from './resolvers/interest-category-field.resolver.js';
import { PersonalInfoFieldsResolver } from './resolvers/personal-info-fields.resolver.js';
import { RegisterResolver } from './resolvers/registration.resolver.js';
import { UserFieldsResolver } from './resolvers/user-fields.resolver.js';
import { UserMutationResolver } from './resolvers/user-mutation.resolver.js';
import { UserQueryResolver } from './resolvers/user-query.resolver.js';
import { RegisterService } from './services/register.service.js';
import { UserReadService } from './services/user-read.service.js';
import { UserWriteService } from './services/user-write.service.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [AuthModule, PrismaModule, ValkeyModule],
  providers: [
    RegisterResolver,
    UserMutationResolver,
    UserQueryResolver,

    CustomerFieldsResolver,
    UserFieldsResolver,
    CustomerInterestFieldsResolver,
    PersonalInfoFieldsResolver,
    InteresCategoryFieldsResolver,

    UserWriteService,
    UserReadService,
    RegisterService,
  ],
  exports: [UserWriteService, UserReadService, RegisterService],
})
export class UserModule {}
