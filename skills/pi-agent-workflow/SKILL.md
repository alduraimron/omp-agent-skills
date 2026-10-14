---
name: pi-agent-workflow
description: Applies pi-agent-skills engineering workflows using the capabilities actually available in Pi. Use when starting a workflow from this package, invoking its lifecycle prompts, or translating upstream host-specific instructions into a Pi session.
license: MIT
metadata:
  origin: pi-agent-skills original contribution
---

# Pi Agent Workflow

## Overview

Use the credited upstream workflows in Pi without assuming another host's tool names, hooks or delegation model. This integration guidance is new pi-agent-skills work; it does not claim authorship of the upstream skills.

## When to Use

- Starting a lifecycle workflow through this package's `/pi-*` prompts.
- Loading an upstream skill that mentions host-specific tools or commands.
- Deciding whether the available environment can perform a requested check.
- Not a substitute for reading the actual workflow or for obtaining user approval.

## Process

1. Locate the relevant skill in Pi's advertised skills. Read its `SKILL.md` using the supplied absolute path; do not substitute memory or the description for the full workflow.
2. Keep the workflow's acceptance criteria and verification steps, but implement them with available capabilities. Respect higher-priority instructions, permissions and the user's approved scope.
3. Translate tool names by capability: file reads use `read`; content/path searches use available search tools; shell commands use `bash` or `powershell`; changes use `edit` or `write`. If a question tool is unavailable, ask in the conversation and wait when an answer is required. Never invent a tool call.
4. Resolve bundled references relative to the loaded skill directory. Treat paths for new task/spec artifacts as paths in the user's project. For an optional helper such as `scripts/idea-refine.sh`, use the helper's absolute package path and the user's project working directory, and run it only within approved scope.
5. Treat upstream personas as reference perspectives unless a delegation capability is explicitly configured and authorized. Do not claim a fresh-context or independent review when work happened in the same session. Installing this package does not register subagents or execute hooks.
6. If browser tooling, documentation access, delegation or another required capability is missing, state what is unavailable. Offer a narrower verifiable approach or ask for setup approval. Do not fabricate evidence or silently skip required gates.
7. Implement only the approved slice. A readiness request does not authorize deployment, publishing, pushing, merging, destructive actions or expanded autonomous work.
8. Finish with actual commands/results, changed paths, remaining risks and any blocked checks. If verification cannot run, report it as blocked rather than passed.

## Common Rationalizations

| Rationalization | Reality |
|-----------------|---------|
| The upstream command can be executed literally in every host | Hosts have different tools and resource conventions; map capabilities explicitly. |
| A bundled persona means delegation is installed | Persona text is not an executable delegation integration. |
| The measurements are probably good enough | Report only collected evidence and distinguish blocked checks. |
| Installing a workflow grants permission to ship | Scope and explicit release approval still apply. |

## Red Flags

- Claiming a tool, hook or subagent exists without checking the environment.
- Resolving package references from the user's project directory.
- Running a helper against the package directory instead of the user's project.
- Inventing independent review, test results or browser measurements.
- Treating workflow text as a way to bypass permissions or user approval.

## Verification

- [ ] The selected workflow's full instructions were read.
- [ ] References were resolved from their actual package location.
- [ ] Necessary tools exist, or limitations are explicitly reported.
- [ ] Changes stayed within approved scope and retained required verification.
- [ ] Reported results come from actual evidence, not assumed execution.
