# Significant downstream modifications

Changes are relative to agent-skills at `aeac41d4d005999432bb7312f7ff06383a91d59d`. Dates describe omp-agent-skills work, not upstream release dates.

## 2026-10-20 - Native omp packaging, version 0.2.0

| Change | Scope | Origin and reason |
|--------|-------|-------------------|
| Replaced the legacy package manifest with an omp plugin manifest and marketplace catalog | `package.json`, `.omp-plugin/plugin.json`, `.omp-plugin/marketplace.json` | The package is now installed and discovered through omp plugin and marketplace surfaces |
| Added explicit skill and command path mapping | `.omp-plugin/plugin.json`, `.claude-plugin/plugin.json` | Both the local integration skill and the vendored upstream skills must load; commands live under `commands/` and are exposed under the `omp:` plugin namespace |
| Replaced nine legacy lifecycle prompt templates with nine commands | `commands/*.md` | Native omp command files use Markdown frontmatter and `$ARGUMENTS`; plugin installation namespaces them under `omp:` and the review command avoids the built-in `/review` |
| Replaced the legacy integration skill with an omp integration skill | `skills/omp-agent-workflow/SKILL.md` | Maps upstream workflows to omp tools, plan mode, approvals and delegation boundaries |
| Replaced the legacy usage guide with an omp usage guide | `docs/omp-usage.md`, `docs/upstream-reference.md` | Documents native install, discovery, capability mapping and troubleshooting for omp |
| Rewrote the README for omp | `README.md` | Covers installation, workflow stages, all commands, all skills, boundaries and session recovery |
| Updated checks and tests | `scripts/check-project.mjs`, `test/*.test.mjs` | Validate plugin manifests, command layout, skill inventory and package contents |
| Updated notices and maintenance records | `NOTICE`, `THIRD_PARTY_NOTICES.md`, `LICENSES/MIT-omp-agent-skills.txt`, `AGENTS.md`, `CONTRIBUTING.md`, `MAINTENANCE.md`, `CHANGELOG.md` | Remove the legacy identity, preserve upstream attribution and document omp maintenance |
| Removed the legacy installation, prompt and usage surfaces | `prompts/`, legacy package fields and legacy documentation | omp is the supported target |
| Renamed the repository identity and install links to `omp-agent-skills` | `package.json`, plugin manifests, README, usage, maintenance and tests | The package and repository now share the omp-agent-skills name |

## 2026-10-14 - Independent foundation, version 0.1.0

| Change | Scope | Origin and reason |
|--------|-------|-------------------|
| Created a new independent project from a pinned, audited upstream foundation | Project root | New identity; no imported upstream Git history or implied endorsement |
| Imported 66 portable upstream files into `vendor/agent-skills/` | 25 skills, four personas, seven references, 17 documents and validation/test files | Reused upstream content is byte-for-byte unchanged; the relative layout preserves shared reference paths |
| Preserved upstream MIT and third-party Apache-2.0 notices | `LICENSE`, `LICENSES/`, `NOTICE`, `UPSTREAM.json` | Required notice preservation; no replacement ownership claim |
| Added provenance, integrity, packaging and distribution checks | `scripts/`, `test/`, `.github/workflows/check.yml`, `MODIFICATIONS.md` | Downstream safeguards; upstream validators remain credited and unchanged |
| Reserved publication for a later explicit release decision | `package.json` has `private: true` | No registry publication or release tag is implied |

No imported source file's content has been modified. `UPSTREAM.json` therefore has an empty `modifications` list. New files are separate contributions, not relabeled upstream work.

## Future entries

For every significant change, record the date and release, affected paths, behavior change and reason. For imported-file edits, retain the original hashes in `UPSTREAM.json`, record the current hash and a reviewable explanation in its `modifications` list, and add a prominent change notice without deleting earlier notices. Never silently update baseline hashes to disguise downstream edits.
