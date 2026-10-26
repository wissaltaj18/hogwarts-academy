/**
 * Legacy TypeScript method decorators.
 * Requires "experimentalDecorators": true in tsconfig.json.
 */
export function Log(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (...args: any[]) => any;

  descriptor.value = function (this: unknown, ...args: any[]): any {
    console.log(`[CALL] ${String(propertyKey)}`, args);
    try {
      const result = originalMethod.apply(this, args);
      console.log(`[RETURN] ${String(propertyKey)}`, result);
      return result;
    } catch (error: unknown) {
      console.error(`[ERROR] ${String(propertyKey)}`, error);
      throw error;
    }
  };
}

export function MeasureTime(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (...args: any[]) => any;

  descriptor.value = function (this: unknown, ...args: any[]): any {
    const start = Date.now();
    try {
      return originalMethod.apply(this, args);
    } finally {
      console.log(`[TIME] ${String(propertyKey)}: ${Date.now() - start} ms`);
    }
  };
}

/** Exercise 4: reject spells with negative power. */
export function ValidateSpellPower(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (...args: any[]) => any;

  descriptor.value = function (this: unknown, ...args: any[]): any {
    const spell = args[0] as { power?: unknown } | undefined;
    if (
      spell &&
      typeof spell.power === "number" &&
      spell.power < 0
    ) {
      throw new Error("Spell power cannot be negative");
    }
    return originalMethod.apply(this, args);
  };
}

/** Exercise 5: cache synchronous method results per object instance and arguments. */
export function Cache(
  target: object,
  propertyKey: string | symbol,
  descriptor: PropertyDescriptor
): void {
  const originalMethod = descriptor.value as (...args: any[]) => any;
  const cacheByInstance = new WeakMap<object, Map<string, unknown>>();

  descriptor.value = function (this: object, ...args: any[]): any {
    let instanceCache = cacheByInstance.get(this);
    if (!instanceCache) {
      instanceCache = new Map<string, unknown>();
      cacheByInstance.set(this, instanceCache);
    }

    const key = JSON.stringify(args);
    if (instanceCache.has(key)) {
      console.log(`[CACHE HIT] ${String(propertyKey)}`, args);
      return instanceCache.get(key);
    }

    const result = originalMethod.apply(this, args);
    instanceCache.set(key, result);
    console.log(`[CACHE MISS] ${String(propertyKey)}`, args);
    return result;
  };
}
