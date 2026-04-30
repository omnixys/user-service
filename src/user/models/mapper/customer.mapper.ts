import type { Customer } from '../../../prisma/generated/client.js';
import type { CustomerPayload } from '../payload/customer.payload.js';
import type { ContactOptionsType, StatusType } from '@omnixys/shared';

export class CustomerMapper {
  static toPayload(customer: Customer): CustomerPayload {
    return {
      id: customer.id,
      subscribed: customer.subscribed,
      state: customer.state as StatusType,
      contactOptions: customer.contactOptions as ContactOptionsType[],
      updatedAt: customer.updatedAt,
      createdAt: customer.createdAt,
    };
  }
}
