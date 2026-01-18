import type { Customer } from '../../../prisma/generated/client.js';
import type { ContactOptionsType } from '../enums/contact-options-type.enum.js';
import type { InterestType } from '../enums/interest-type.enum.js';
import type { StatusType } from '../enums/status-type.enum.js';
import type { CustomerPayload } from '../payload/customer.payload.js';

export class CustomerMapper {
  static toPayload(customer: Customer): CustomerPayload {
    return {
      id: customer.id,
      tierLevel: customer.tierLevel,
      subscribed: customer.subscribed,
      state: customer.state as StatusType,
      interests: customer.interests as InterestType[],
      contactOptions: customer.contactOptions as ContactOptionsType[],
    };
  }
}
