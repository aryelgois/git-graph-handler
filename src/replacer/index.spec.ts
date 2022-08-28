import { mockThrowOnce } from '~/utils/jest'

import { encodedReplacerQueryRecord, replacerQueryRecord } from '~/validation'

import { parseQuery } from '.'

jest.mock('~/validation')
const mockedEncodedReplacer = jest.mocked(encodedReplacerQueryRecord)
const mockedReplacer = jest.mocked(replacerQueryRecord)

describe('parseQuery()', () => {
  const encodedReplacerQueryRecordAsserter = mockedEncodedReplacer.assert
  const replacerQueryRecordAsserter = mockedReplacer.assert

  // replace functions because they are the same
  mockedEncodedReplacer.assert = jest.fn()
  mockedReplacer.assert = jest.fn()

  afterAll(() => {
    mockedEncodedReplacer.assert = encodedReplacerQueryRecordAsserter
    mockedReplacer.assert = replacerQueryRecordAsserter
  })

  enum callLevel {
    EncodedAssert,
    EncodedParse,
    ReplacerAssert,
    ReplacerParse,
  }

  const expectCall = (mockInstance: jest.Mock, negate: boolean) => {
    if (negate) {
      expect(mockInstance).not.toBeCalled()
    } else {
      expect(mockInstance).toBeCalled()
    }
  }

  const testMockThrows = (mockInstance: jest.Mock, level: callLevel) => () => {
    const message = `from level #${level}`
    mockThrowOnce(mockInstance, message)

    // eslint-disable-next-line no-magic-numbers
    expect.assertions(5)

    expect(() => parseQuery({})).toThrow(message)
    expect(mockedEncodedReplacer.assert).toBeCalled()
    expectCall(mockedEncodedReplacer.parse, level < callLevel.EncodedParse)
    expectCall(mockedReplacer.assert, level < callLevel.ReplacerAssert)
    expectCall(mockedReplacer.parse, level < callLevel.ReplacerParse)
  }

  it(
    'throws when encodedReplacerQueryRecord.assert() fails',
    testMockThrows(mockedEncodedReplacer.assert, callLevel.EncodedAssert)
  )

  it(
    'throws when encodedReplacerQueryRecord.parse() fails',
    testMockThrows(mockedEncodedReplacer.parse, callLevel.EncodedParse)
  )

  it(
    'throws when replacerQueryRecord.assert() fails',
    testMockThrows(mockedReplacer.assert, callLevel.ReplacerAssert)
  )

  it(
    'throws when replacerQueryRecord.parse() fails',
    testMockThrows(mockedReplacer.parse, callLevel.ReplacerParse)
  )

  it('creates a ReplacerQuery', () => {
    const input = { q: 'q', c: 'encoded' }
    const decoded = { q: 'q', c: ['decoded'] }
    const result = { input: 'q', config: [] }

    mockedEncodedReplacer.parse.mockReturnValueOnce(decoded)
    mockedReplacer.parse.mockReturnValueOnce(result)

    expect(parseQuery(input)).toEqual(result)
    /* eslint-disable no-magic-numbers */
    expect(mockedEncodedReplacer.assert).toBeCalledTimes(1)
    expect(mockedEncodedReplacer.parse).toBeCalledWith(input)
    expect(mockedReplacer.assert).toBeCalledTimes(1)
    expect(mockedReplacer.parse).toBeCalledWith(decoded)
    /* eslint-enable no-magic-numbers */
  })
})
