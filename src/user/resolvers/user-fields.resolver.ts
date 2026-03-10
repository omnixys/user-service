/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { Resolver, ResolveField, Parent } from '@nestjs/graphql';

import { ContactPayload } from '../models/payload/contact.payload.js';
import { CustomerPayload } from '../models/payload/customer.payload.js';
import { EmployeePayload } from '../models/payload/employee.payload.js';
import { PersonalInfoPayload } from '../models/payload/personal-info.payload.js';
import { UserPayload } from '../models/payload/user.payload.js';
import { UserReadService } from '../services/user-read.service.js';
import { ContactMapper } from '../models/mapper/contact.mapper.js';
import { CustomerMapper } from '../models/mapper/customer.mapper.js';
import { EmployeeMapper } from '../models/mapper/employee.mapper.js';
import { PersonalInfoMapper } from '../models/mapper/personal-info.mapper.js';

@Resolver(() => UserPayload)
export class UserFieldsResolver {
  constructor(private readonly readService: UserReadService) {}

  /* ------------------------------------------------------------------
   * PersonalInfo (1:1)
   * ------------------------------------------------------------------ */
  @ResolveField(() => PersonalInfoPayload, { nullable: true })
  async personalInfo(@Parent() user: UserPayload) {
    const entity = await this.readService.getPersonalInfo(user.id);
    return entity ? PersonalInfoMapper.toPayload(entity) : null;
  }

  /* ------------------------------------------------------------------
   * Contacts (Person ↔ Person)
   * ------------------------------------------------------------------ */
  @ResolveField(() => [ContactPayload], { nullable: true })
  async contacts(@Parent() user: UserPayload) {
    const entities = await this.readService.getContacts(user.id);
    return ContactMapper.toPayloadList(entities);
  }

  /* ------------------------------------------------------------------
   * Customer Extension (optional)
   * ------------------------------------------------------------------ */
  @ResolveField(() => CustomerPayload, { nullable: true })
  async customer(@Parent() user: UserPayload) {
    const entity = await this.readService.getCustomer(user.id);
    return entity ? CustomerMapper.toPayload(entity) : null;
  }

  /* ------------------------------------------------------------------
   * Employee Extension (optional)
   * ------------------------------------------------------------------ */
  @ResolveField(() => EmployeePayload, { nullable: true })
  async employee(@Parent() user: UserPayload) {
    const entity = await this.readService.getEmployee(user.id);
    return entity ? EmployeeMapper.toPayload(entity) : null;
  }
}
