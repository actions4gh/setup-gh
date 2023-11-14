# Setup GitHub CLI

👨‍💻 Install & configure the [GitHub CLI] (`gh`) in your GitHub Actions runner

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

👩‍💻 Installs any version of the [GitHub CLI] you want \
🏃‍♂️ Works with self-hosted runners \
🐳 Works great in container-based jobs

## Usage

![GitHub Actions](https://img.shields.io/static/v1?style=for-the-badge&message=GitHub+Actions&color=2088FF&logo=GitHub+Actions&logoColor=FFFFFF&label=)
![GitHub](https://img.shields.io/static/v1?style=for-the-badge&message=GitHub&color=181717&logo=GitHub&logoColor=FFFFFF&label=)

⚠️ This action is only useful **if your runner doesn't already come with `gh`**.
The default GitHub Actions hosted runners come with `gh` installed. You only
need this action to install `gh` if you're [using a Docker container for a job]
or if you're using a [self-hosted runner] image that doesn't come with `gh`
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
      - uses: actions/checkout@v4
      - uses: actions4gh/setup-gh@v1
      - run: gh issue create --body "$BODY"
        env:
          BODY: Hello world!
```

### Inputs

- **`gh-version`:** Which version of `gh` to install. This can be an exact
  version like `2.38.0` or a semver range like `2.38` or `2.x`. You can also
  specify `latest` to always use the latest version. The default is `latest`.

- **`cli-token`:** The GitHub token to use when pulling versions from [cli/cli].
  By default this should cover all cases. You shouldn't have to touch this
  setting.

- **`token`:** Token to use when running `gh auth login`. This can be set to an
  empty string to skip the login step. By default this will use the token
  `github.token`.

- **`github-server-url`:** The GitHub server URL to use when running
  `gh auth login`. Defaults to the current `github.server_url`.

### Outputs

- **`gh-version`:** The version of `gh` that was installed. This will be
  something like '2.38.0' or similar.

- **`auth`:** A boolean indicating whether or not the user is authenticated.
  This will be true if `gh auth login` was run and false otherwise.

## Development

![Node.js](https://img.shields.io/static/v1?style=for-the-badge&message=Node.js&color=339933&logo=Node.js&logoColor=FFFFFF&label=)

**How do I test my changes?**

Open a Draft Pull Request and some magic GitHub Actions will run to test the
action.

<!-- prettier-ignore-start -->
[github cli]: https://cli.github.com/
[cli/cli]: https://github.com/cli/cli
[using a Docker container for a job]: https://docs.github.com/en/actions/using-jobs/running-jobs-in-a-container
[self-hosted runner]: https://docs.github.com/en/actions/hosting-your-own-runners/managing-self-hosted-runners/about-self-hosted-runners
<!-- prettier-ignore-end -->
