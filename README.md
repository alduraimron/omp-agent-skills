# omp-agent-skills

An independently maintained engineering workflow package for [omp](https://github.com/can1357/oh-my-pi), built on [Addy Osmani's agent-skills](https://github.com/addyosmani/agent-skills).

This is a separate project, not an official upstream release. It is not affiliated with, sponsored by, or endorsed by Addy Osmani, the upstream contributors, Anthropic, or the omp maintainers. Attribution describes the origin of reused work, not authorship of the additions or endorsement.

The goal is simple: help a coding agent clarify requirements, plan small tasks, implement with evidence, review changes, and assess release readiness without silently skipping steps.

Included:

- 26 skills: 25 upstream workflows plus one omp integration skill;
- 9 lifecycle commands under the `omp` plugin namespace;
- 4 reference personas;
- 7 shared checklists;
- the complete 17-document upstream reference archive;
- a native omp plugin manifest and marketplace catalog.

## Contents

- [How the package works](#how-the-package-works)
- [Install in omp](#install-in-omp)
- [Quick start](#quick-start)
- [Workflow stages](#workflow-stages)
- [All 9 commands](#all-9-commands)
- [All 26 skills](#all-26-skills)
- [Personas and shared references](#personas-and-shared-references)
- [omp boundaries](#omp-boundaries)
- [If you forget where you stopped](#if-you-forget-where-you-stopped)
- [Troubleshooting](#troubleshooting)
- [Development](#development)
- [Origin, licenses and support](#origin-licenses-and-support)

## How the package works

There are three kinds of material:

| Material | What it means | Example |
|----------|---------------|---------|
| Skill | A Markdown workflow with steps, checks and supporting files | `test-driven-development` explains how to implement behavior test-first |
| Command | A shortcut that asks omp to read the relevant skills and follow them for the request | `/omp:test implement pagination tests` |
| Persona | A specialist review perspective, not an automatically registered subagent | `security-auditor` describes a security review perspective |

omp advertises skill names and descriptions, then the model can load a relevant skill when the task matches. You can describe the goal in ordinary language; you do not need to memorize every skill. Selection can still be imperfect, so use a command or explicit skill invocation when you want a particular workflow:

```text
/omp:test implement pagination tests
/skill:test-driven-development implement pagination tests
```

The nine `/omp:*` commands are Markdown prompt commands, not executable workflow engines. Each first asks the agent to read the [omp integration skill](skills/omp-agent-workflow/SKILL.md), then the appropriate upstream workflow. Text after the command is forwarded as the user request. You can write the request in your preferred language.

Skills guide the agent's behavior. They are not a sandbox, a permission grant, or a guarantee that verification ran. Always distinguish actual tool output from a claim that something works.

## Install in omp

Review the source and [third-party notices](THIRD_PARTY_NOTICES.md) first. The package identity is `omp-agent-skills`; the installed plugin identity is `omp`.

### Marketplace install

After the marketplace catalog is pushed to the repository:

```sh
omp plugin marketplace add alduraimron/omp-agent-skills
omp plugin install omp@omp-agent-skills-marketplace
```

For a project-scoped install:

```sh
omp plugin install --scope project omp@omp-agent-skills-marketplace
```

Git and SSH read access are required for an SSH source. The marketplace catalog is at `.omp-plugin/marketplace.json`; the plugin manifest is at `.omp-plugin/plugin.json`; the compatibility manifest is at `.claude-plugin/plugin.json`. The package keeps `private: true`; this guards npm publication but does not block Git or plugin installation.

### Local marketplace install

From a reviewed checkout:

```sh
omp plugin marketplace add /absolute/path/to/omp-agent-skills
omp plugin install omp@omp-agent-skills-marketplace
```

Then start a new omp session or run `/reload-plugins` if the session was already running. A local marketplace install loads the same skill and command manifests as the Git source. The direct `omp plugin link` command does not load this package's marketplace skill and command manifests, so use the local marketplace flow for a full smoke test.

### Manual project or user install

If plugin installation is unavailable, keep the vendor layout intact and map the directories directly.

Project scope:

```text
<project>/.omp/
  commands/*.md
  config.yml
```

User scope:

```text
~/.omp/agent/
  commands/*.md
  config.yml
```

`config.yml`:

```yaml
skills:
  customDirectories:
    - /absolute/path/omp-agent-skills/skills
    - /absolute/path/omp-agent-skills/vendor/agent-skills/skills
```

Copy or symlink `commands/*.md` into the corresponding `commands/` directory. Keep `vendor/agent-skills/skills` and `vendor/agent-skills/references` together so upstream `../../references/` paths continue to work. Do not copy a single `SKILL.md` out of the package.

The package manifest maps both skill roots and the command directory:

```json
{
  "skills": ["./skills", "./vendor/agent-skills/skills"],
  "commands": ["./commands"]
}
```

For installation details, capability mapping and troubleshooting, see [omp usage](docs/omp-usage.md).

### Verify the install

Start a new session and check the command catalog:

```text
/help
```

You should see the `/omp:*` lifecycle commands. If you copied the command files manually, the same commands appear without the plugin namespace, for example `/spec` and `/code-review`. You can also invoke a skill directly:

```text
/skill:spec-driven-development ...
```

If the plugin is installed but commands are missing, see [Troubleshooting](#troubleshooting).

## Quick start

You do not need to learn all 26 skills at once. Start with one small feature and four entry points: `/omp:spec`, `/omp:plan`, `/omp:build` and `/omp:code-review`.

1. Start omp inside the project you want to work on, not inside the installed package. Run `/reload-plugins` if the package was installed during that session.
2. Clarify the feature:

   ```text
   /omp:spec I want a task list where I can add tasks, view them, and mark them complete. Clarify the requirements; do not implement yet.
   ```

   Read the specification and resolve open questions. Approve it in a later turn before planning.
3. Turn the approved specification into small tasks:

   ```text
   /omp:plan The specification is approved. Create small tasks with acceptance criteria and verification. Do not implement yet.
   ```

   Review the plan before authorizing work.
4. Approve one task, not the entire backlog:

   ```text
   /omp:build I approve task 1 in tasks/todo.md. Implement only that task and run relevant tests. Do not commit, push, or deploy.
   ```

   Inspect changed paths, test output and remaining blockers.
5. Review the result:

   ```text
   /omp:code-review Review the changes for task 1 for bugs and regressions. Report findings without editing files.
   ```

   Agree on fixes if needed. Move to the next task only when the current one is verified.

These examples are requests to the agent, not commands to paste into a shell. Approval of a specification or plan is not blanket approval to implement everything, commit, push or deploy.

## Workflow stages

```text
DEFINE -> PLAN -> BUILD -> VERIFY -> REVIEW -> SHIP
```

This is a typical lifecycle, not a requirement to run every stage for every typo or small bug. Use only the stages needed for the work, while retaining meaningful acceptance criteria and verification.

| Stage | Entry point | Main question | Expected result or approval boundary |
|-------|-------------|---------------|--------------------------------------|
| Define | `/omp:spec` | What are we building, and what counts as done? | A specification and open questions; stop for human review before planning or implementation |
| Plan | `/omp:plan` | What small tasks get us there? | Ordered tasks, dependencies, acceptance criteria and verification; no product code |
| Build | `/omp:build` | What is the next approved slice? | Scoped implementation with test evidence; one approved task at a time |
| Verify | `/omp:test` | What evidence proves the behavior? | Test-driven changes or results from an explicitly requested existing test run; failures remain visible |
| Review | `/omp:code-review` | Are there defects or regressions? | Findings with paths, severity and evidence; read-only unless fixes are separately authorized |
| Ship | `/omp:ship` | Are we ready, and how would we roll back? | Readiness assessment, gaps and rollback plan; does not authorize deployment, publication, merging or pushing |

Set a quality bar with `/omp:constraints` when needed. `/omp:code-simplify` and `/omp:webperf` are focused quality and performance workflows, not additional mandatory phases. `/omp:build` already asks for test-driven development when implementing behavior; `/omp:test` is useful for focused test work or another verification pass.

### Working artifacts

Default conventions in the upstream workflows are:

| Artifact | Purpose |
|----------|---------|
| `SPEC.md` | Requirements, boundaries and success criteria; larger multi-capability work can use a capability map and module-specific specs |
| `tasks/plan.md` | Approach, dependencies, risks and checkpoints |
| `tasks/todo.md` | Ordered tasks, acceptance criteria, verification and completion status |
| `CONSTRAINTS.md` | The agreed quality bar when using the constraints workflow |

Follow an existing specification system or designated external task tracker instead of creating duplicate sources of truth. Do not overwrite an incomplete plan for unrelated work. Keep artifacts current as scope changes, and record what verification actually ran against which state.

## All 9 commands

Pass the feature, task, diff, report or scope after the command. When installed as a plugin, omp namespaces the commands as `/omp:*`. Manual installs use the plain file names. The review command is named `code-review` to avoid the built-in `/review`.

| Command | Workflow loaded after omp integration | Use when or scope |
|---------|---------------------------------------|-------------------|
| `/omp:spec` | [spec-driven-development](vendor/agent-skills/skills/spec-driven-development/SKILL.md) | Requirements are missing or unclear; define the feature before implementation |
| `/omp:plan` | [planning-and-task-breakdown](vendor/agent-skills/skills/planning-and-task-breakdown/SKILL.md) | A specification or clear goal needs ordered, verifiable tasks |
| `/omp:build` | [incremental-implementation](vendor/agent-skills/skills/incremental-implementation/SKILL.md), plus [test-driven-development](vendor/agent-skills/skills/test-driven-development/SKILL.md) for behavior | Implement one approved slice; not an autonomous whole-plan run |
| `/omp:test` | [test-driven-development](vendor/agent-skills/skills/test-driven-development/SKILL.md) | Add tests, reproduce a bug test-first, or explicitly run existing tests |
| `/omp:constraints` | [constraint-driven-development](vendor/agent-skills/skills/constraint-driven-development/SKILL.md) | Agree on quality thresholds; tool installation and CI changes still require approval |
| `/omp:code-review` | [code-review-and-quality](vendor/agent-skills/skills/code-review-and-quality/SKILL.md) | Inspect a requested change and report actionable findings without silently applying fixes |
| `/omp:webperf` | [performance-optimization](vendor/agent-skills/skills/performance-optimization/SKILL.md), plus [browser-testing-with-devtools](vendor/agent-skills/skills/browser-testing-with-devtools/SKILL.md) when live browser tooling is available | Analyze supplied reports or approved measurements; do not invent metrics or assume browser tools are installed |
| `/omp:code-simplify` | [code-simplification](vendor/agent-skills/skills/code-simplification/SKILL.md) | Simplify approved code while preserving behavior and tests; review-only requests remain read-only |
| `/omp:ship` | [shipping-and-launch](vendor/agent-skills/skills/shipping-and-launch/SKILL.md) | Assess a release's readiness and rollback strategy; no automatic deployment or multi-agent fan-out |

Examples:

```text
/omp:test Run the existing tests for task 1 and report results without changing code.
/omp:constraints Agree on accessibility and test coverage requirements for this project.
/omp:code-simplify Simplify the approved parser code without changing behavior.
/omp:webperf Analyze this Lighthouse report; explain what is measured and what is missing.
/omp:ship Assess release readiness. Do not deploy, publish, merge, or push.
```

## All 26 skills

The links below open the actual instructions. Skills are available through `/skill:<name>` and can also be selected by the model when their descriptions match the request. Catalog groups describe typical use, not rigid restrictions.

### omp integration: 1 new downstream skill

| Skill | Purpose | Use when |
|-------|---------|----------|
| [omp-agent-workflow](skills/omp-agent-workflow/SKILL.md) | Map workflow instructions onto available omp capabilities and approved scope | Using this package's commands or encountering another host's tool names |

### Discovery: 1 upstream skill

| Skill | Purpose | Use when |
|-------|---------|----------|
| [using-agent-skills](vendor/agent-skills/skills/using-agent-skills/SKILL.md) | Identify which engineering workflow fits the task | You need help choosing a skill; do not preload a second always-on router alongside native skill routing |

### Define: 4 upstream skills

| Skill | Purpose | Use when |
|-------|---------|----------|
| [interview-me](vendor/agent-skills/skills/interview-me/SKILL.md) | Clarify the underlying intent through one-question-at-a-time interviewing | The request leaves important needs or assumptions unspecified |
| [idea-refine](vendor/agent-skills/skills/idea-refine/SKILL.md) | Explore alternatives, evaluate assumptions and converge on a concrete idea | An idea is vague or needs stress-testing before specification |
| [spec-driven-development](vendor/agent-skills/skills/spec-driven-development/SKILL.md) | Define requirements, success criteria and boundaries before code | Starting a substantial feature, project or change without an adequate spec |
| [constraint-driven-development](vendor/agent-skills/skills/constraint-driven-development/SKILL.md) | Establish quality requirements and detect attempts to weaken them | Quality thresholds are missing or checks are being silenced to get green |

### Plan: 1 upstream skill

| Skill | Purpose | Use when |
|-------|---------|----------|
| [planning-and-task-breakdown](vendor/agent-skills/skills/planning-and-task-breakdown/SKILL.md) | Decompose work into small tasks with dependencies and verification | Clear requirements exist but the implementation order or scope is unclear |

### Build and design: 7 upstream skills

| Skill | Purpose | Use when |
|-------|---------|----------|
| [incremental-implementation](vendor/agent-skills/skills/incremental-implementation/SKILL.md) | Deliver thin, verifiable slices rather than a large untested change | Implementing a multi-file change or the next planned task |
| [test-driven-development](vendor/agent-skills/skills/test-driven-development/SKILL.md) | Use the red-green-refactor loop and regression tests | Adding behavior, fixing a bug or changing existing logic |
| [context-engineering](vendor/agent-skills/skills/context-engineering/SKILL.md) | Load relevant rules, code, decisions and task context | Starting or resuming a session, switching tasks or recovering degraded output |
| [source-driven-development](vendor/agent-skills/skills/source-driven-development/SKILL.md) | Check implementation decisions against official documentation | Using a framework or library where remembered patterns may be outdated |
| [doubt-driven-development](vendor/agent-skills/skills/doubt-driven-development/SKILL.md) | Challenge assumptions and non-trivial decisions with adversarial review | The work is unfamiliar, high-stakes or cheaper to verify now than repair later; independent context needs available, authorized tooling |
| [frontend-ui-engineering](vendor/agent-skills/skills/frontend-ui-engineering/SKILL.md) | Design accessible, responsive interfaces and components | Building or changing pages, layouts, UI state or accessibility behavior |
| [api-and-interface-design](vendor/agent-skills/skills/api-and-interface-design/SKILL.md) | Design stable contracts and module boundaries | Creating APIs, endpoints, type contracts or frontend and backend interfaces |

### Verify and debug: 2 upstream skills

| Skill | Purpose | Use when |
|-------|---------|----------|
| [browser-testing-with-devtools](vendor/agent-skills/skills/browser-testing-with-devtools/SKILL.md) | Inspect browser runtime evidence such as DOM, console, network and traces | Verifying browser-facing behavior with separately configured browser capabilities |
| [debugging-and-error-recovery](vendor/agent-skills/skills/debugging-and-error-recovery/SKILL.md) | Reproduce, localize and fix a root cause with a regression guard | Tests fail, builds break or behavior differs from expectations |

### Review and quality: 4 upstream skills

| Skill | Purpose | Use when |
|-------|---------|----------|
| [code-review-and-quality](vendor/agent-skills/skills/code-review-and-quality/SKILL.md) | Review correctness, readability, architecture, security and performance | Inspecting a diff or pull request before merge |
| [code-simplification](vendor/agent-skills/skills/code-simplification/SKILL.md) | Improve clarity without changing observable behavior | Working code has avoidable complexity; preserve its original third-party attribution |
| [security-and-hardening](vendor/agent-skills/skills/security-and-hardening/SKILL.md) | Assess input boundaries, authentication, dependencies and privacy or security risks | Handling untrusted data, sessions, external integrations or personal information |
| [performance-optimization](vendor/agent-skills/skills/performance-optimization/SKILL.md) | Measure bottlenecks and validate improvements | Investigating load time, Core Web Vitals, backend, query or database regressions |

### Ship and operate: 6 upstream skills

| Skill | Purpose | Use when |
|-------|---------|----------|
| [git-workflow-and-versioning](vendor/agent-skills/skills/git-workflow-and-versioning/SKILL.md) | Organize commits, branches, changes and versioning | Preparing approved Git operations or a release; installing the skill does not authorize a push |
| [ci-cd-and-automation](vendor/agent-skills/skills/ci-cd-and-automation/SKILL.md) | Design automated test, build and delivery gates | Setting up or changing a pipeline with explicit approval |
| [deprecation-and-migration](vendor/agent-skills/skills/deprecation-and-migration/SKILL.md) | Plan removal and migration without abandoning compatibility needs | Retiring an API or system, or changing production data structures |
| [documentation-and-adrs](vendor/agent-skills/skills/documentation-and-adrs/SKILL.md) | Record architectural reasoning and maintain useful documentation | Making design decisions, changing APIs or shipping features |
| [observability-and-instrumentation](vendor/agent-skills/skills/observability-and-instrumentation/SKILL.md) | Make production behavior diagnosable through logs, metrics, traces and alerts | Instrumenting a feature or investigating operations without enough evidence |
| [shipping-and-launch](vendor/agent-skills/skills/shipping-and-launch/SKILL.md) | Plan readiness checks, staged rollout, monitoring and rollback | Assessing what is needed before an approved production launch |

## Personas and shared references

### Four reference personas

These are reusable perspectives, not registered omp skills, commands or subagents. Ask an available agent to read and apply a persona when appropriate; do not claim a separate reviewer ran if the work stayed in the same session.

| Persona | Perspective |
|---------|-------------|
| [code-reviewer](vendor/agent-skills/agents/code-reviewer.md) | Code correctness and maintainability |
| [security-auditor](vendor/agent-skills/agents/security-auditor.md) | Threats, vulnerabilities and hardening |
| [test-engineer](vendor/agent-skills/agents/test-engineer.md) | Test strategy, coverage and regression evidence |
| [web-performance-auditor](vendor/agent-skills/agents/web-performance-auditor.md) | Web performance evidence and measurement limitations |

### Seven shared checklists

| Reference | Helps with |
|-----------|------------|
| [definition-of-done](vendor/agent-skills/references/definition-of-done.md) | The project-wide completion bar, alongside per-task acceptance criteria |
| [testing-patterns](vendor/agent-skills/references/testing-patterns.md) | Test structure, examples and common testing mistakes |
| [security-checklist](vendor/agent-skills/references/security-checklist.md) | Security boundaries, input validation, authentication and data handling |
| [performance-checklist](vendor/agent-skills/references/performance-checklist.md) | Performance targets and measurement checks |
| [accessibility-checklist](vendor/agent-skills/references/accessibility-checklist.md) | Keyboard, screen-reader, visual and interaction checks |
| [observability-checklist](vendor/agent-skills/references/observability-checklist.md) | Logs, metrics, traces, alerts and operational readiness |
| [orchestration-patterns](vendor/agent-skills/references/orchestration-patterns.md) | Coordination patterns, delegation boundaries and review sequencing |

## omp boundaries

- Plan mode is a separate omp mode. These commands do not enable it. Use it when a read-only planning gate is required.
- Approval mode and tool policies remain under user control. Installing this package does not grant permissions.
- `AGENTS.md`, `RULES.md` and direct user instructions have higher priority than this package.
- The package does not install hooks, subagents, browser tooling or a workflow engine.
- Personas are reference text. They are not automatically spawned as omp agents.
- Browser skills require browser tooling. Report missing tooling instead of inventing measurements.
- A readiness request is not deployment authorization.
- Workflow verification is an instruction to the agent, not guaranteed enforcement.
- No upstream `build auto` orchestration is reproduced. `/omp:build` handles one approved slice.

## If you forget where you stopped

Use the project artifacts and the omp session history instead of restarting from scratch:

1. Read `tasks/todo.md` and `tasks/plan.md` if they exist.
2. Use omp session resume or restore commands if the process was interrupted.
3. Check the actual diff and test output before continuing.
4. Resume with the next unverified task, not the entire backlog.
5. If context was compacted, rely on the current artifacts and repository state, not assumed memory.

## Troubleshooting

| Problem | What to check |
|---------|---------------|
| The `/omp:*` commands are missing | Confirm the plugin is installed with `omp plugin list`; start a new session or run `/reload-plugins` |
| Skills are not advertised | Confirm `.omp-plugin/plugin.json` is packaged and both skill roots exist; check `omp` logs |
| A command or skill collides with another package | Disable or filter one package; do not silently rename upstream compatibility identifiers |
| Shared references are missing | Preserve the `vendor/agent-skills/skills` and `vendor/agent-skills/references` layout |
| A browser workflow cannot measure anything | Check that browser tooling is configured; report the limitation instead of inventing data |
| The model skipped a verification gate | The package is guidance, not enforcement. Use omp plan mode, approval policy, project rules and CI for hard gates |

## Development

Use Node.js 22.19 or newer for the repository checks. No dependency installation is required.

```sh
npm run check
npm test
npm pack --dry-run --ignore-scripts
```

For a local omp smoke test:

```sh
omp plugin marketplace add /absolute/path/to/omp-agent-skills
omp plugin install omp@omp-agent-skills-marketplace
omp --mode rpc
```

Then query `get_available_commands` or open a new interactive session and run `/help`.

Do not modify files under `vendor/agent-skills/`. Follow [MAINTENANCE.md](MAINTENANCE.md) for upstream updates.

## Origin, licenses and support

- Upstream: [agent-skills](https://github.com/addyosmani/agent-skills) at revision [`aeac41d4d005999432bb7312f7ff06383a91d59d`](https://github.com/addyosmani/agent-skills/tree/aeac41d4d005999432bb7312f7ff06383a91d59d).
- Archived upstream documents: [docs/upstream-reference.md](docs/upstream-reference.md).
- Upstream license: MIT, preserved in [LICENSE](LICENSE) and [vendor/agent-skills/LICENSE](vendor/agent-skills/LICENSE).
- The imported `code-simplification` skill credits an Apache-2.0 Anthropic adaptation. Its license is preserved in [LICENSES/Apache-2.0-code-simplifier.txt](LICENSES/Apache-2.0-code-simplifier.txt).
- New omp integration, commands, validation, tests and documentation are licensed under [LICENSES/MIT-omp-agent-skills.txt](LICENSES/MIT-omp-agent-skills.txt).
- Origin and third-party details: [NOTICE](NOTICE), [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md), [UPSTREAM.json](UPSTREAM.json).
- Support: [this project's issue tracker](https://github.com/alduraimron/omp-agent-skills/issues).

Do not send downstream bug reports to the upstream project as if this were an official release. No affiliation, sponsorship or endorsement by the upstream authors, Anthropic or the omp maintainers is implied.
