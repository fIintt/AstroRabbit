export function toObject(value: unknown): Record<string, unknown> {
  const isRecord = (value: unknown): value is Record<string, unknown> => {
    return value !== null && typeof value === "object" && !Array.isArray(value);
  };

  return isRecord(value) ? value : {};
}

export function toString(value: unknown): string {
  return typeof value === "string" ? value : String(value ?? "");
}

export function toJSON(value: unknown): string {
  return typeof value === "string" ? value : JSON.stringify(value, null, 2);
}

export function toNumber(value: unknown): number {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export function toArray(value: unknown): string[] {
  return Array.isArray(value) ? value : [];
}