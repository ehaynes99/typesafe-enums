type InvalidKeys = keyof ReturnType<typeof createMethods<any>>

type EnumValues =
  | Record<string, string>
  | Record<string, number>
  | Record<string, symbol>

/**
 * Prevents using the same value twice under different keys.
 * Prevents using any of the enum's method names as keys
 */
type ValidValues<Values extends EnumValues> = {
  [K in keyof Values]: Values[K] extends Values[Exclude<keyof Values, K>]
    ? 'All values must be unique'
    : K extends InvalidKeys
    ? 'Keys can not include Enum method names'
    : Values[K]
}

type KeyOf<Values extends EnumValues, V extends Values[keyof Values]> = keyof {
  [K in keyof Values as Values[K] extends V ? K : never]: Values[K]
}

export type Enum<Values extends EnumValues> = Values &
  ReturnType<typeof createMethods<Values>>

export type EnumKey<E extends Enum<any>> = E extends Enum<infer Values>
  ? keyof Values
  : never

export type EnumValue<E extends Enum<any>> = E extends Enum<infer Values>
  ? Values[keyof Values]
  : never

const createMethods = <Values extends Record<string, any>>(values: Values) => {
  values = { ...values }
  const enumKeys = new Set<keyof Values>(Object.keys(values))
  const enumValues = new Set<Values[keyof Values]>(Object.values(values))

  if (enumValues.size !== enumKeys.size) {
    throw new TypeError('Enumerated values must be unique')
  }

  const reverseMapping = Object.fromEntries(
    Object.entries(values).map(([key, value]) => [value, key]),
  )

  const methods = {
    keys: () => [...enumKeys],
    values: () => [...enumValues],
    isKey: (maybeKey: unknown): maybeKey is keyof Values => {
      return enumKeys.has(maybeKey as any)
    },
    isValue: (maybeValue: unknown): maybeValue is Values[keyof Values] => {
      return enumValues.has(maybeValue as any)
    },
    keyOf: <V extends Values[keyof Values]>(value: V): KeyOf<Values, V> => {
      return reverseMapping[value]
    },
  }

  for (const methodName in methods) {
    if (enumKeys.has(methodName)) {
      throw new TypeError(
        `Names of enum methods are reserved: ${Object.keys(methods).sort}`,
      )
    }
  }
  return methods
}

export const createEnum = <Values extends EnumValues>(
  values: ValidValues<Values>,
): Enum<Values> => {
  values = { ...values }
  const methods = createMethods(values)

  return Object.freeze(
    Object.defineProperties(
      values,
      Object.entries(methods).reduce<Record<string, PropertyDescriptor>>(
        (result, [name, method]) => {
          result[name] = {
            enumerable: false,
            value: method,
          }
          return result
        },
        {},
      ),
    ),
  ) as Enum<Values>
}
