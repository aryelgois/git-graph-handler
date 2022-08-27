import { decodeBase64 } from '~/utils'

import { replacerConfigRecordJTD } from './ReplacerConfig'

import {
  encodedReplacerQueryRecordJTD,
  replacerQueryRecordJTD,
} from './ReplacerQuery'

jest.mock('~/utils')
const mockedBase64Decoder = jest.mocked(decodeBase64)

jest.mock('./ReplacerConfig')
const mockedConfigParser = jest.mocked(replacerConfigRecordJTD.parse)

describe('encodedReplacerQueryRecordJTD', () => {
  describe('parse()', () => {
    const { parse } = encodedReplacerQueryRecordJTD

    it('throws when "q" is empty', () => {
      expect(() => parse({ q: '', c: '' })).toThrowError(/Missing "q"/u)
      expect(mockedBase64Decoder).not.toBeCalled()
    })

    it('throws when "c" is empty', () => {
      expect(() => parse({ q: 'x', c: '' })).toThrowError(/Missing "c"/u)
      expect(mockedBase64Decoder).not.toBeCalled()
    })

    it('throws when "c" is invalid', () => {
      const samples: [input: string, output: string][] = [
        ['ew==', '{'],
        ['Ww==', '['],
        ['eydmb28nOiAnYmFyJ30=', "{'foo': 'bar'}"],
        ['W3sgbnVsbCB9XQ==', '[{ null }]'],

        ['IiI=', '""'],
        ['dHJ1ZQ==', 'true'],
        ['e30=', '{}'],
        ['eyJmb28iOiAiYmFyIn0=', '{"foo": "bar"}'],
      ]

      // eslint-disable-next-line no-magic-numbers
      expect.assertions(samples.length * 2)

      for (const [input, output] of samples) {
        mockedBase64Decoder.mockReturnValueOnce(output)
        expect(() => parse({ q: 'x', c: input })).toThrow(SyntaxError)
        expect(mockedBase64Decoder).toHaveBeenLastCalledWith(input)
      }
    })

    it('decodes the "c" property', () => {
      const samples: [input: string, output: string, final: unknown[]][] = [
        ['W10=', '[]', []],
        ['W3t9XQ==', '[{}]', [{}]],
        ['WyJzdHJpbmciXQ==', '["string"]', ['string']],
        ['W3siZm9vIjogImJhciJ9XQ==', '[{"foo": "bar"}]', [{ foo: 'bar' }]],

        [
          // actual: [{ "in": "!(\\d+)", "to": "https://example/issues/$1" }]
          'W3sgImluIjogIiEoXFxkKykiLCAidG8iOiAiaHR0cHM6Ly9leGFtcGxlL2lzc3Vlcy8kMSIgfV0=',
          '[{ "in": "!(\\\\d+)", "to": "https://example/issues/$1" }]',
          [{ in: '!(\\d+)', to: 'https://example/issues/$1' }],
        ],
      ]

      // eslint-disable-next-line no-magic-numbers
      expect.assertions(samples.length * 2)

      for (const [input, output, final] of samples) {
        mockedBase64Decoder.mockReturnValueOnce(output)
        expect(parse({ q: 'x', c: input })).toEqual({ q: 'x', c: final })
        expect(mockedBase64Decoder).toHaveBeenLastCalledWith(input)
      }
    })
  })
})

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
