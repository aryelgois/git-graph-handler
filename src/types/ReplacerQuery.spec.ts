import { replacerConfigRecordJTD } from './ReplacerConfig'
import { replacerQueryRecordJTD } from './ReplacerQuery'

jest.mock('./ReplacerConfig')

const mockedConfigParser = jest.mocked(replacerConfigRecordJTD.parse)

describe('replacerQueryRecordJTD', () => {
  describe('parse()', () => {
    const { parse } = replacerQueryRecordJTD

    it('throws when the config is invalid', () => {
      const message = 'from replacerConfigRecordJTD.parse()'

      mockedConfigParser.mockImplementationOnce(() => {
        throw new Error(message)
      })

      expect(() => parse({ q: 'q', c: [] })).toThrowError(message)
    })

    it('creates a ReplacerQuery', () => {
      const input = [{ in: 'foobar', to: 'FooBar' }]
      const output = [{ pattern: /foobar/u, replacement: 'FooBar' }]

      mockedConfigParser.mockReturnValueOnce(output)

      const result = parse({ q: 'foobar', c: input })

      expect(mockedConfigParser).toBeCalledWith(input)
      expect(result).toEqual({ input: 'foobar', config: output })
    })
  })
})
