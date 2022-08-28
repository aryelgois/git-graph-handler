import Ajv from 'ajv/dist/jtd'

import {
  encodedReplacerQueryRecordJTD,
  replacerQueryRecordJTD,
  JTDSchemaOptions,
  JTDSchemaValidaton,
} from '~/types'

import { createSchemaAsserter } from './assertSchema'

const ajv = new Ajv()

const assertSchema = createSchemaAsserter(ajv)

const compile = <J, T>(
  options: JTDSchemaOptions<J, T>
): JTDSchemaValidaton<J, T> => ({
  ...options,
  validate: ajv.compile(options.schema),
  assert: assertSchema,
})

export const encodedReplacerQueryRecord = compile(encodedReplacerQueryRecordJTD)
export const replacerQueryRecord = compile(replacerQueryRecordJTD)
