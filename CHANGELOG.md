# Changelog

This is the independent omp-agent-skills release history, not the upstream agent-skills changelog.

## 0.2.0 - 2026-10-20

- Added native omp packaging: `.omp-plugin/plugin.json`, `.claude-plugin/plugin.json`, a one-plugin marketplace catalog, and explicit skill and command path mapping. The plugin identity is `omp`.
- Replaced the legacy package manifest and lifecycle prompt templates with omp-native lifecycle commands in `commands/`. Installed commands are exposed as `/omp:*`.
- Replaced the legacy integration skill with `omp-agent-workflow`, including omp capability mapping, plan mode and approval boundaries.
- Replaced the legacy usage guide with [omp usage](docs/omp-usage.md) and updated the upstream reference index.
- Rewrote the README for installation, commands, skills, personas, boundaries, recovery and troubleshooting in omp.
- Updated validation and regression tests for the omp plugin manifest, marketplace catalog, command layout and skill discovery.
- Preserved all 26 skills, all 66 audited upstream files, the upstream MIT license, the Apache-2.0 simplifier license and the pinned upstream revision.
- Removed the legacy installation, prompt, package, skill and documentation surfaces. The repository identity and install links now use `omp-agent-skills`.

## 0.1.0 - 2026-10-14

- Established an independently maintained workflow package from a pinned, audited upstream foundation.
- Preserved upstream MIT copyright and notices; included the separately reviewed Apache-2.0 simplifier license.
- Added an integration skill, nine lifecycle commands, provenance and integrity checks, regression tests, packaging checks and independent CI.
- Added explicit origin, non-endorsement, modification and maintenance records.

See [MODIFICATIONS.md](MODIFICATIONS.md) for path-level changes. Git distribution is available from the independently maintained repository. Unreleased entries describe changes not yet released; no release tag or npm publication is implied by this changelog.
