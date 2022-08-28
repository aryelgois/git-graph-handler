import { ReplacerQuery } from '~/types'

import { mockThrowOnce } from '~/utils/jest'

import { encodedReplacerQueryRecord, replacerQueryRecord } from '~/validation'

import { applyReplacer, parseQuery } from '.'

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

describe('applyReplacer()', () => {
  const makeQuery = (input: string): ReplacerQuery => ({
    input,
    config: [
      { pattern: /!(\d+)/u, replacement: 'https://example/issues/$1' },
      { pattern: /foo\/([\w-]+)/u, replacement: 'https://foo.page/$1' },
      { pattern: /^exactly-\d+$/u, replacement: '[$&][]' },
    ],
  })

  it('throws when the input did not match', () => {
    const message = 'Could not match'
    expect(() => applyReplacer(makeQuery('foo'))).toThrow(message)
    expect(() => applyReplacer(makeQuery('not-exactly-1'))).toThrow(message)
  })

  it('returns the replaced match', () => {
    expect(applyReplacer(makeQuery('!42'))).toBe('https://example/issues/42')
    expect(applyReplacer(makeQuery('foo/bar'))).toBe('https://foo.page/bar')
    expect(applyReplacer(makeQuery('exactly-100'))).toBe('[exactly-100][]')

    expect(applyReplacer(makeQuery('See <!123>'))).toBe(
      'See <https://example/issues/123>'
    )
  })
})
