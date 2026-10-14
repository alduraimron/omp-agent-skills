# pi-agent-skills

An independently maintained engineering workflow package for [Pi](https://pi.dev), built on [Addy Osmani's agent-skills](https://github.com/addyosmani/agent-skills).

**This is a separate project, not an official upstream release. It is not affiliated with, sponsored by, or endorsed by Addy Osmani, the upstream contributors, Anthropic, or the Pi maintainers.** Attribution describes the origin of reused work, not authorship of our additions or endorsement.

The goal is simple: help a coding agent clarify requirements, plan small tasks, implement with evidence, review changes, and assess release readiness without silently skipping steps.

**Included:** 26 skills (25 upstream + 1 Pi integration skill), 9 lifecycle prompt commands, 4 reference personas, 7 shared checklists, and the complete 17-document upstream reference archive.

## Contents

- [How the package works](#how-the-package-works)
- [Install and manage](#install-and-manage)
- [Quick start for beginners](#quick-start-for-beginners)
- [Workflow stages](#workflow-stages)
- [All 9 commands](#all-9-commands)
- [All 26 skills](#all-26-skills)
- [Personas and shared references](#personas-and-shared-references)
- [Common task recipes](#common-task-recipes)
- [If you forget where you stopped](#if-you-forget-where-you-stopped)
- [Capabilities and limitations](#capabilities-and-limitations)
- [Troubleshooting](#troubleshooting)
- [Documentation](#documentation)
- [Origin and new contributions](#origin-and-new-contributions)
- [Development](#development)
- [Licenses](#licenses)

## How the package works

There are three different kinds of material:

| Material | What it means | Example |
|----------|---------------|---------|
| **Skill** | A Markdown workflow with steps, checks, and supporting files | `test-driven-development` explains how to implement behavior test-first |
| **Prompt command** | A shortcut that asks the agent to read the relevant skills and follow them for your request | `/pi-test implement pagination tests` |
| **Persona** | A specialist review perspective, not an automatically registered subagent | `security-auditor` describes a security review perspective |

Pi advertises skill names and descriptions, then the model can load a relevant skill when your task matches. You can describe your goal in ordinary language; you do not need to memorize every skill. Selection can still be imperfect, so use a command or explicit skill invocation when you want a particular workflow:

```text
/skill:test-driven-development implement pagination tests
/skill:debugging-and-error-recovery investigate the failing login test
```

The nine `/pi-*` commands are [prompt templates](prompts/), not executable workflow engines. Each first asks the agent to read the [Pi integration skill](skills/pi-agent-workflow/SKILL.md), then the appropriate upstream workflow. Text after the command is forwarded as your request. You can write that request in your preferred language.

Skills guide the agent's behavior. They are not a sandbox, a permission grant, or a guarantee that verification ran. Always distinguish actual test output from a claim that something works.

## Install and manage

You need a working Pi installation and a configured model/provider to use the workflows. Package discovery and Git installation have been tested with Pi 1.2.0. Node.js 22.19 or newer is required for this package's Node-based installation and local validation.

Review the source and [third-party notices](THIRD_PARTY_NOTICES.md) first. Install from the independent [alduraimron/pi-agent-skills repository](https://github.com/alduraimron/pi-agent-skills), not the upstream repository.

### Git installation

Install over SSH:

```sh
pi install git:git@github.com:alduraimron/pi-agent-skills.git
```

Git and SSH authentication with read access to the repository are required. For HTTPS, use:

```sh
pi install git:github.com/alduraimron/pi-agent-skills
```

Private repositories still require authentication. Personal installation is the default. Add `--local` for project scope:

```sh
pi install --local git:git@github.com:alduraimron/pi-agent-skills.git
```

An unpinned source follows the repository's default branch. Append `@<commit-or-tag>` to pin an existing ref; pinned refs do not advance automatically. No release tag is implied by the package version.

### Local checkout

From the directory containing this checkout:

```sh
pi install ./pi-agent-skills
```

Or select an absolute path and project scope:

```sh
pi install --local /absolute/path/to/pi-agent-skills
```

Run `/reload` in an existing Pi session after installation or an update. Project-local resources also require Pi's project trust. npm publication is deliberately disabled with `private: true`. This does not prevent Git installation and does not describe the GitHub repository's visibility. There are no runtime npm dependencies to install manually.

### Inspect, update, or remove

For the SSH source above:

```sh
pi list
pi update git:git@github.com:alduraimron/pi-agent-skills.git
pi remove git:git@github.com:alduraimron/pi-agent-skills.git
```

Use the same source and scope you installed with. For an HTTPS installation, substitute its HTTPS source; for project scope, add `--local` where supported. Develop changes in a separate checkout, not the managed installation cache, which Pi can reset during updates.

## Quick start for beginners

**You do not need to learn all 26 skills at once.** Start with one small feature and four entry points: `/pi-spec`, `/pi-plan`, `/pi-build`, and `/pi-review`.

1. Start Pi inside the project you want to work on, not inside the installed skill package. Run `/reload` if the package was installed during that session.
2. Clarify the feature:

   ```text
   /pi-spec I want a task list where I can add tasks, view them, and mark them complete. Clarify the requirements; do not implement yet.
   ```

   Read the specification and resolve open questions. Approve it in a later turn before planning.
3. Turn the approved specification into small tasks:

   ```text
   /pi-plan The specification is approved. Create small tasks with acceptance criteria and verification. Do not implement yet.
   ```

   Review the plan before authorizing work.
4. Approve one task, not the entire backlog:

   ```text
   /pi-build I approve task 1 in tasks/todo.md. Implement only that task and run relevant tests. Do not commit, push, or deploy.
   ```

   Inspect changed paths, test output, and remaining blockers.
5. Review the result:

   ```text
   /pi-review Review the changes for task 1 for bugs and regressions. Report findings without editing files.
   ```

   Agree on fixes if needed. Move to the next task only when the current one is verified.

These examples are requests to the agent, not commands to paste into a terminal. Use them in Pi's editor. Approval of a specification or plan is **not blanket approval** to implement everything, commit, push, or deploy.

## Workflow stages

```text
DEFINE -> PLAN -> BUILD -> VERIFY -> REVIEW -> SHIP
```

This is a typical lifecycle, not a requirement to run every stage for every typo or small bug. Use only the stages needed for the work, while retaining meaningful acceptance criteria and verification.

| Stage | Entry point | Main question | Expected result / approval boundary |
|-------|-------------|---------------|-------------------------------------|
| Define | `/pi-spec` | What are we building, and what counts as done? | A specification and open questions; stop for human review before planning or implementation |
| Plan | `/pi-plan` | What small tasks get us there? | Ordered tasks, dependencies, acceptance criteria, and verification; no product code |
| Build | `/pi-build` | What is the next approved slice? | Scoped implementation with test evidence; one approved task at a time |
| Verify | `/pi-test` | What evidence proves the behavior? | Test-driven changes or results from an explicitly requested existing test run; failures remain visible |
| Review | `/pi-review` | Are there defects or regressions? | Findings with paths, severity, and evidence; read-only unless fixes are separately authorized |
| Ship | `/pi-ship` | Are we ready, and how would we roll back? | Readiness assessment, gaps, and rollback plan; does not authorize deployment, publication, merging, or pushing |

Set a quality bar with `/pi-constraints` when needed. `/pi-code-simplify` and `/pi-webperf` are focused quality/performance workflows, not additional mandatory phases. `/pi-build` already asks for test-driven development when implementing behavior; `/pi-test` is useful for focused test work or another verification pass.

### Working artifacts

Default conventions in the upstream workflows are:

| Artifact | Purpose |
|----------|---------|
| `SPEC.md` | Requirements, boundaries, and success criteria; larger multi-capability work can use a capability map and module-specific specs |
| `tasks/plan.md` | Approach, dependencies, risks, and checkpoints |
| `tasks/todo.md` | Ordered tasks, acceptance criteria, verification, and completion status |
| `CONSTRAINTS.md` | The agreed quality bar when using the constraints workflow |

Follow an existing specification system or designated external task tracker instead of creating duplicate sources of truth. Do not overwrite an incomplete plan for unrelated work. Keep artifacts current as scope changes, and record what verification actually ran against which state.

## All 9 commands

Pass the feature, task, diff, report, or scope after the command. The `pi-` prefix avoids taking over generic lifecycle names such as `/review`.

| Command | Workflow loaded after Pi integration | Use when / scope |
|---------|--------------------------------------|------------------|
| `/pi-spec` | [spec-driven-development](vendor/agent-skills/skills/spec-driven-development/SKILL.md) | Requirements are missing or unclear; define the feature before implementation |
| `/pi-plan` | [planning-and-task-breakdown](vendor/agent-skills/skills/planning-and-task-breakdown/SKILL.md) | A specification or clear goal needs ordered, verifiable tasks |
| `/pi-build` | [incremental-implementation](vendor/agent-skills/skills/incremental-implementation/SKILL.md), plus [test-driven-development](vendor/agent-skills/skills/test-driven-development/SKILL.md) for behavior | Implement one approved slice; not an autonomous whole-plan run |
| `/pi-test` | [test-driven-development](vendor/agent-skills/skills/test-driven-development/SKILL.md) | Add tests, reproduce a bug test-first, or explicitly run existing tests |
| `/pi-constraints` | [constraint-driven-development](vendor/agent-skills/skills/constraint-driven-development/SKILL.md) | Agree on quality thresholds; tool installation and CI changes still require approval |
| `/pi-review` | [code-review-and-quality](vendor/agent-skills/skills/code-review-and-quality/SKILL.md) | Inspect a requested change and report actionable findings without silently applying fixes |
| `/pi-webperf` | [performance-optimization](vendor/agent-skills/skills/performance-optimization/SKILL.md), plus [browser-testing-with-devtools](vendor/agent-skills/skills/browser-testing-with-devtools/SKILL.md) when live browser tooling is available | Analyze supplied reports or approved measurements; do not invent metrics or assume browser tools are installed |
| `/pi-code-simplify` | [code-simplification](vendor/agent-skills/skills/code-simplification/SKILL.md) | Simplify approved code while preserving behavior and tests; review-only requests remain read-only |
| `/pi-ship` | [shipping-and-launch](vendor/agent-skills/skills/shipping-and-launch/SKILL.md) | Assess a release's readiness and rollback strategy; no automatic deployment or multi-agent fan-out |

Examples:

```text
/pi-test Run the existing tests for task 1 and report results without changing code.
/pi-constraints Agree on accessibility and test coverage requirements for this project.
/pi-code-simplify Simplify the approved parser code without changing behavior.
/pi-webperf Analyze this Lighthouse report; explain what is measured and what is missing.
/pi-ship Assess release readiness. Do not deploy, publish, merge, or push.
```

## All 26 skills

The links below open the actual instructions. Skills are available through `/skill:<name>` and can also be selected by the model when their descriptions match your request. Catalog groups describe typical use, not rigid restrictions.

### Pi integration: 1 new downstream skill

| Skill | Purpose | Use when |
|-------|---------|----------|
| [pi-agent-workflow](skills/pi-agent-workflow/SKILL.md) | Map workflow instructions onto available Pi capabilities and approved scope | Using this package's prompts or encountering another host's tool names |

### Discovery: 1 upstream skill

| Skill | Purpose | Use when |
|-------|---------|----------|
| [using-agent-skills](vendor/agent-skills/skills/using-agent-skills/SKILL.md) | Identify which engineering workflow fits the task | You need help choosing a skill; do not preload a second always-on router alongside native skill routing |

### Define: 4 upstream skills

| Skill | Purpose | Use when |
|-------|---------|----------|
| [interview-me](vendor/agent-skills/skills/interview-me/SKILL.md) | Clarify the underlying intent through one-question-at-a-time interviewing | The request leaves important needs or assumptions unspecified |
| [idea-refine](vendor/agent-skills/skills/idea-refine/SKILL.md) | Explore alternatives, evaluate assumptions, and converge on a concrete idea | An idea is vague or needs stress-testing before specification |
| [spec-driven-development](vendor/agent-skills/skills/spec-driven-development/SKILL.md) | Define requirements, success criteria, and boundaries before code | Starting a substantial feature, project, or change without an adequate spec |
| [constraint-driven-development](vendor/agent-skills/skills/constraint-driven-development/SKILL.md) | Establish quality requirements and detect attempts to weaken them | Quality thresholds are missing or checks are being silenced to get green |

### Plan: 1 upstream skill

| Skill | Purpose | Use when |
|-------|---------|----------|
| [planning-and-task-breakdown](vendor/agent-skills/skills/planning-and-task-breakdown/SKILL.md) | Decompose work into small tasks with dependencies and verification | Clear requirements exist but the implementation order or scope is unclear |

### Build and design: 7 upstream skills

| Skill | Purpose | Use when |
|-------|---------|----------|
| [incremental-implementation](vendor/agent-skills/skills/incremental-implementation/SKILL.md) | Deliver thin, verifiable slices rather than a large untested change | Implementing a multi-file change or the next planned task |
| [test-driven-development](vendor/agent-skills/skills/test-driven-development/SKILL.md) | Use the red-green-refactor loop and regression tests | Adding behavior, fixing a bug, or changing existing logic |
| [context-engineering](vendor/agent-skills/skills/context-engineering/SKILL.md) | Load relevant rules, code, decisions, and task context | Starting or resuming a session, switching tasks, or recovering degraded output |
| [source-driven-development](vendor/agent-skills/skills/source-driven-development/SKILL.md) | Check implementation decisions against official documentation | Using a framework or library where remembered patterns may be outdated |
| [doubt-driven-development](vendor/agent-skills/skills/doubt-driven-development/SKILL.md) | Challenge assumptions and non-trivial decisions with adversarial review | The work is unfamiliar, high-stakes, or cheaper to verify now than repair later; independent context needs available, authorized tooling |
| [frontend-ui-engineering](vendor/agent-skills/skills/frontend-ui-engineering/SKILL.md) | Design accessible, responsive interfaces and components | Building or changing pages, layouts, UI state, or accessibility behavior |
| [api-and-interface-design](vendor/agent-skills/skills/api-and-interface-design/SKILL.md) | Design stable contracts and module boundaries | Creating APIs, endpoints, type contracts, or frontend/backend interfaces |

### Verify and debug: 2 upstream skills

| Skill | Purpose | Use when |
|-------|---------|----------|
| [browser-testing-with-devtools](vendor/agent-skills/skills/browser-testing-with-devtools/SKILL.md) | Inspect browser runtime evidence such as DOM, console, network, and traces | Verifying browser-facing behavior with separately configured Chrome DevTools MCP/browser capabilities |
| [debugging-and-error-recovery](vendor/agent-skills/skills/debugging-and-error-recovery/SKILL.md) | Reproduce, localize, and fix a root cause with a regression guard | Tests fail, builds break, or behavior differs from expectations |

### Review and quality: 4 upstream skills

| Skill | Purpose | Use when |
|-------|---------|----------|
| [code-review-and-quality](vendor/agent-skills/skills/code-review-and-quality/SKILL.md) | Review correctness, readability, architecture, security, and performance | Inspecting a diff or PR before merge |
| [code-simplification](vendor/agent-skills/skills/code-simplification/SKILL.md) | Improve clarity without changing observable behavior | Working code has avoidable complexity; preserve its original third-party attribution |
| [security-and-hardening](vendor/agent-skills/skills/security-and-hardening/SKILL.md) | Assess input boundaries, authentication, dependencies, and privacy/security risks | Handling untrusted data, sessions, external integrations, or personal information |
| [performance-optimization](vendor/agent-skills/skills/performance-optimization/SKILL.md) | Measure bottlenecks and validate improvements | Investigating load time, Core Web Vitals, backend, query, or database regressions |

### Ship and operate: 6 upstream skills

| Skill | Purpose | Use when |
|-------|---------|----------|
| [git-workflow-and-versioning](vendor/agent-skills/skills/git-workflow-and-versioning/SKILL.md) | Organize commits, branches, changes, and versioning | Preparing approved Git operations or a release; installing the skill does not authorize a push |
| [ci-cd-and-automation](vendor/agent-skills/skills/ci-cd-and-automation/SKILL.md) | Design automated test, build, and delivery gates | Setting up or changing a pipeline with explicit approval |
| [deprecation-and-migration](vendor/agent-skills/skills/deprecation-and-migration/SKILL.md) | Plan removal and migration without abandoning compatibility needs | Retiring an API/system or changing production data structures |
| [documentation-and-adrs](vendor/agent-skills/skills/documentation-and-adrs/SKILL.md) | Record architectural reasoning and maintain useful documentation | Making design decisions, changing APIs, or shipping features |
| [observability-and-instrumentation](vendor/agent-skills/skills/observability-and-instrumentation/SKILL.md) | Make production behavior diagnosable through logs, metrics, traces, and alerts | Instrumenting a feature or investigating operations without enough evidence |
| [shipping-and-launch](vendor/agent-skills/skills/shipping-and-launch/SKILL.md) | Plan readiness checks, staged rollout, monitoring, and rollback | Assessing what is needed before an approved production launch |

## Personas and shared references

### Four reference personas

These are reusable perspectives, **not registered Pi skills, commands, or subagents**. Ask an available agent to read and apply a persona when appropriate; do not claim a separate reviewer ran if the work stayed in the same session.

| Persona | Perspective |
|---------|-------------|
| [code-reviewer](vendor/agent-skills/agents/code-reviewer.md) | Code correctness and maintainability |
| [security-auditor](vendor/agent-skills/agents/security-auditor.md) | Threats, vulnerabilities, and hardening |
| [test-engineer](vendor/agent-skills/agents/test-engineer.md) | Test strategy, coverage, and regression evidence |
| [web-performance-auditor](vendor/agent-skills/agents/web-performance-auditor.md) | Web performance evidence and measurement limitations |

Slaver integration is deferred. This package does not automatically register these personas as Slaver roles or provide parallel delegation.

### Seven shared checklists

| Reference | Helps with |
|-----------|------------|
| [definition-of-done](vendor/agent-skills/references/definition-of-done.md) | The project-wide completion bar, alongside per-task acceptance criteria |
| [testing-patterns](vendor/agent-skills/references/testing-patterns.md) | Test structure, examples, and common testing mistakes |
| [security-checklist](vendor/agent-skills/references/security-checklist.md) | Security boundaries, input validation, authentication, and data handling |
| [performance-checklist](vendor/agent-skills/references/performance-checklist.md) | Performance targets and measurement checks |
| [accessibility-checklist](vendor/agent-skills/references/accessibility-checklist.md) | Keyboard, screen-reader, visual, and interaction checks |
| [observability-checklist](vendor/agent-skills/references/observability-checklist.md) | Logs, metrics, traces, alerts, and operational readiness |
| [orchestration-patterns](vendor/agent-skills/references/orchestration-patterns.md) | Upstream orchestration guidance; not an installed orchestration runtime |

Shared references remain alongside the upstream skills so their relative paths work. Install the complete package rather than copying one isolated `SKILL.md`.

## Common task recipes

| Situation | Starting point | What to keep explicit |
|-----------|----------------|-----------------------|
| New feature or project | `/pi-spec`, then an approved `/pi-plan` | Requirements and boundaries before product code |
| Next task in an approved plan | `/pi-build` with the task identifier | One slice, changed paths, and real test evidence |
| Small reproducible bug | Describe the bug and request debugging/TDD, or invoke the relevant skill directly | Reproduce it before fixing; a full new project spec is usually unnecessary |
| Test-only verification | `/pi-test Run the existing tests without editing code` | Report failures and missing tooling rather than assuming green |
| Review without edits | `/pi-review` with the diff or scope | Findings first; applying fixes is a separate request |
| Refactoring | `/pi-code-simplify` | Preserve behavior and test expectations |
| Slow web page | `/pi-webperf` with a report or approved target | Distinguish measured data from guesses and lab from field data |
| Release assessment | `/pi-ship` | Readiness is not deployment authorization |

A plain-language request can also work:

```text
Help me implement a login feature. Explain one step at a time, identify the
workflow you are using, and ask before implementation, commits, or deployment.
```

## If you forget where you stopped

Use the repository's working artifacts as memory, not the model's recollection of a previous conversation. Start a new session in the same project and ask:

```text
I forgot the latest progress. Read the specification, tasks/plan.md, and
tasks/todo.md that exist, or the designated task tracker.

Tell me:
1. What is complete and what evidence supports it.
2. What remains incomplete or blocked.
3. One recommended next step and the approval it needs.

Do not edit files or begin implementation yet. If artifacts are missing,
report that instead of inventing project history.
```

Ask for a short recap after each task: **current stage, completed work, verification, next step, and required approval**. Keep task status current without creating a competing tracker. Re-run relevant checks when the code has changed since the recorded evidence.

## Capabilities and limitations

- **No executable extension or automatic hooks.** Installation exposes skills and prompts; optional bundled helper scripts do not run merely because the package was installed.
- **No automatic multi-agent execution.** Personas are reference text. Independent delegation needs a separately configured, authorized runtime, and this package has no automatic Slaver adapter.
- **No browser tooling installed.** Live browser work needs separate capabilities such as Chrome DevTools MCP. Supplied reports can still be analyzed; missing checks must be labeled blocked.
- **No blanket autonomous build.** `/pi-build` works on one approved slice. It does not reproduce upstream host-specific `/build auto` orchestration.
- **No automatic release actions.** `/pi-ship` requests assessment, not permission to deploy, publish, merge, or push.
- **No guaranteed enforcement or OS sandbox.** Workflow instructions do not replace real tool permissions, project trust, human approval, or isolation.
- **No approval inferred from a saved note alone.** Read the actual artifacts and confirm the intended scope rather than treating stale progress as current authorization.

## Troubleshooting

| Problem | Check |
|---------|-------|
| `/pi-*` command is not recognized | Run `/reload`; use `pi list` to confirm installation and `pi config` to inspect enabled resources |
| Project-local package is missing | Confirm installation used `--local` and project trust is granted |
| A relevant skill was not loaded | Ask explicitly or use `/skill:<name>`; model selection is not infallible |
| A command or skill collides with another package | Read startup diagnostics, filter/select resources with `pi config`, and keep one intended definition |
| Browser metrics or another capability are unavailable | Provide collected evidence or approve the appropriate tooling setup; do not treat an unavailable check as passed |
| Updated files are not visible | Update the same source, then `/reload`; pinned sources intentionally stay on their selected ref |
| Bundled reference paths break | Install the complete package and resolve references from the loaded skill's directory, not the user's working directory |

## Documentation

- [Pi usage](docs/pi-usage.md): installation, resource discovery, arguments, and host capability differences.
- [Complete upstream documentation index](docs/upstream-reference.md): all 17 original `docs/` files, including adoption, onboarding, comparison, and other-host setup guides.
- [Contributing](CONTRIBUTING.md) and [independent maintenance](MAINTENANCE.md): downstream review and release rules.

Upstream documents are preserved reference material, not promises of Pi features or setup instructions for this independent project. Their original host commands, project names, and links are unchanged. Some links target excluded upstream artifacts; the index explains how to find those in the pinned source repository.

## Origin and new contributions

| Paths | Origin |
|-------|--------|
| `vendor/agent-skills/**` | 66 upstream files, including all 17 upstream documents, preserved byte-for-byte at the pinned revision |
| `LICENSE` | Exact copy of the upstream MIT license and copyright notice |
| `LICENSES/Apache-2.0-code-simplifier.txt` | Exact third-party license copy for the explicitly credited simplifier adaptation |
| `skills/pi-agent-workflow/`, `prompts/`, `scripts/`, `test/`, root documentation and CI | New pi-agent-skills contributions, not written by or attributed to upstream authors |

The foundation is pinned to [`aeac41d4d005999432bb7312f7ff06383a91d59d`](https://github.com/addyosmani/agent-skills/commit/aeac41d4d005999432bb7312f7ff06383a91d59d). [UPSTREAM.json](UPSTREAM.json) records source paths, revisions, excluded files, and SHA-256 hashes. No upstream Git history or remotes were imported. [MODIFICATIONS.md](MODIFICATIONS.md) records significant downstream changes. Catalog descriptions summarize the credited workflows; they do not relabel upstream work as new authorship.

## Development

Node.js 22.19 or newer is required for local validation. There are no npm dependencies and no dependency-install step is needed:

```sh
npm run check
npm test
npm pack --dry-run --ignore-scripts
```

The checks cover provenance, notices, skill structure, shared reference paths, prompt routing, README catalog coverage and relative links, and distributed package contents. They do not prove that every model will follow a workflow correctly. Inspect real outputs and blocked checks during use.

## Licenses

- Reused upstream material: [MIT](LICENSE), including `Copyright (c) 2025 Addy Osmani`. Existing attributions remain intact.
- New contributions only: [MIT](LICENSES/MIT-pi-agent-skills.txt).
- The upstream `code-simplification` skill explicitly credits an Anthropic plugin adaptation. Its separately reviewed [Apache-2.0 license](LICENSES/Apache-2.0-code-simplifier.txt) is included conservatively for any incorporated third-party expression. This is not a blanket relicensing of upstream work.

The combined distribution declares `MIT AND Apache-2.0`. Preserve the applicable licenses and notices when redistributing. See [NOTICE](NOTICE) and [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) for scope and audit details.
