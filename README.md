# Git Graph Handler

Handle multiple issue linking in the
[Git Graph](https://github.com/mhutchie/vscode-git-graph) extension for vscode
while these issues are not solved:

- https://github.com/mhutchie/vscode-git-graph/issues/313
- https://github.com/mhutchie/vscode-git-graph/issues/451
- https://github.com/mhutchie/vscode-git-graph/issues/612

## Build

Run:

```sh
npm install
npm run build
```

## Serve

You can run a simple server with [nodemon](https://www.npmjs.com/package/nodemon):

```sh
npm start
```

Note that the [dependencies](package.json) must be installed.

## Usage

Make a request with the following parameters in the query string:

- `q` : the input value to be matched and replaced, URI encoded as usual
- `c` : the matchers and replacers configuration, a [Base64 encoded][base64]
  JSON of an array as described bellow

The first match of the input in the config will be used to produce a redirect link.
If no matches are found or if an error happens, the response will be a JSON
describing it.

### Replacer config

This is a non-empty array of objects containing:

- `in` : the string of a [regex] that may have capturing groups
- `to` : a replacement string with [replacement patterns][]

The regex string must be encoded properly, so backslashes have to be doubled:

```json
[{ "in": "(\\w+)-(\\d+)", "to": "$1/$2" }]
```

As you can see, the regex delimiters `/`...`/` must not be included.
It's not required to include [anchors][regex-anchors] (`^` `$`),
but you can if you need them.

The regex object [will have the `u` flag][require-unicode-regexp].
Custom flags are not supported, but let me know if you have a use case..

The `to` replacement string could be anything to be applied on the `q` input
with the matches from the `in` regex. But for the purposes of this package,
it should be a URL.

### Integrate with Git Graph

The extension only allows a single Issue Linking per repository.

You will have to configure the `Issue Regex` to match all possibly values
that will be handled in the Replacer config to redirect to different URLs.

The `Issue URL` needs to be the URL for an instance of this package
(default is http://localhost:5000/) with a query string containing
numeric placeholders (`$1`, `$2`, ...) and the encoded Replacer config.

```
http://localhost:5000/?q=$1&c=CONFIG
```

It is possible to store the configuration in a file in the repository
and share with your team, but they will have to
[reset the repository configuration](https://github.com/mhutchie/vscode-git-graph/issues/599)

`.vscode/vscode-git-graph.json`

```json
{
  "issueLinkingConfig": {
    "issue": "Issue Regex",
    "url": "Issue URL"
  }
}
```

NOTE: You should use Export Repository Configuration button to generate this file.
It will only be used when first loading the repository in the Git Graph, so
changes will not be automatically synchronized with the actual settings.

## License

[MIT License](LICENSE)

[base64]: https://www.base64encode.org/
[regex]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
[regex-anchors]: https://www.regular-expressions.info/anchors.html
[replacement patterns]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_the_replacement
[require-unicode-regexp]: https://eslint.org/docs/latest/rules/require-unicode-regexp
