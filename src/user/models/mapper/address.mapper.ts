import type { Address } from '../../../prisma/generated/client.js';
import { n2u } from '../../utils/null-to-undefined.js';
import type { AddressPayload } from '../payload/address.payload.js';

export class AddressMapper {
  static toPayload(address: Address): AddressPayload {
    return {
      id: address.id,
      street: address.street,
      houseNumber: address.houseNumber,
      zipCode: address.zipCode,
      city: address.city,
      state: n2u(address.state),
      country: address.country,
      additionalInfo: n2u(address.additionalInfo),
    };
  }

  static toPayloadList(list: Address[]): AddressPayload[] {
    return list.map((address) => this.toPayload(address));
  }
}
