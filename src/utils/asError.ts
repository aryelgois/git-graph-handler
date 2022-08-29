function hasMessage(e: unknown): e is { message: string } {
  return (
    typeof e === 'object' &&
    e !== null &&
    typeof (e as { message: string }).message === 'string'
  )
}

export function asError(e: unknown): Error {
  if (e instanceof Error) {
    return e
  } else if (hasMessage(e)) {
    return new Error(e.message)
  } else if (typeof e === 'string') {
    return new Error(e)
  }
  return new Error(`Unknown error: '${e}'`)
}
