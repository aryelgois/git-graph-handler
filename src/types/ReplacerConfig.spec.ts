import { replacerConfigRecordJTD } from './ReplacerConfig'
import { replacerEntryRecordJTD } from './ReplacerEntry'

jest.mock('./ReplacerEntry')

const mockedEntryParser = jest.mocked(replacerEntryRecordJTD.parse)

describe('replacerConfigRecordJTD', () => {
  describe('parse()', () => {
    const { parse } = replacerConfigRecordJTD

    it('throws when the array is empty', () => {
      expect(() => parse([])).toThrowError(/Missing.+entries$/u)
    })

    it('throws when an entry is invalid', () => {
      const message = 'from replacerEntryRecordJTD.parse()'

      mockedEntryParser.mockImplementationOnce(() => {
        throw new Error(message)
      })

      expect(() => parse([{ in: '', to: '' }])).toThrowError(message)
    })

    it('creates an array of ReplacerEntry items', () => {
      parse([
        { in: 'a', to: 'A' },
        { in: 'b', to: 'B' },
        { in: 'c', to: 'C' },
      ])

      expect(mockedEntryParser.mock.calls).toEqual([
        [{ in: 'a', to: 'A' }],
        [{ in: 'b', to: 'B' }],
        [{ in: 'c', to: 'C' }],
      ])
    })
  })
})
