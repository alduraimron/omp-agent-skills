# Upstream documentation reference

This index is an omp-agent-skills contribution. The linked documents are original agent-skills work, preserved byte-for-byte under `vendor/agent-skills/docs/` with the upstream MIT license and attribution intact.

All 17 files from the upstream `docs/` directory are included at revision [`aeac41d4d005999432bb7312f7ff06383a91d59d`](https://github.com/addyosmani/agent-skills/tree/aeac41d4d005999432bb7312f7ff06383a91d59d/docs). Source paths, Git blob IDs and SHA-256 hashes are recorded in [UPSTREAM.json](../UPSTREAM.json).

## omp guidance versus upstream reference

For installing and using this independent omp package, follow [omp usage](omp-usage.md) and the [project README](../README.md).

The archived documents describe the upstream project, its contributors, host integrations and claims at the pinned revision. They are reference material, not instructions for configuring this repository, promises of omp features, or a statement that this independent project supports every upstream host. Mentions of `/build auto`, parallel persona orchestration, hooks, upstream evaluation tooling and other-host installers do not add those capabilities to omp-agent-skills.

Upstream repository names, authorship, installation URLs and host-specific command examples are intentionally unchanged. They identify the source project, not this package's distribution or endorsement. Installing omp-agent-skills does not execute any setup commands in these documents or register them as skills or commands.

## Complete documentation index

| Document | Upstream subject |
|----------|------------------|
| [adoption-guide.md](../vendor/agent-skills/docs/adoption-guide.md) | Greenfield and established-codebase adoption |
| [advanced-per-agent-configuration.md](../vendor/agent-skills/docs/advanced-per-agent-configuration.md) | Portable versus host-specific configuration |
| [agents.md](../vendor/agent-skills/docs/agents.md) | Persona roles and upstream orchestration |
| [antigravity-setup.md](../vendor/agent-skills/docs/antigravity-setup.md) | Antigravity CLI setup |
| [codex-setup.md](../vendor/agent-skills/docs/codex-setup.md) | Codex setup |
| [commandcode-setup.md](../vendor/agent-skills/docs/commandcode-setup.md) | Command Code setup |
| [comparison.md](../vendor/agent-skills/docs/comparison.md) | The upstream author's comparison with other skill collections |
| [copilot-cli-setup.md](../vendor/agent-skills/docs/copilot-cli-setup.md) | Copilot CLI setup |
| [copilot-setup.md](../vendor/agent-skills/docs/copilot-setup.md) | Copilot in VS Code setup |
| [cursor-setup.md](../vendor/agent-skills/docs/cursor-setup.md) | Cursor setup |
| [developer-onboarding.md](../vendor/agent-skills/docs/developer-onboarding.md) | Contributing to the original upstream repository |
| [gemini-cli-setup.md](../vendor/agent-skills/docs/gemini-cli-setup.md) | Gemini CLI setup |
| [getting-started.md](../vendor/agent-skills/docs/getting-started.md) | Universal upstream usage |
| [opencode-setup.md](../vendor/agent-skills/docs/opencode-setup.md) | OpenCode setup |
| [other-hosts.md](../vendor/agent-skills/docs/other-hosts.md) | Additional upstream host installation references |
| [skill-anatomy.md](../vendor/agent-skills/docs/skill-anatomy.md) | Skill structure and validation rules |
| [windsurf-setup.md](../vendor/agent-skills/docs/windsurf-setup.md) | Windsurf setup |

## Links to files outside the archived subset

The complete `docs/` directory is included, but the entire upstream repository is not. Some original relative links point to intentionally excluded files, such as upstream `README.md`, `CONTRIBUTING.md`, evaluation fixtures, host command wrappers or CI. Those targets are not fabricated or replaced with downstream documents. Doing so would confuse authorship and repository-specific instructions.

If a relative link has no local target, resolve it in the [pinned upstream repository](https://github.com/addyosmani/agent-skills/tree/aeac41d4d005999432bb7312f7ff06383a91d59d), for example the [original README](https://github.com/addyosmani/agent-skills/blob/aeac41d4d005999432bb7312f7ff06383a91d59d/README.md), [original contribution rules](https://github.com/addyosmani/agent-skills/blob/aeac41d4d005999432bb7312f7ff06383a91d59d/CONTRIBUTING.md) or [evaluation documentation](https://github.com/addyosmani/agent-skills/blob/aeac41d4d005999432bb7312f7ff06383a91d59d/evals/README.md). External pages may have changed since this snapshot; retaining an original link is not a claim that its contents were copied, audited or are still current.

For this project's own development and maintenance, use [CONTRIBUTING.md](../CONTRIBUTING.md) and [MAINTENANCE.md](../MAINTENANCE.md), not the upstream contributor guide.
