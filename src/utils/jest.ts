export function mockThrowOnce(
  mockInstance: { mockImplementationOnce: (fn: () => never) => void },
  message: string
) {
  mockInstance.mockImplementationOnce(() => {
    throw new Error(message)
  })
}
