# Contributing to omp-agent-skills

Contributions here are reviewed and maintained independently of agent-skills. Upstream authors are credited for their work, not listed as maintainers of this project.

## Change rules

- Preserve legally required licenses, copyrights and attribution. Check third-party terms before copying material.
- Keep original work separate from imports. New omp commands, skills and docs belong outside `vendor/agent-skills/` unless an imported-file change is intentional and documented.
- Do not claim authorship of upstream content or imply an upstream author's endorsement.
- Prefer explicit, verifiable workflows. Do not promise hooks, tools, subagents or browser integrations that this package does not provide.
- Keep shared reference paths intact. Install or distribute the package, not isolated copies of skill directories.
- Keep `.omp-plugin/plugin.json` and `.omp-plugin/marketplace.json` consistent with the actual skill and command paths.
- Record significant changes in `MODIFICATIONS.md` and release changes in `CHANGELOG.md`.
- Follow [MAINTENANCE.md](MAINTENANCE.md) for imports, downstream-file change notices and releases.

Original contributions are offered under [LICENSES/MIT-omp-agent-skills.txt](LICENSES/MIT-omp-agent-skills.txt). That license applies only to your contributions; it does not overwrite licenses on existing upstream or third-party work.

## Verify a change

Use Node.js 22.19 or newer. No dependency installation is required:

```sh
npm run check
npm test
npm pack --dry-run --ignore-scripts
```

For packaging or command changes, smoke-test discovery in an isolated omp profile or temporary HOME:

```sh
omp plugin marketplace add /absolute/path/to/omp-agent-skills
omp plugin install omp@omp-agent-skills-marketplace
omp --mode rpc
```

The direct `omp plugin link` command does not load this package's marketplace skill and command manifests. Use the local marketplace flow for a full smoke test. Then request `get_available_commands` and confirm the `/omp:*` plugin commands and skill commands are present. Manual integration testing must not silently modify a user's global omp settings or start paid model requests.

Use [this project's issue tracker](https://github.com/alduraimron/omp-agent-skills/issues) and pull requests in [alduraimron/omp-agent-skills](https://github.com/alduraimron/omp-agent-skills) for downstream review. Do not treat the upstream issue tracker as downstream support. Pushes and releases require separate, explicit approval; preparing a contribution does not authorize publishing it.
