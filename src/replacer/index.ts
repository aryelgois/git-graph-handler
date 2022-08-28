import { ReplacerQuery } from '~/types'

import { encodedReplacerQueryRecord, replacerQueryRecord } from '~/validation'

export function parseQuery(query: unknown): ReplacerQuery {
  encodedReplacerQueryRecord.assert(query)
  const decoded = encodedReplacerQueryRecord.parse(query)

  replacerQueryRecord.assert(decoded)
  return replacerQueryRecord.parse(decoded)
}

export function applyReplacer({ input, config }: ReplacerQuery): string {
  for (const entry of config) {
    if (entry.pattern.test(input)) {
      return input.replace(entry.pattern, entry.replacement)
    }
  }

  throw new Error('Could not match input in config')
}
