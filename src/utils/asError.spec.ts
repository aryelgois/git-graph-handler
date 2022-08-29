import { asError } from './asError'

describe('asError()', () => {
  it('returns the Error argument', () => {
    const error = new Error('test1')
    expect(asError(error)).toBe(error)
    expect(asError(error)).not.toBe(new Error('test1'))
  })

  it('creates an Error from "message" property', () => {
    const errorObject = { message: 'test2' }
    expect(asError(errorObject)).toEqual(new Error('test2'))
  })

  it('creates an Error with message string', () => {
    const message = 'test3'
    expect(asError(message)).toEqual(new Error(message))
  })

  it('creates a fallback Error', () => {
    const fallback = /^Unknown error: '.*'$/u

    const run = (o: unknown) => () => {
      throw asError(o)
    }

    // eslint-disable-next-line no-magic-numbers
    expect(run(42)).toThrow(fallback)
    expect(run(null)).toThrow(fallback)
    expect(run([])).toThrow(fallback)
    expect(run({})).toThrow(fallback)
  })
})
