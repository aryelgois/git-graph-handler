import {
  replacerEntryRecordJTD,
  ReplacerEntry,
  ReplacerEntryRecord,
} from './ReplacerEntry'

import { JTDSchemaOptions } from './validation'

export type ReplacerConfigRecord = ReplacerEntryRecord[]

export type ReplacerConfig = ReplacerEntry[]

export const replacerConfigRecordJTD: JTDSchemaOptions<
  ReplacerConfigRecord,
  ReplacerConfig
> = {
  schema: {
    elements: replacerEntryRecordJTD.schema,
  },

  parse(data) {
    if (!data.length) {
      throw new Error('Missing replacer entries')
    }

    return data.map((i) => replacerEntryRecordJTD.parse(i))
  },
}
