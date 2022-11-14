import { createEnum } from '../src/create-enum'

describe('Enum', () => {
  const TestEnum = createEnum({
    first: 'one',
    second: 'two',
    third: 'three',
  })

  it('has values from original', async () => {
    expect(TestEnum.first).toBe('one')
    expect(TestEnum.second).toBe('two')
    expect(TestEnum.third).toBe('three')
  })

  it('checks if random value is a key', async () => {
    expect(TestEnum.isKey('first')).toBe(true)
    expect(TestEnum.isKey('seventh')).toBe(false)
  })

  it('checks if random value is a value', async () => {
    expect(TestEnum.isValue('one')).toBe(true)
    expect(TestEnum.isValue('seven')).toBe(false)
  })

  it('performs a reverse lookup of values', async () => {
    expect(TestEnum.keyOf('one')).toBe('first')
    expect(TestEnum.keyOf('two')).toBe('second')
    expect(TestEnum.keyOf('three')).toBe('third')
  })

  it('enumerates the keys', async () => {
    const keys = TestEnum.keys()
    expect(keys).toEqual(['first', 'second', 'third'])
  })

  it('enumerates the values', async () => {
    const values = TestEnum.values()
    expect(values).toEqual(['one', 'two', 'three'])
  })

  it('has only the enum keys as enumerable properties', async () => {
    const keys = Object.keys(TestEnum)
    expect(keys).toEqual(['first', 'second', 'third'])
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
        first: 'one',
        // @ts-expect-error duplicate values
        second: 'one',
      })
    }).toThrow(new TypeError('Enumerated values must be unique'))
  })
})
