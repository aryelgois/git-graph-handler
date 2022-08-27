import {
  replacerConfigRecordJTD,
  ReplacerConfig,
  ReplacerConfigRecord,
} from './ReplacerConfig'

import { JTDSchemaOptions } from './validation'

interface ReplacerQueryRecord {
  q: string
  c: ReplacerConfigRecord
}

interface ReplacerQuery {
  input: string
  config: ReplacerConfig
}

export const replacerQueryRecordJTD: JTDSchemaOptions<
  ReplacerQueryRecord,
  ReplacerQuery
> = {
  schema: {
    properties: {
      q: { type: 'string' },
      c: replacerConfigRecordJTD.schema,
    },
  },

  parse: (data) => ({
    input: data.q,
    config: replacerConfigRecordJTD.parse(data.c),
  }),
}
