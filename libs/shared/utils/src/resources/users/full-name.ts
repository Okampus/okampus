export function fullName(firstName: string, ...middleAndLastName: string[]): string {
  return `${firstName} ${middleAndLastName.join(' ')}`.trim();
}
