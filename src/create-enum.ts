type ValidKeys = Exclude<string, 'isKey' | 'isValue'>

type EnumValues =
  | Record<ValidKeys, string>
  | Record<ValidKeys, number>
  | Record<ValidKeys, symbol>

export type Enum<Values extends EnumValues> = Values & {
  isKey(maybeKey: unknown): maybeKey is keyof Values
  isValue(maybeValue: unknown): maybeValue is Values[keyof Values]
}

export type EnumKey<E extends Enum<any>> = E extends Enum<infer Values>
  ? keyof Values
  : never

export type EnumValue<E extends Enum<any>> = E extends Enum<infer Values>
  ? Values[keyof Values]
  : never

export const createEnum = <Values extends EnumValues>(
  values: Values,
): Enum<Values> => {
  values = { ...values }
  const enumKeys = new Set(Object.keys(values))
  const enumValues = new Set(Object.values(values))

  return Object.freeze(
    Object.assign(values, {
      isKey(maybeKey: unknown): maybeKey is keyof Values {
        return enumKeys.has(maybeKey as any)
      },
      isValue(maybeValue: unknown): maybeValue is Values[keyof Values] {
        return enumValues.has(maybeValue as any)
      },
    }),
  )
}
