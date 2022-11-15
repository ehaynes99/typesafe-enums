import { createEnum } from '../src/create-enum'

describe('Enum', () => {
  const TestEnum = createEnum({
    First: 'one',
    Second: 'two',
    Third: 'three',
  })

  it('has values from original', async () => {
    expect(TestEnum.First).toBe('one')
    expect(TestEnum.Second).toBe('two')
    expect(TestEnum.Third).toBe('three')
  })

  it('checks if random value is a key', async () => {
    expect(TestEnum.isKey('First')).toBe(true)
    expect(TestEnum.isKey('seventh')).toBe(false)
  })

  it('checks if random value is a value', async () => {
    expect(TestEnum.isValue('one')).toBe(true)
    expect(TestEnum.isValue('seven')).toBe(false)
  })

  it('performs a reverse lookup of values', async () => {
    const keyOfOne: 'First' = TestEnum.keyOf('one')
    expect(keyOfOne).toBe('First')
    const keyOfTwo: 'Second' = TestEnum.keyOf('two')
    expect(keyOfTwo).toBe('Second')
    const keyOfThree: 'Third' = TestEnum.keyOf('three')
    expect(keyOfThree).toBe('Third')
  })

  it('enumerates the keys', async () => {
    const keys = TestEnum.keys()
    expect(keys).toEqual(['First', 'Second', 'Third'])
  })

  it('enumerates the values', async () => {
    const values = TestEnum.values()
    expect(values).toEqual(['one', 'two', 'three'])
  })

  it('has only the enum keys as enumerable properties', async () => {
    const keys = Object.keys(TestEnum)
    expect(keys).toEqual(['First', 'Second', 'Third'])
  })

  it('has only the enum values as enumerable properties', async () => {
    const keys = Object.values(TestEnum)
    expect(keys).toEqual(['one', 'two', 'three'])
  })

  it('throws an error if keys include and enum method name', async () => {
    expect(() => {
      createEnum({
        // @ts-expect-error restricted method name as key
        keys: 'keys-value',
        // @ts-expect-error restricted method name as key
        values: 'values-value',
        // @ts-expect-error restricted method name as key
        isKey: 'isKey value',
        // @ts-expect-error restricted method name as key
        isValue: 'isValue value',
      })
    }).toThrow(TypeError)
  })

  it('throws an error if values are not unique', async () => {
    expect(() => {
      createEnum({
        // @ts-expect-error duplicate values
        First: 'one',
        // @ts-expect-error duplicate values
        Second: 'one',
      })
    }).toThrow(new TypeError('Enumerated values must be unique'))
  })
})
