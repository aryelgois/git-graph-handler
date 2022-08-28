import { ReplacerQuery } from '~/types'

import { encodedReplacerQueryRecord, replacerQueryRecord } from '~/validation'

export function parseQuery(query: unknown): ReplacerQuery {
  encodedReplacerQueryRecord.assert(query)
  const decoded = encodedReplacerQueryRecord.parse(query)

  replacerQueryRecord.assert(decoded)
  return replacerQueryRecord.parse(decoded)
}
