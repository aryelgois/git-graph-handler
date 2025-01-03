import assert from 'assert'

import { decodeBase64 } from '~/utils'

import {
  replacerConfigRecordJTD,
  ReplacerConfig,
  ReplacerConfigRecord,
} from './ReplacerConfig'

import { JTDSchemaOptions } from './validation'

export interface EncodedReplacerQueryRecord {
  q: string
  c: string
}

export interface DecodedReplacerQueryRecord {
  q: string
  c: unknown[]
}

export const encodedReplacerQueryRecordJTD: JTDSchemaOptions<
  EncodedReplacerQueryRecord,
  DecodedReplacerQueryRecord
> = {
  schema: {
    properties: {
      q: { type: 'string' },
      c: { type: 'string' },
    },
  },

  parse(data) {
    assert(data.q !== '', "Missing 'q' property")
    assert(data.c !== '', "Missing 'c' property")

    let config
    try {
      config = JSON.parse(decodeBase64(data.c))
      assert(Array.isArray(config))
    } catch (_) {
      throw new SyntaxError(
        "The 'c' property must be a JSON array encoded in Base64",
      )
    }

    return {
      ...data,
      c: config,
    }
  },
}

export interface ReplacerQueryRecord {
  q: string
  c: ReplacerConfigRecord
}

export interface ReplacerQuery {
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
