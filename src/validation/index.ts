import Ajv from 'ajv/dist/jtd'

import {
  encodedReplacerQueryRecordJTD,
  replacerQueryRecordJTD,
  JTDSchemaOptions,
  JTDSchemaValidaton,
} from '~/types'

const ajv = new Ajv()

const compile = <J, T>(
  options: JTDSchemaOptions<J, T>
): JTDSchemaValidaton<J, T> => ({
  ...options,
  validate: ajv.compile(options.schema),
})

export const encodedReplacerQueryRecord = compile(encodedReplacerQueryRecordJTD)
export const replacerQueryRecord = compile(replacerQueryRecordJTD)
