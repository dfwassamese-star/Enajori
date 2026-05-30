/** Firestore-safe timestamp for the current moment */
export function createTimestamp() {
  return { seconds: Math.floor(Date.now() / 1000), nanoseconds: 0 };
}

/** Remove undefined values from an object (Firestore rejects undefined) */
export function stripUndefined<T extends Record<string, unknown>>(obj: T): T {
  return Object.fromEntries(
    Object.entries(obj).filter(([, v]) => v !== undefined)
  ) as T;
}

/** Deep version — also recurses into nested objects */
export function stripUndefinedDeep<T extends Record<string, unknown>>(obj: T): T {
  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
      const nested = stripUndefinedDeep(value as Record<string, unknown>);
      if (Object.keys(nested).length > 0) result[key] = nested;
    } else {
      result[key] = value;
    }
  }
  return result as T;
}
