import {
  replacerEntryRecordJTD,
  ReplacerEntry,
  ReplacerEntryRecord,
} from './ReplacerEntry'

describe('replacerEntryRecordJTD', () => {
  describe('parse()', () => {
    const { parse } = replacerEntryRecordJTD

    const run = (input: string, output: RegExp, replacement = '$&') => {
      const data: ReplacerEntryRecord = { in: input, to: replacement }
      const result: ReplacerEntry = { pattern: output, replacement }
      expect(parse(data)).toEqual(result)
    }

    it('throws when "in" is empty', () => {
      expect(() => parse({ in: '', to: '' })).toThrowError(/Missing 'in'/u)
    })

    it('throws when "to" is empty', () => {
      expect(() => parse({ in: 'x', to: '' })).toThrowError(/Missing 'to'/u)
    })

    it('throws when "in" is an invalid regex', () => {
      expect(() => parse({ in: '[', to: ']' })).toThrow(SyntaxError)
    })

    it('creates a simple replacer', () => {
      run('foo', /foo/u, 'bar')
    })

    it('creates a complex replacer', () => {
      run('!(\\d+)', /!(\d+)/u, 'https://example/issues/$1')

      run('/foo/([\\w-]+)', /\/foo\/([\w-]+)/u, 'https://foo.example/issues/$1')

      run('/regex/', /\/regex\//u)

      run('^exactly$', /^exactly$/u)

      run(`(['"])(.*?)\\1`, /(['"])(.*?)\1/u, '$2')

      run(
        '(?<first>\\w+)\\s(?<second>\\w+)',
        /(?<first>\w+)\s(?<second>\w+)/u,
        '$2 $1',
      )
    })
  })
})
