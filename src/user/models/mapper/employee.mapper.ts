import type { Employee } from '../../../prisma/generated/client.js';
import { n2u } from '../../utils/null-to-undefined.js';
import type { EmployeePayload } from '../payload/employee.payload.js';

export class EmployeeMapper {
  static toPayload(employee: Employee): EmployeePayload {
    return {
      id: employee.id,
      department: n2u(employee.department),
      position: n2u(employee.position),
      role: n2u(employee.role),
      salary: n2u(employee.salary),
      hireDate: n2u(employee.hireDate),
      isExternal: employee.isExternal,
    };
  }
}
