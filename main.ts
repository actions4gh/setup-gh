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

const octokit = github.getOctokit(core.getInput("token"));
const releases = await octokit.paginate(octokit.rest.repos.listReleases, {
  owner: "cli",
  repo: "cli",
});
const version = semver.maxSatisfying(
  releases.map((release) => release.tag_name.slice(1)),
  core.getInput("gh-version")
);
let found = tc.find("gh-cli", version);
core.setOutput("cache-hit", !!found);
if (!found) {
  console.log("Downloading");
}
core.setOutput("gh-version", version);
