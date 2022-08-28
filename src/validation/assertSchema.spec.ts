import { AssertionError } from 'assert'

import Ajv, { JTDSchemaType } from 'ajv/dist/jtd'

import { createSchemaAsserter } from './assertSchema'

const ajv = new Ajv()

const assertSchema = createSchemaAsserter(ajv)

type SampleType = { foo: string }

const sampleSchema: JTDSchemaType<SampleType> = {
  properties: {
    foo: { type: 'string' },
  },
}

const sampleValidator = ajv.compile(sampleSchema)

const clearErrors = () => {
  sampleValidator.errors = null
}

const validatorSpy = jest.fn(sampleValidator)
const errorsSpy = jest.fn(() => sampleValidator.errors)
Object.defineProperty(validatorSpy, 'errors', { get: errorsSpy })

const sampleValidation = {
  validate: validatorSpy as unknown as typeof sampleValidator,
  assert: assertSchema,
}

describe('assertSchema()', () => {
  beforeEach(clearErrors)

  it('passes when the data is valid', () => {
    const data = { foo: 'bar' }
    expect(() => sampleValidation.assert(data)).not.toThrow()
    expect(validatorSpy).toBeCalledWith(data)
    expect(errorsSpy).not.toBeCalled()
    expect(sampleValidator.errors).toBeFalsy()
  })

  it('throws if could not get errors', () => {
    const data = 'foobar'
    errorsSpy.mockReturnValueOnce(null)
    expect(() => sampleValidation.assert(data)).toThrow(AssertionError)
    expect(validatorSpy).toBeCalledWith(data)
    expect(errorsSpy).toBeCalled()
  })

  it('throws the validation error', () => {
    const samples: [input: unknown, error: string][] = [
      ['invalid', 'data must be object'],
      [{}, "data must have property 'foo'"],
      [{ foo: true }, 'data/foo must be string'],
      [{ foo: 'x', bar: 'x' }, 'data/bar must NOT have additional properties'],
    ]

    // eslint-disable-next-line no-magic-numbers
    expect.assertions(samples.length * 4)

    for (const [input, error] of samples) {
      expect(() => sampleValidation.assert(input)).toThrow(error)
      expect(validatorSpy).toHaveBeenLastCalledWith(input)
      expect(errorsSpy).toBeCalled()
      expect(sampleValidator.errors?.length).toBeTruthy()

      validatorSpy.mockClear()
      errorsSpy.mockClear()
      clearErrors()
    }
  })
})
