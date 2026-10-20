# Third-party notices and import audit

Audit date: 2026-10-14. The initial source-level audit and the documentation expansion review were completed before their respective material was integrated into omp-agent-skills.

## 1. agent-skills

- Source: https://github.com/addyosmani/agent-skills
- Revision: `aeac41d4d005999432bb7312f7ff06383a91d59d`
- Copyright notice: `Copyright (c) 2025 Addy Osmani`
- License: MIT, preserved byte-for-byte in [LICENSE](LICENSE) and [vendor/agent-skills/LICENSE](vendor/agent-skills/LICENSE).
- Imported scope: all `skills/`, `agents/`, `references/` and `docs/` files; the skill and reference-link validators and their unit tests. These 66 files are unchanged apart from their containing directory's location. All 17 upstream documents are preserved as reference material, separate from the newly authored omp guides.
- Authorship: upstream work belongs to its authors and contributors. New project branding does not transfer authorship.

All 217 Git-tracked paths were enumerated, including dotfiles and file modes. The audit searched for license/notice filenames and in-file copyright, SPDX, license and source/adaptation markers. `LICENSE` was the only license/notice-named file found in that tree. The explicit third-party adaptation below was investigated separately rather than assumed to be covered only by the root MIT license.

The full imported-file hashes, source Git blob IDs and 151 excluded paths are recorded in [UPSTREAM.json](UPSTREAM.json). Git's generated sample hooks were not tracked upstream files and were not copied.

Before expanding the original three-document subset, all 17 tracked upstream documents were reviewed for license, copyright, source/adaptation markers and linked resources. No additional file-specific license notices were found in those documents. Their external references, suggested tools and example setup commands were not downloaded, installed or executed. [The upstream documentation index](docs/upstream-reference.md) distinguishes these original reference documents from this package's omp capabilities.

## 2. Anthropic Code Simplifier adaptation

The first attribution paragraph of `vendor/agent-skills/skills/code-simplification/SKILL.md` explicitly states that it is inspired by the Claude Code Simplifier plugin and adapted as a model-agnostic skill. That paragraph is retained exactly.

The referenced plugin was inspected separately:

- Repository: https://github.com/anthropics/claude-plugins-official
- License: Apache License, Version 2.0
- Full license text: [LICENSES/Apache-2.0-code-simplifier.txt](LICENSES/Apache-2.0-code-simplifier.txt)

The plugin is not otherwise vendored. The Apache license is retained conservatively for incorporated third-party expression. The original inspiration and adaptation notice is not removed.

## 3. Distribution obligations

Keep the complete applicable license texts, copyright notices and attribution paragraphs in every distribution. Do not replace upstream authorship with omp-agent-skills authorship. When changing imported material, preserve the original notice and record the original path/revision, the downstream changes and their reason. Modified Apache-derived files must also carry a prominent change notice in the file itself. Follow [MAINTENANCE.md](MAINTENANCE.md) before any new import.

## 4. omp integration

The omp plugin manifest, marketplace catalog, lifecycle commands, integration skill, validation, tests and revised documentation are new omp-agent-skills contributions. They are licensed under [LICENSES/MIT-omp-agent-skills.txt](LICENSES/MIT-omp-agent-skills.txt). They do not change the license of any upstream file.
