import { applyReplacer, parseQuery } from '~/replacer'

import { asError, HTTP_BAD_REQUEST } from '~/utils'
import { expectMaybeCall, mockThrowOnce } from '~/utils/jest'

import { replaceFromQuery } from './replaceFromQuery'

jest.mock('~/replacer')
const mockedApplyReplacer = jest.mocked(applyReplacer)
const mockedParseQuery = jest.mocked(parseQuery)

jest.mock('~/utils')
const mockedAsError = jest.mocked(asError)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
mockedAsError.mockImplementation((e) => e as any)

describe('replaceFromQuery()', () => {
  type SendJson = { json: (j: unknown) => void }

  const mockedResponseRedirect = jest.fn<void, [string]>()
  const mockedResponseJson = jest.fn<void, [unknown]>()
  const mockedResponseStatus = jest.fn<SendJson, [number]>(() => ({
    json: mockedResponseJson,
  }))
  // unused
  const mockedNextFn = jest.fn<void, [unknown]>()

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const run = (query: Record<string, string> = {}) =>
    replaceFromQuery(
      { query } as any,
      { redirect: mockedResponseRedirect, status: mockedResponseStatus } as any,
      mockedNextFn
    )
  /* eslint-enable @typescript-eslint/no-explicit-any */

  enum callLevel {
    parse,
    apply,
    redirect,
  }

  const expectCalls = (level: callLevel) => {
    expect(mockedParseQuery).toBeCalled()
    expectMaybeCall(mockedApplyReplacer, level < callLevel.apply)
    expectMaybeCall(mockedResponseRedirect, level < callLevel.redirect)
  }

  const expectError = (message: string) => {
    expect(mockedAsError).toBeCalled()
    expect(mockedResponseStatus).toBeCalledWith(HTTP_BAD_REQUEST)
    expect(mockedResponseJson).toBeCalledWith({ error: 'Error', message })
  }

  it('throws when the query is invalid', () => {
    const message = 'from parseQuery()'
    mockThrowOnce(mockedParseQuery, message)

    // eslint-disable-next-line no-magic-numbers
    expect.assertions(6)

    run()

    expectCalls(callLevel.parse)
    expectError(message)
  })

  it('throws when did not apply any replacers', () => {
    const message = 'from applyReplacer()'
    mockThrowOnce(mockedApplyReplacer, message)

    // eslint-disable-next-line no-magic-numbers
    expect.assertions(6)

    run()

    expectCalls(callLevel.apply)
    expectError(message)
  })

  it('redirects to the solved match', () => {
    const query = { q: 'q', c: 'c' }
    const parsed = { input: 'q', config: [] }
    const result = 'https://example.com'

    mockedParseQuery.mockReturnValueOnce(parsed)
    mockedApplyReplacer.mockReturnValueOnce(result)

    // eslint-disable-next-line no-magic-numbers
    expect.assertions(6)

    run(query)

    expect(mockedParseQuery).toBeCalledWith(query)
    expect(mockedApplyReplacer).toBeCalledWith(parsed)
    expect(mockedResponseRedirect).toBeCalledWith(result)

    expect(mockedAsError).not.toBeCalled()
    expect(mockedResponseStatus).not.toBeCalled()
    expect(mockedResponseJson).not.toBeCalled()
  })
})
