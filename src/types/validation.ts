import { JTDSchemaType, ValidateFunction } from 'ajv/dist/jtd'

export interface JTDSchemaOptions<J, T> {
  readonly schema: JTDSchemaType<J>
  parse: (data: J) => T
  serialize?: (data: T) => J
}

export type JTDSchemaValidaton<J, T> = JTDSchemaOptions<J, T> & {
  validate: ValidateFunction<J>
  assert: (data: unknown) => asserts data is J
}
