/**
 * EMPLOYEE TABLE SEED DATA
 * ------------------------------------------------------------
 * 1:1 extension of User
 * Employee.id === User.id
 * ------------------------------------------------------------
 */
export const EMPLOYEES = [
  // ---------------------------------------------------------------------------
  // ADMIN
  // ---------------------------------------------------------------------------
  {
    id: 'dde8114c-2637-462a-90b9-413924fa3f55',
    department: 'Management',
    position: 'System Administrator',
    role: 'ADMIN',
    salary: 85000,
    hireDate: new Date('2020-01-01'),
    isExternal: false,
  },

  // ---------------------------------------------------------------------------
  // SECURITY
  // ---------------------------------------------------------------------------
  {
    id: '20e7e44e-9bcd-4016-bebd-36f8d75357b6',
    department: 'Security',
    position: 'Security Officer',
    role: 'SECURITY',
    salary: 52000,
    hireDate: new Date('2021-06-01'),
    isExternal: false,
  },
] as const;
