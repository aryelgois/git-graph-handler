import { decodeBase64 } from './decoder'

describe('decodeBase64()', () => {
  it('returns an empty string when the input is invalid', () => {
    const samples: string[] = ['', '!@#$%&*-', '[{""}]']

    expect.assertions(samples.length)

    for (const input of samples) {
      expect(decodeBase64(input)).toBe('')
    }
  })

  it('decodes correctly', () => {
    const samples: [input: string, output: string][] = [
      ['Zm9v', 'foo'],
      ['Zm9vYmFy', 'foobar'],
      ['dGVzdA==', 'test'],
      ['XmRlY29kZSBCYXNlXGQr', '^decode Base\\d+'],
      ['IShcZCsp', '!(\\d+)'],
      ['XHcrLVxkKw==', '\\w+-\\d+'],

      /**
       * The string representation for backslashes can go wild
       */
      [
        // actual: {"word":"\\b(\\w+)\\b"}
        // base64:
        'eyJ3b3JkIjoiXFxiKFxcdyspXFxiIn0=',
        // in JS/TS:
        '{"word":"\\\\b(\\\\w+)\\\\b"}',
      ],
    ]

    expect.assertions(samples.length)

    for (const [input, output] of samples) {
      expect(decodeBase64(input)).toBe(output)
    }
  })
})
