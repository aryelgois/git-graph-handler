import assert from 'assert'

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
    assert(data.length, 'Missing replacer entries')

    return data.map((i) => replacerEntryRecordJTD.parse(i))
  },
}
