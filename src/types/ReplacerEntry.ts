import { JTDSchemaOptions } from './validation'

export interface ReplacerEntryRecord {
  in: string
  to: string
}

export interface ReplacerEntry {
  pattern: RegExp
  replacement: string
}

export const replacerEntryRecordJTD: JTDSchemaOptions<
  ReplacerEntryRecord,
  ReplacerEntry
> = {
  schema: {
    properties: {
      in: { type: 'string' },
      to: { type: 'string' },
    },
  },

  parse(data) {
    if (data.in === '') {
      throw new Error('Missing "in" property')
    }

    if (data.to === '') {
      throw new Error('Missing "to" property')
    }

    return {
      pattern: new RegExp(data.in, 'u'),
      replacement: data.to,
    }
  },
}
