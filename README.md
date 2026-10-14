# pi-agent-skills

An independently maintained engineering workflow package for [Pi](https://pi.dev), built on [Addy Osmani's agent-skills](https://github.com/addyosmani/agent-skills).

**This is a separate project, not an official upstream release. It is not affiliated with, sponsored by, or endorsed by Addy Osmani, the upstream contributors, Anthropic, or the Pi maintainers.** Attribution describes the origin of reused work, not authorship of our additions or endorsement.

## Install

Review the source and [third-party notices](THIRD_PARTY_NOTICES.md) first. This package is distributed from the independent [alduraimron/pi-agent-skills repository](https://github.com/alduraimron/pi-agent-skills), not the upstream repository.

### From GitHub

After the first approved push has populated the repository, install over SSH:

```sh
pi install git:git@github.com:alduraimron/pi-agent-skills.git
```

Git and SSH authentication with read access to the repository are required. If you prefer HTTPS, use the following source; a private repository still requires authentication:

```sh
pi install git:github.com/alduraimron/pi-agent-skills
```

Add `--local` to either command to install only for the current project. An unpinned source follows the repository's default branch; append `@<commit-or-tag>` to pin an existing ref. No release tag is implied by the package version.

### From a local checkout

From the directory containing this checkout:

```sh
pi install ./pi-agent-skills
```

Or install only for the project you are working on:

```sh
pi install --local /absolute/path/to/pi-agent-skills
```

Run `/reload` in an existing Pi session. npm publication is deliberately disabled with `private: true`. This does not prevent Git installation and does not describe the GitHub repository's visibility. No runtime npm dependencies need to be installed manually.

## Use

The package exposes 25 upstream workflow skills, one new Pi integration skill, and nine new prompt templates:

| Prompt | Workflow |
|--------|----------|
| `/pi-spec` | Define requirements and acceptance criteria |
| `/pi-plan` | Break a specification into verifiable tasks |
| `/pi-build` | Implement one approved slice at a time |
| `/pi-test` | Follow test-driven development |
| `/pi-constraints` | Set explicit quality thresholds |
| `/pi-review` | Review code quality |
| `/pi-webperf` | Audit web performance using available tools |
| `/pi-code-simplify` | Improve clarity without changing behavior |
| `/pi-ship` | Assess launch readiness, without deploying automatically |

Pass your request after a prompt, for example `/pi-review the staged diff`. The `pi-` prefix avoids taking over generic command names.

You can also invoke a skill directly:

```text
/skill:pi-agent-workflow
/skill:test-driven-development implement pagination tests
```

See [Pi usage and capability differences](docs/pi-usage.md). Installing this package does not install browser tooling, hooks, subagents, or executable extensions. Skills provide instructions, not a sandbox or automatic enforcement.

## Origin and new contributions

| Paths | Origin |
|-------|--------|
| `vendor/agent-skills/**` | 66 upstream files, including all 17 upstream documents, preserved byte-for-byte at the pinned revision |
| `LICENSE` | Exact copy of the upstream MIT license and copyright notice |
| `LICENSES/Apache-2.0-code-simplifier.txt` | Exact third-party license copy for the explicitly credited simplifier adaptation |
| `skills/pi-agent-workflow/`, `prompts/`, `scripts/`, `test/`, root documentation and CI | New pi-agent-skills contributions, not written by or attributed to upstream authors |

The foundation is pinned to [`aeac41d4d005999432bb7312f7ff06383a91d59d`](https://github.com/addyosmani/agent-skills/commit/aeac41d4d005999432bb7312f7ff06383a91d59d). [UPSTREAM.json](UPSTREAM.json) records source paths, revisions, excluded files and SHA-256 hashes. No upstream Git history or remotes were imported. [MODIFICATIONS.md](MODIFICATIONS.md) records the significant downstream changes.

## Documentation

- [Pi usage](docs/pi-usage.md): installation, commands and capabilities of this independent package.
- [Complete upstream documentation index](docs/upstream-reference.md): all 17 original `docs/` files, including adoption, onboarding and other-host setup guides.

Upstream documents are preserved reference material, not promises of Pi features or setup instructions for this independent project. Their original host commands, project names and links are unchanged. Some links target excluded upstream artifacts; the index explains how to find those in the pinned source repository.

## Development

Node.js 22.19 or newer is required for local validation. There are no npm dependencies and no install step is needed:

```sh
npm run check
npm test
npm pack --dry-run --ignore-scripts
```

The checks cover provenance, notices, skill structure, shared reference paths, prompt routing and distributed package contents. See [CONTRIBUTING.md](CONTRIBUTING.md) and [MAINTENANCE.md](MAINTENANCE.md) for independent review, releases and deliberate upstream imports.

## Licenses

- Reused upstream material: [MIT](LICENSE), including `Copyright (c) 2025 Addy Osmani`. Existing attributions remain intact.
- New contributions only: [MIT](LICENSES/MIT-pi-agent-skills.txt).
- The upstream `code-simplification` skill explicitly credits an Anthropic plugin adaptation. Its separately reviewed [Apache-2.0 license](LICENSES/Apache-2.0-code-simplifier.txt) is included conservatively for any incorporated third-party expression. This is not a blanket relicensing of upstream work.

The combined distribution declares `MIT AND Apache-2.0`. Preserve the applicable licenses and notices when redistributing. See [NOTICE](NOTICE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for scope and audit details.
