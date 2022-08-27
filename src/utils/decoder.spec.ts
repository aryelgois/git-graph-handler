import { decodeBase64 } from './decoder'

describe('decodeBase64()', () => {
  it('decodes correctly', () => {
    const samples: [input: string, output: string][] = [
      ['Zm9v', 'foo'],
      ['Zm9vYmFy', 'foobar'],
      ['dGVzdA==', 'test'],
      ['XmRlY29kZSBCYXNlXGQr', '^decode Base\\d+'],
      ['IShcZCsp', '!(\\d+)'],
      ['XHcrLVxkKw==', '\\w+-\\d+'],
    ]

    expect.assertions(samples.length)

    for (const [input, output] of samples) {
      expect(decodeBase64(input)).toBe(output)
    }
  })
})
