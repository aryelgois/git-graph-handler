export function mockThrowOnce(
  mockInstance: { mockImplementationOnce: (fn: () => never) => void },
  message: string
) {
  mockInstance.mockImplementationOnce(() => {
    throw new Error(message)
  })
}

export function expectMaybeCall(mockInstance: jest.Mock, negate: boolean) {
  if (negate) {
    expect(mockInstance).not.toBeCalled()
  } else {
    expect(mockInstance).toBeCalled()
  }
}
