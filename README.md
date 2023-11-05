# Setup GitHub CLI

👨‍💻 Install & configure the GitHub CLI (`gh`) in your GitHub Actions runner

<table align=center><td>

```yml
- uses: actions4gh/setup-gh@v1
- run: gh issue create --repo "$REPO" --body "$BODY"
  env:
    GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    REPO: ${{ github.repository }}
    BODY: Hello world!
```

</table>

## Usage

⚠️ This action is only useful **if your runner doesn't already come with `gh`**.
The default GitHub Actions hosted runners come with `gh` installed. The only
times you will need this action are if you are using a
`container: alpine:latest` or similar Docker container for your entire workflow
job or if you're using a self-hosted runner image that doesn't come with `gh`
installed.

Here's an example of a `container` scenario where you might need to use this
action:

```yml
name: Test
on:
  push:
    branches: "main"
jobs:
  test-alpine:
    permissions:
      issues: write
    runs-on: ubuntu-latest
    container: alpine:latest
    steps:
      - uses: actions4gh/setup-gh@v1
      - run: gh issue create --repo "$REPO" --body "$BODY"
        env:
          GH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          REPO: ${{ github.repository }}
          BODY: Hello world!
```

### Inputs

- **`gh-version`:** Which version of `gh` to install. This can be an exact
  version like `2.38.0` or a semver range like `2.38` or `2.x`. You can also
  specify `latest` to always use the latest version. The default is `latest`.

- **`token`:** The GitHub token to use when pulling versions from [cli/cli]. By
  default this should cover all cases. You shouldn't have to touch this setting.

### Outputs

- **`gh-version`:** The version of `gh` that was installed. This will be
  something like '2.38.0' or similar.

[cli/cli]: https://github.com/cli/cli
