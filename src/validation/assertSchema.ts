import assert from 'assert'

import Ajv, { ValidateFunction } from 'ajv/dist/jtd'

export const createSchemaAsserter = (ajv: Ajv) =>
  function assertSchema<J>(
    this: { validate: ValidateFunction<J> },
    data: unknown,
  ): asserts data is J {
    if (!this.validate(data)) {
      const errors = this.validate.errors ?? []
      assert(errors.length, 'Could not get errors from ValidateFunction')
      throw new TypeError(ajv.errorsText(errors))
    }
  }
