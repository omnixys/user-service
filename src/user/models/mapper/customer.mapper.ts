import type { ContactOptionsType, StatusType } from '@omnixys/shared';
import { Customer } from '../../../prisma/generated/client.js';
import { CustomerPayload } from '../payload/customer.payload.js';

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
