import { createEnum } from '../src/create-enum'

describe('Enum', () => {
  it('has values from original', async () => {
    const Test = createEnum({
      first: 'one',
      second: 'two',
      third: 'three',
    })

    expect(Test.first).toBe('one')
    expect(Test.second).toBe('two')
    expect(Test.third).toBe('three')
  })

  it('checks if random value is a key', async () => {
    const Test = createEnum({
      first: 'one',
      second: 'two',
      third: 'three',
    })

    expect(Test.isKey('first')).toBe(true)
    expect(Test.isKey('seventh')).toBe(false)
  })

  it('checks if random value is a value', async () => {
    const Test = createEnum({
      first: 'one',
      second: 'two',
      third: 'three',
    })

    expect(Test.isValue('one')).toBe(true)
    expect(Test.isValue('seven')).toBe(false)
  })
})
