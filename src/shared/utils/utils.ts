import { Role } from "../enums/role.enum";

export function getRoleByIndex(index: number): Role | undefined {
  const roleValues = Object.values(Role);
  return roleValues[index - 1];
}

export function convertPhoneToInternational(phoneNumber: string): string {
  if (phoneNumber.startsWith('0')) {
    return '+84' + phoneNumber.substring(1);
  } else {
    return '+84' + phoneNumber;
  }
}
