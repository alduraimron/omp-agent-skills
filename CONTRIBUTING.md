# Contributing to pi-agent-skills

Contributions here are reviewed and maintained independently of agent-skills. Upstream authors are credited for their work, not listed as maintainers of this project.

## Change rules

- Preserve legally required licenses, copyrights and attribution. Check third-party terms before copying material.
- Keep original work separate from imports. New Pi code, prompts and docs belong outside `vendor/agent-skills/` unless an imported-file change is intentional and documented.
- Do not claim authorship of upstream content or imply an upstream author's endorsement.
- Prefer explicit, verifiable workflows. Do not promise hooks, tools, subagents or browser integrations that this package does not provide.
- Keep shared reference paths intact. Install/distribute the package, not isolated copies of skill directories.
- Record significant changes in `MODIFICATIONS.md` and release changes in `CHANGELOG.md`.
- Follow [MAINTENANCE.md](MAINTENANCE.md) for imports, downstream-file change notices and releases.

Original contributions are offered under [LICENSES/MIT-pi-agent-skills.txt](LICENSES/MIT-pi-agent-skills.txt). That license applies only to your contributions; it does not overwrite licenses on existing upstream or third-party work.

## Verify a change

Use Node.js 22.19 or newer. No dependency installation is required:

```sh
npm run check
npm test
npm pack --dry-run --ignore-scripts
```

Include evidence of the checks and explain changed behavior. Validate prompts with the installed Pi version when changing discovery or argument handling. Manual integration testing must not silently modify a user's global Pi settings or start paid model requests.

Use [this project's issue tracker](https://github.com/alduraimron/pi-agent-skills/issues) and pull requests in [alduraimron/pi-agent-skills](https://github.com/alduraimron/pi-agent-skills) for downstream review. Do not treat the upstream issue tracker as downstream support. Pushes and releases require separate, explicit approval; preparing a contribution does not authorize publishing it.
