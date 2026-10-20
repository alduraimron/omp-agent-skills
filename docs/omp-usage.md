# Using the package in omp

This guide is an omp-agent-skills contribution. The 17 documents under `vendor/agent-skills/docs/` describe the upstream project and other hosts; they are source context, not promises about this integration. See the [upstream documentation index](upstream-reference.md) for the archived documents and their pinned origin. Use this guide for omp installation, discovery and capability decisions.

## Native plugin layout

The repository is an omp plugin with manifests and a marketplace catalog:

```text
.omp-plugin/
  marketplace.json    # one-plugin marketplace catalog
  plugin.json         # omp plugin identity
.claude-plugin/
  plugin.json         # compatibility path map for skills and commands
skills/
  omp-agent-workflow/
commands/
  *.md
vendor/agent-skills/
  skills/
  references/
  docs/
```

The compatibility manifest maps both skill roots and the command directory:

```json
{
  "skills": ["./skills", "./vendor/agent-skills/skills"],
  "commands": ["./commands"]
}
```

The complete vendor layout must remain intact. Upstream skills use paths such as `../../references/security-checklist.md`. Copying a single `SKILL.md` out of the package breaks those references.

## Installation

### Marketplace

After the catalog is pushed to the repository:

```sh
omp plugin marketplace add alduraimron/omp-agent-skills
omp plugin install omp@omp-agent-skills-marketplace
```

Project scope:

```sh
omp plugin install --scope project omp@omp-agent-skills-marketplace
```

The installed plugin identity is `omp`; the package identity is `omp-agent-skills`. Git and SSH read access are required for an SSH source.

### Local marketplace install

From a reviewed checkout:

```sh
omp plugin marketplace add /absolute/path/to/omp-agent-skills
omp plugin install omp@omp-agent-skills-marketplace
```

Start a new session after installation. In an existing session, try:

```text
/reload-plugins
```

A local marketplace install loads the same manifests as a Git source. The direct `omp plugin link` command does not load this package's marketplace skill and command manifests, so use the local marketplace flow for a full test.

### Manual install

If plugin installation is unavailable, use omp's native skill and command discovery directly.

User scope:

```text
~/.omp/agent/
  commands/*.md
  config.yml
```

Project scope:

```text
<project>/.omp/
  commands/*.md
  config.yml
```

Copy or symlink the command files, then configure the two skill roots:

```yaml
skills:
  customDirectories:
    - /absolute/path/omp-agent-skills/skills
    - /absolute/path/omp-agent-skills/vendor/agent-skills/skills
```

`skills.customDirectories` scans one level for `<name>/SKILL.md`. Both configured roots follow that layout.

## Verify discovery

Start a new omp session and inspect the command catalog:

```text
/help
```

Expected lifecycle commands when installed as a plugin:

```text
/omp:spec
/omp:plan
/omp:build
/omp:test
/omp:constraints
/omp:code-review
/omp:webperf
/omp:code-simplify
/omp:ship
```

A manual copy of `commands/*.md` exposes the plain names, for example `/spec` and `/code-review`. The review command is named `code-review` to avoid the built-in `/review`.

Skills are advertised by name and description. Use one explicitly with:

```text
/skill:spec-driven-development ...
/skill:test-driven-development ...
```

You can also query the RPC command catalog with `get_available_commands` if you are building a host integration.

## Commands and arguments

Each command is a Markdown prompt file in `commands/` with `description` and `argument-hint` frontmatter. `$ARGUMENTS` expands to the text supplied after the command. Commands ask the agent to read `omp-agent-workflow` first, then the actual upstream workflow skill.

Commands are not executable workflow engines. They request that the agent follow the workflow. Use omp plan mode, approval policy, project rules and CI when a gate must be enforced.

## Capability mapping

Upstream skills may use host-specific names. Translate them to omp capabilities:

| Need | omp capability |
|------|----------------|
| Read a file | `read` |
| Search content | `grep` |
| Find paths | `glob` |
| Run a command | `bash` |
| Edit a file | `edit` |
| Create or replace a file | `write` |
| Ask the user | `ask` when available, otherwise ask in conversation and wait |
| Delegate work | `task` when available and explicitly authorized |
| Plan review | omp plan mode and its plan review flow |
| Browser evidence | `browser` when configured |
| Code intelligence | `lsp` when available |

Do not invent a tool call. If a capability is missing, state the limitation and offer a narrower verifiable approach.

## omp boundaries

- Plan mode is a separate omp mode. The commands do not enable it.
- Approval mode is controlled by omp settings and launch flags. The commands do not grant permissions.
- `AGENTS.md`, `RULES.md` and direct user instructions have higher priority than the package.
- The package does not install hooks, subagents, browser tooling or a workflow engine.
- Personas under `vendor/agent-skills/agents/` are reference perspectives, not registered omp agents.
- Browser skills need browser tooling. Report missing tooling instead of inventing measurements.
- `/omp:build` handles one approved slice. Upstream `build auto` orchestration is not reproduced.
- `/omp:ship` is a readiness assessment, not authorization to deploy, publish, merge or push.
- Workflow text is guidance. It is not a sandbox and does not guarantee verification.

## Plan mode and approvals

omp plan mode can provide a read-only planning gate before implementation. Use it when a task needs explicit review of the plan. The package does not enter or leave plan mode automatically.

The active approval mode controls whether tool calls run automatically or prompt. The package does not change that policy. For headless runs, calls that require an unanswered prompt can fail, so configure a deliberate approval policy or use a trusted environment.

## Troubleshooting

| Symptom | Check |
|---------|-------|
| Plugin is not listed | Run `omp plugin list`; confirm the install scope and source |
| `/omp:*` commands are missing | Start a new session or run `/reload-plugins`; check the plugin manifest `commands` path |
| Skills are missing | Confirm both `skills` paths in `.omp-plugin/plugin.json` exist and contain `<name>/SKILL.md` |
| References are missing | Keep `vendor/agent-skills/skills` beside `vendor/agent-skills/references`; do not copy isolated skill directories |
| Skill collision | Use `skills.includeSkills` or `skills.ignoredSkills`, or disable the competing package; do not rename upstream identifiers silently |
| Browser workflow cannot measure | Configure browser tooling or report the blocked check; do not fabricate metrics |
| A gate was skipped | The package is guidance. Enforce it with plan mode, approval policy, `AGENTS.md` or `RULES.md`, and CI |

For omp internals, read:

```text
omp://skills.md
omp://marketplace.md
omp://settings.md
omp://extensions.md
omp://approval-mode.md
```

Use `read omp://<file>` in an omp session, or see the installed harness documentation.

## Licensing and support

Keep `LICENSE`, `LICENSES/`, `NOTICE`, `THIRD_PARTY_NOTICES.md` and `UPSTREAM.json` with every distribution. Report problems through the [project issue tracker](https://github.com/alduraimron/omp-agent-skills/issues), not the upstream issue tracker.
