// 2>/dev/null; v=1.38.0; [ -d "${i="$RUNNER_TOOL_CACHE/deno/$v/$(echo "$RUNNER_ARCH" | tr '[:upper:]' '[:lower:]')"}" ] || curl -fsSL https://deno.land/x/install/install.sh |DENO_INSTALL="$i" sh -s "v$v" &>/dev/null; exec "$i/bin/deno" run -Aq "$0" "$@"
import * as core from "npm:@actions/core";
import * as tc from "npm:@actions/tool-cache";
import * as github from "npm:@actions/github";
import {} from "node:path";
import semver from "npm:semver";
import {} from "node:fs/promises";
import process from "node:process";

// import http from "node:http"
// http.globalAgent = new http.Agent()
process.on("uncaughtException", (e) => {
  console.dir(e);
});
process.on("unhandledRejection", (e) => {
  console.dir(e);
});

const octokit = github.getOctokit(core.getInput("token"), {
  request: { fetch },
});
let version = core.getInput("version");
if (version === "latest") {
  const { data } = await octokit.rest.repos.getLatestRelease({
    owner: "cli",
    repo: "cli",
  });
  version = data.tag_name.slice(1);
} else {
  const releases = await octokit.paginate(octokit.rest.repos.listReleases, {
    owner: "cli",
    repo: "cli",
  });
  const versions = releases.map((release) => release.tag_name.slice(1));
  version = semver.maxSatisfying(versions, version);
}
core.debug(`Resolved version: ${version}`);

let found = tc.find("gh-cli", version);
core.setOutput("cache-hit", !!found);
if (!found) {
  const platform = {
    linux: "linux",
    darwin: "macOS",
    win32: "windows",
  }[process.platform];
  const arch = {
    x64: "amd64",
    arm: "arm",
    arm64: "arm64",
  }[process.arch];
  const ext = {
    linux: "tar.gz",
    darwin: semver.lt(version, "2.28.0") ? "tar.gz" : "zip",
    win32: "zip",
  }[process.platform];
  const file = `gh_${version}_${platform}_${arch}.${ext}`;
  found = await tc.downloadTool(
    `https://github.com/cli/cli/releases/download/v${version}/${file}`
  );
  if (file.endsWith(".zip")) {
    found = await tc.extractZip(found);
  } else {
    found = await tc.extractTar(found);
  }
  found = tc.cacheDir(found, version);
}
core.addPath(found);
core.setOutput("gh-version", version);
