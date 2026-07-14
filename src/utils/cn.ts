export type ClassValue = string | number | boolean | undefined | null | ClassValue[];

export function cn(...inputs: ClassValue[]): string {
  const out: string[] = [];
  const walk = (val: ClassValue) => {
    if (!val) return;
    if (typeof val === 'string' || typeof val === 'number') {
      out.push(String(val));
    } else if (Array.isArray(val)) {
      val.forEach(walk);
    }
  };
  inputs.forEach(walk);
  return out.join(' ');
}
