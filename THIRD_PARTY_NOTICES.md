# Third-party notices and import audit

Audit date: 2026-10-14. The initial source-level audit and the documentation expansion review were completed before their respective material was integrated into pi-agent-skills.

## 1. agent-skills

- Source: https://github.com/addyosmani/agent-skills
- Revision: `aeac41d4d005999432bb7312f7ff06383a91d59d`
- Copyright notice: `Copyright (c) 2025 Addy Osmani`
- License: MIT, preserved byte-for-byte in [LICENSE](LICENSE) and [vendor/agent-skills/LICENSE](vendor/agent-skills/LICENSE).
- Imported scope: all `skills/`, `agents/`, `references/` and `docs/` files; the skill and reference-link validators and their unit tests. These 66 files are unchanged apart from their containing directory's location. All 17 upstream documents are preserved as reference material, separate from the newly authored Pi guides.
- Authorship: upstream work belongs to its authors and contributors. New project branding does not transfer authorship.

All 217 Git-tracked paths were enumerated, including dotfiles and file modes. The audit searched for license/notice filenames and in-file copyright, SPDX, license and source/adaptation markers. `LICENSE` was the only license/notice-named file found in that tree. The explicit third-party adaptation below was investigated separately rather than assumed to be covered only by the root MIT license.

The full imported-file hashes, source Git blob IDs and 151 excluded paths are recorded in [UPSTREAM.json](UPSTREAM.json). Git's generated sample hooks were not tracked upstream files and were not copied.

Before expanding the original three-document subset, all 17 tracked upstream documents were reviewed for license, copyright, source/adaptation markers and linked resources. No additional file-specific license notices were found in those documents. Their external references, suggested tools and example setup commands were not downloaded, installed or executed. [The upstream documentation index](docs/upstream-reference.md) distinguishes these original reference documents from this package's Pi capabilities.

## 2. Anthropic Code Simplifier adaptation

The first attribution paragraph of `vendor/agent-skills/skills/code-simplification/SKILL.md` explicitly states that it is inspired by the Claude Code Simplifier plugin and adapted as a model-agnostic skill. That paragraph is retained exactly.

The referenced plugin was inspected separately:

- Repository: https://github.com/anthropics/claude-plugins-official
- Reviewed revision: `8bd00f08f0b04705e610cf132fbe2cf5ec44cfe3`
- [Referenced source](https://github.com/anthropics/claude-plugins-official/blob/8bd00f08f0b04705e610cf132fbe2cf5ec44cfe3/plugins/code-simplifier/agents/code-simplifier.md).
- [Plugin license](https://github.com/anthropics/claude-plugins-official/blob/8bd00f08f0b04705e610cf132fbe2cf5ec44cfe3/plugins/code-simplifier/LICENSE): Apache License, Version 2.0, not MIT.
- Local full-text copy: [LICENSES/Apache-2.0-code-simplifier.txt](LICENSES/Apache-2.0-code-simplifier.txt).
- License Git blob: `d645695673349e3947e8e5ae42332d0ac3164cd7`.
- License SHA-256: `cfc7749b96f63bd31c3c42b5c471bf756814053e847c10f3eb003417bc523d30`.

The repository root and plugin directory listings were checked for a separate `NOTICE`; none was present at the reviewed revision. The referenced source had no separate filled-in copyright notice to transcribe. We do not invent one or treat the example copyright placeholder in the Apache license appendix as an ownership claim.

We conservatively carry Apache-2.0 terms and attribution for any third-party expression incorporated into the upstream simplification skill. This does not assert that general engineering ideas are copyrighted, that every upstream file is Apache-licensed, or that the original plugin was copied into this project. The root MIT license remains intact, and the combined package declares `MIT AND Apache-2.0` rather than representing every bundled component as MIT-only.

## 3. Excluded and linked material

Not imported: upstream host-specific plugin metadata, commands, hooks, CI, evaluation cases/fixtures and their package manifests, contributor/context files, branding, README badges or externally hosted images. The upstream `.opencode/skills` symlink was also excluded. No npm dependencies, third-party libraries, registry rules, fonts or media are bundled.

Upstream references to Google's engineering practices and Software Engineering at Google are conceptual sources. External documents, Anthropic plugin source, browser tools and tools mentioned in examples were not copied or installed. Following a link or later installing a suggested tool is a separate licensing and security decision.

No other separate license notices were found in the imported subset. This is a bounded source and provenance review, not a guarantee about every external resource or a substitute for legal advice.

## 4. Redistributing and changing files

Keep the complete applicable license texts, copyright notices and attribution paragraphs in every distribution. Do not replace upstream authorship with pi-agent-skills authorship. When changing imported material, preserve the original notice and record the original path/revision, the downstream changes and their reason. Modified Apache-derived files must also carry a prominent change notice in the file itself. Follow [MAINTENANCE.md](MAINTENANCE.md) before any new import.
