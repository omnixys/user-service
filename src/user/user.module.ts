import { UserMutationResolver } from './resolvers/user-mutation.resolver.js';
import { UserQueryResolver } from './resolvers/user-query.resolver.js';
import { UserReadService } from './services/user-read.service.js';
import { UserWriteService } from './services/user-write.service.js';
import { Module } from '@nestjs/common';

@Module({
  imports: [],
  providers: [
    UserMutationResolver,
    UserQueryResolver,
    UserWriteService,
    UserReadService,
  ],
})
export class UserModule {}
