import { mockThrowOnce } from '~/utils/jest'

import { replacerConfigRecordJTD } from './ReplacerConfig'
import { replacerEntryRecordJTD } from './ReplacerEntry'

jest.mock('./ReplacerEntry')

const mockedEntryParser = jest.mocked(replacerEntryRecordJTD.parse)

describe('replacerConfigRecordJTD', () => {
  describe('parse()', () => {
    const { parse } = replacerConfigRecordJTD

    it('throws when the array is empty', () => {
      expect(() => parse([])).toThrowError(/Missing.+entries$/u)
      expect(mockedEntryParser).not.toBeCalled()
    })

    it('throws when an entry is invalid', () => {
      const message = 'from replacerEntryRecordJTD.parse()'

      mockThrowOnce(mockedEntryParser, message)

      expect(() => parse([{ in: '', to: '' }])).toThrowError(message)
    })

    it('creates an array of ReplacerEntry items', () => {
      const input = [
        { in: 'a', to: 'A' },
        { in: 'b', to: 'B' },
        { in: 'c', to: 'C' },
      ]

      const output = [
        { pattern: /a/u, replacement: 'A' },
        { pattern: /b/u, replacement: 'B' },
        { pattern: /c/u, replacement: 'C' },
      ]

      for (const i of output) {
        mockedEntryParser.mockReturnValueOnce(i)
      }

      const result = parse(input)

      expect(mockedEntryParser.mock.calls).toEqual([
        [{ in: 'a', to: 'A' }],
        [{ in: 'b', to: 'B' }],
        [{ in: 'c', to: 'C' }],
      ])

      expect(result).toEqual(output)
    })
  })
})
