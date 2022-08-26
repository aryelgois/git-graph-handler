import {
  replacerEntryJTD,
  EncodedReplacerEntry,
  ReplacerEntry,
} from './ReplacerEntry'

import { JTDSchemaOptions } from './validation'

export type EncodedReplacerConfig = EncodedReplacerEntry[]

export type ReplacerConfig = ReplacerEntry[]

export const replacerConfigJTD: JTDSchemaOptions<
  EncodedReplacerConfig,
  ReplacerConfig
> = {
  schema: {
    elements: replacerEntryJTD.schema,
  },

  parse(data) {
    if (!data.length) {
      throw new Error('Missing replacer entries')
    }

    return data.map((i) => replacerEntryJTD.parse(i))
  },
}
