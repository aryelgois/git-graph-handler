# Git Graph Handler

[![View on GitHub](https://img.shields.io/badge/github-%23121011.svg?style=for-the-badge&logo=github&logoColor=white)](https://github.com/aryelgois/git-graph-handler)
[![Vercel instance](https://img.shields.io/badge/vercel-%23000000.svg?style=for-the-badge&logo=vercel&logoColor=white)](https://git-graph-handler.vercel.app/api)
[![Latest release](https://img.shields.io/github/release/aryelgois/git-graph-handler?style=for-the-badge)](https://github.com/aryelgois/git-graph-handler/releases)
[![Deployment status](https://img.shields.io/github/deployments/aryelgois/git-graph-handler/production?style=for-the-badge)](https://github.com/aryelgois/git-graph-handler/deployments/activity_log?environment=Production)

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

## Vercel

You can use a public instance of this handler at
<https://git-graph-handler.vercel.app/api>

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
with a query string containing numeric placeholders (`$1`, `$2`, ...)
and the encoded Replacer config, for example:

```
# running locally with default port:
http://localhost:5000/?q=$1&c=CONFIG

# using the public Vercel instance:
https://git-graph-handler.vercel.app/api/?q=$1&c=CONFIG
```

It is possible to store the configuration in a file in the repository
and share with your team, but they will have to
[reset the repository configuration](https://github.com/mhutchie/vscode-git-graph/issues/599)
to load it. This file is more useful for newcomers to your repository.

`.vscode/vscode-git-graph.json`

```json
{
  "issueLinkingConfig": {
    "issue": "Issue Regex",
    "url": "Issue URL"
  }
}
```

NOTE: You should use the Export Repository Configuration button to generate this file.
It will only be used when first loading the repository in the Git Graph, so
changes will not be automatically synchronized with the actual settings.

It could be a good idea if everyone in your team did export the configuration,
at least to avoid losing it during the reset, and try to merge common settings
into the versioned file.

Or just tell them to configure their local Issue Linking with what is in this file..
just remember to unescape backslashes from the JSON file.

### Examples

#### Jira issues + GitLab merge requests

Having the Issue Regex `(XYZ-\d+|[\w-]+/[\w-]+!\d+|!\d+)`, that matches:

- a Jira issue `XYZ-456`,
- a "full" GitLab merge request `org/repo!123`, or
- a merge request for the current repo `!789`

and a Replacer config like:

```json
[
  {
    "in": "XYZ-\\d+",
    "to": "https://YOUR_ACCOUNT.atlassian.net/browse/$&"
  },
  {
    "in": "([\\w-]+/[\\w-]+)!(\\d+)",
    "to": "https://gitlab.com/$1/-/merge_requests/$2"
  },
  {
    "in": "^!(\\d+)",
    "to": "https://gitlab.com/YOUR_ORG/SOME_REPO/-/merge_requests/$1"
  }
]
```

that minified (optional) and converted to Base64 would be

```
W3siaW4iOiJYWVotXFxkKyIsInRvIjoiaHR0cHM6Ly9ZT1VSX0FDQ09VTlQuYXRsYXNzaWFuLm5l
dC9icm93c2UvJCYifSx7ImluIjoiKFtcXHctXSsvW1xcdy1dKykhKFxcZCspIiwidG8iOiJodHRw
czovL2dpdGxhYi5jb20vJDEvLS9tZXJnZV9yZXF1ZXN0cy8kMiJ9LHsiaW4iOiJeIShcXGQrKSIs
InRvIjoiaHR0cHM6Ly9naXRsYWIuY29tL1lPVVJfT1JHL1NPTUVfUkVQTy8tL21lcmdlX3JlcXVl
c3RzLyQxIn1dCg==
```

using it in the Issue URL:

```
http://localhost:5000/?q=$1&c=W3siaW4iOiJYWVotXFxkKyIsInRvIjoiaHR0cHM6Ly9ZT1VSX0FDQ09VTlQuYXRsYXNzaWFuLm5ldC9icm93c2UvJCYifSx7ImluIjoiKFtcXHctXSsvW1xcdy1dKykhKFxcZCspIiwidG8iOiJodHRwczovL2dpdGxhYi5jb20vJDEvLS9tZXJnZV9yZXF1ZXN0cy8kMiJ9LHsiaW4iOiJeIShcXGQrKSIsInRvIjoiaHR0cHM6Ly9naXRsYWIuY29tL1lPVVJfT1JHL1NPTUVfUkVQTy8tL21lcmdlX3JlcXVlc3RzLyQxIn1dCg==
```

then Git Graph would replace the `$1` with matches from your commit messages,
and clicking the link would take you to your local instance of this package,
that would replace again and redirect to the final URL.

Remember that the Issue Linking is per repository, so it's fine to hardcode the
current repository, but you would need multiple Replacer configs if you have
a vscode workspace with multiple repositories.

#### GitHub

There is a problem with using the `#` character for GitHub issues, because it is
not encoded properly when Git Graph replaces it into the Issue URL and is confused
with the marker for a URI fragment.. so we must avoid sending the `#` character.

Issue Regex: `(XYZ-\d+)|([\w-]+/[\w-]+)#(\d+)|#(\d+)`

- four capturing groups: `$1` is for Jira, `$2` and `$3` are for an external
  GitHub repository and `$4` is the current repository. It avoids the `#`
  inside the captured group

Issue URL: `?q=$1:$2!$3:$4`

- because Git Graph replaces `undefined` in the placeholders without a match,
  it is necessary to add a separator to help with the Replacer config.
  If the missing placeholders were replaced to nothing, it could be `$1$2!$3$4`
  and the config could be like the GitLab example, just changing the URLs ;)

Replacer config:

```json
[
  {
    "in": "^(XYZ-\\d+):.+",
    "to": "https://YOUR_ACCOUNT.atlassian.net/browse/$1"
  },
  {
    "in": ".+:([\\w-]+/[\\w-]+)!(\\d+):.+",
    "to": "https://github.com/$1/issues/$2"
  },
  {
    "in": ".+:(\\d+)$",
    "to": "https://github.com/USERNAME/SOME_REPO/issues/$1"
  }
]
```

It is using `.+` to match anything at the sides, because the `in` match in the
`q` string is replaced to the `to` replacement, and we want to discard the extra
characters.

## License

[MIT License](LICENSE)

[base64]: https://www.base64encode.org/
[regex]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp
[regex-anchors]: https://www.regular-expressions.info/anchors.html
[replacement patterns]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String/replace#specifying_a_string_as_the_replacement
[require-unicode-regexp]: https://eslint.org/docs/latest/rules/require-unicode-regexp
