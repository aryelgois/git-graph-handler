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
  options: JTDSchemaOptions<J, T>,
): JTDSchemaValidaton<J, T> => ({
  ...options,
  validate: ajv.compile(options.schema),
  assert: assertSchema,
})

/**
 * The explicit type annotation in the duplicated variables below solves `TS2775`
 *
 * > Assertions require every name in the call target
 * > to be declared with an explicit type annotation.
 *
 * @see https://github.com/microsoft/TypeScript/issues/36931
 * @see https://github.com/microsoft/TypeScript/issues/34596#issuecomment-691574987
 */
const v = {
  encodedReplacerQueryRecord: compile(encodedReplacerQueryRecordJTD),
  replacerQueryRecord: compile(replacerQueryRecordJTD),
}

export const encodedReplacerQueryRecord: typeof v.encodedReplacerQueryRecord =
  v.encodedReplacerQueryRecord

export const replacerQueryRecord: typeof v.replacerQueryRecord =
  v.replacerQueryRecord
