# Using the package in Pi

This guide and the prompt templates are new pi-agent-skills contributions. All 17 original documents under `vendor/agent-skills/docs/` describe the upstream project and other hosts; they are source context, not promises about this integration. See the [complete upstream documentation index](upstream-reference.md) for the archived guides, their origin and links to upstream artifacts not included in this package. Use this guide for Pi-specific installation and capability decisions.

## Loading resources

Pi reads the explicit `pi.skills` and `pi.prompts` entries in `package.json`. The complete vendor layout travels with the package, so upstream `../../references/` paths keep working. Do not copy only a single `SKILL.md` out of the package.

### Git installation

Install from the independent GitHub repository over SSH:

```sh
pi install git:git@github.com:alduraimron/pi-agent-skills.git
```

This requires Git and authenticated SSH read access. The HTTPS alternative is `pi install git:github.com/alduraimron/pi-agent-skills`; private repositories still require authentication. Use `--local` for project scope, then run `/reload` in an existing Pi session.

Update an unpinned SSH source with `pi update git:git@github.com:alduraimron/pi-agent-skills.git`. To uninstall, use `pi remove git:git@github.com:alduraimron/pi-agent-skills.git` with the same scope. Use the HTTPS source instead for both operations if that was your install source. For a reproducible install, append `@<commit-or-tag>` to the source once the desired ref exists; pinned refs do not advance automatically.

The `private: true` package flag prevents npm publication, not Git installation. Installing this package does not publish anything or authorize the agent to push.

### Local installation

Install a reviewed local checkout with `pi install /absolute/path/to/pi-agent-skills`. Use `--local` for project scope. In an existing session run `/reload`. To uninstall, use `pi remove /absolute/path/to/pi-agent-skills` with the same scope.

For a temporary session without changing saved settings:

```sh
pi --skill /absolute/path/to/pi-agent-skills/skills \
   --skill /absolute/path/to/pi-agent-skills/vendor/agent-skills/skills \
   --prompt-template /absolute/path/to/pi-agent-skills/prompts
```

Pi advertises skill names and descriptions, loading the full text only when needed. `/skill:name` explicitly loads one; arguments after the name become the user's request. Prompt filenames define the `/pi-*` commands, and `$ARGUMENTS` in those templates expands to the arguments supplied by the user. Templates instruct the model to read workflows; they are not executable commands or nested slash-command expansions.

## Differences from upstream hosts

- Upstream skills are unchanged. Some mention host-specific tool names such as `Read`, `Glob`, `Bash` or `AskUserQuestion`. Use equivalent available Pi capabilities; ask questions in the conversation if there is no question tool.
- New prompt templates first load `pi-agent-workflow` to explain this capability mapping. When invoking upstream skills directly, load `/skill:pi-agent-workflow` first if host-specific assumptions are relevant.
- Resolve bundled references from the loaded skill's actual directory, not the user's working directory. The idea-refine helper is under that skill's `scripts/idea-refine.sh`; if explicitly approved, execute its absolute path with the user's project as the working directory so output belongs to the user's project.
- `agents/` files are reference personas. Pi does not register or spawn these as subagents just because they are bundled. Use an explicitly configured delegation extension only if available and authorized, or apply review perspectives sequentially without pretending they were independent reviews.
- No upstream session-start, source-cache or simplify hooks are installed. Installing a skill does not run its helper scripts.
- Browser skills require separate browser capabilities. Report missing tooling and do not invent measurements or claim that a browser audit ran.
- `/pi-build` requests one approved slice, not upstream's autonomous `build auto` behavior. `/pi-ship` is a readiness assessment, not authorization to deploy, publish, merge or push.
- Workflow verification remains an instruction to the agent. It is not guaranteed enforcement, and project trust is not a sandbox. Respect actual system instructions, permissions and user-approved scope.

## Discovery issues

Check startup diagnostics and use `/reload`. If another installed pack exposes the same upstream skill names, Pi keeps the first discovered definition and warns about the collision. Disable/filter the other pack or select one explicitly; do not silently rename upstream compatibility identifiers. Prefixed prompt names avoid ordinary lifecycle-command collisions, but extensions with identical names can still take precedence.

## Reference documentation

The integration follows the installed Pi documentation for [skills](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/skills.md), [packages](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/packages.md) and [prompt templates](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/prompt-templates.md). Local discovery was designed against Pi 1.2.0. This package has no runtime npm dependencies on Pi and does not redistribute its implementation.
