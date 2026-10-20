---
name: omp-agent-workflow
description: Applies omp-agent-skills engineering workflows using the capabilities available in omp. Use when starting a workflow from this package, invoking its lifecycle commands, or translating upstream host-specific instructions into an omp session.
license: MIT
metadata:
  origin: omp-agent-skills original contribution
---

# omp Agent Workflow

## Overview

Use the credited upstream workflows in omp without assuming another host's tool names, hooks or delegation model. This integration guidance is new omp-agent-skills work; it does not claim authorship of the upstream skills.

## When to Use

- Starting a lifecycle workflow through this package's `/omp-*` commands.
- Loading an upstream skill that mentions host-specific tools or commands.
- Deciding whether the available omp environment can perform a requested check.
- Not a substitute for reading the actual workflow or for obtaining user approval.

## Process

1. Locate the relevant skill in omp's advertised skills. Read its `SKILL.md` using the supplied absolute path; do not substitute memory or the description for the full workflow.
2. Keep the workflow's acceptance criteria and verification steps, but implement them with available capabilities. Respect higher-priority instructions, permissions and the user's approved scope.
3. Translate tool names by capability. File reads use `read`; content and path searches use `grep` and `glob`; shell commands use `bash`; changes use `edit` or `write`; delegation uses `task` when it is available and approved; questions use `ask` when available; browser work uses `browser` when configured. Never invent a tool call.
4. Resolve bundled references relative to the loaded skill directory. Treat paths for new task or specification artifacts as paths in the user's project. For an optional helper such as `scripts/idea-refine.sh`, use the helper's absolute package path and the user's project working directory, and run it only within approved scope.
5. Treat upstream personas as reference perspectives unless an omp delegation capability is explicitly configured and authorized. Do not claim a fresh-context or independent review when work happened in the same session. Installing this package does not register subagents or execute hooks.
6. If browser tooling, documentation access, delegation or another required capability is missing, state what is unavailable. Offer a narrower verifiable approach or ask for setup approval. Do not fabricate evidence or silently skip required gates.
7. Implement only the approved slice. A readiness request does not authorize deployment, publishing, pushing, merging, destructive actions or expanded autonomous work.
8. Finish with actual commands and results, changed paths, remaining risks and any blocked checks. If verification cannot run, report it as blocked rather than passed.

## omp Boundaries

- Plan mode is a separate omp mode. These commands do not enable it. Use plan mode when the user wants a read-only planning gate before implementation.
- The active approval mode is controlled by omp settings and launch flags. These commands do not grant tool permissions or change approval policy.
- `AGENTS.md`, `RULES.md` and direct user instructions have higher priority than this package.
- The package provides instructions and command entry points. It does not install hooks, subagents, browser tooling or a workflow engine.
- A command can ask for a gate; omp enforces only the permissions and policies that are actually configured.

## Common Rationalizations

| Rationalization | Reality |
|-----------------|---------|
| The upstream command can be executed literally in every host | Hosts have different tools and resource conventions; map capabilities explicitly. |
| A bundled persona means delegation is installed | Persona text is not an executable delegation integration. |
| The measurements are probably good enough | Report only collected evidence and distinguish blocked checks. |
| Installing a workflow grants permission to ship | Scope and explicit release approval still apply. |
| The command ran, so the verification must have passed | A command is a request for work. Check actual tool output before claiming a result. |

## Red Flags

- Claiming a tool, hook or subagent exists without checking the environment.
- Resolving package references from the user's project directory.
- Running a helper against the package directory instead of the user's project.
- Inventing independent review, test results or browser measurements.
- Treating workflow text as a way to bypass permissions or user approval.
- Reporting a gate as passed without running the required check.

## Verification

- [ ] The selected workflow's full instructions were read.
- [ ] References were resolved from their actual package location.
- [ ] Necessary tools exist, or limitations are explicitly reported.
- [ ] Changes stayed within approved scope and retained required verification.
- [ ] Reported results come from actual evidence, not assumed execution.
