# Significant downstream modifications

Changes are relative to agent-skills at `aeac41d4d005999432bb7312f7ff06383a91d59d`. Dates describe pi-agent-skills work, not upstream release dates.

## 2026-10-14 - Independent foundation, version 0.1.0

| Change | Scope | Origin / reason |
|--------|-------|-----------------|
| Created a new project and separate Git repository named `pi-agent-skills` | Project root | New independent identity; no imported history, remotes or implied endorsement |
| Imported a selected portable foundation into `vendor/agent-skills/` | 52 files: 25 skills, their supporting files, four personas, seven shared references, three documents and five validation/test files | Reused upstream content is byte-for-byte unchanged; preserving the relative layout keeps shared reference paths working |
| Retained the upstream MIT license verbatim, including the 2025 Addy Osmani copyright | `LICENSE`, `vendor/agent-skills/LICENSE` | Required notice preservation; no replacement ownership claim |
| Audited all 217 tracked upstream paths before import and separately investigated the credited simplifier adaptation | `THIRD_PARTY_NOTICES.md`, `UPSTREAM.json`, `NOTICE`, `LICENSES/Apache-2.0-code-simplifier.txt` | The referenced Anthropic plugin is Apache-2.0; preserve its license conservatively for incorporated expression |
| Excluded 165 upstream paths, including other-host adapters, hooks, eval fixtures and branding | Listed individually in `UPSTREAM.json` | Pi-focused scope; upstream installer metadata and marketing are not this project's identity |
| Added a native Pi package manifest and a Pi capability-mapping skill | `package.json`, `skills/pi-agent-workflow/` | New downstream integration; no bundled executable extension, host hooks or automatic subagents |
| Added nine prefixed lifecycle prompt templates | `prompts/pi-*.md` | New downstream entry points that do not claim parity with upstream host commands or collide with generic names |
| Added offline provenance, notice, routing and package-content checks plus independent CI | `scripts/`, `test/`, `.github/workflows/check.yml` | New downstream safeguards; upstream validators remain credited and unchanged |
| Added independent contribution, maintenance and usage documentation | Root documents, `docs/pi-usage.md`, `AGENTS.md` | Downstream governance and release decisions are separate from upstream |
| Reserved publication for a later independent release decision | `package.json` has `private: true` | No repository URL or registry ownership is invented; nothing has been published |

No imported source file's content has been modified in this initial version. `UPSTREAM.json` therefore has an empty `modifications` list. New files are separate contributions, not relabeled upstream work. The additional Apache license was copied unchanged from its separately pinned source.

## 2026-10-14 - Complete upstream documentation (unreleased)

- Expanded `vendor/agent-skills/docs/` from three selected documents to the complete 17-file upstream directory. The 14 newly imported files include general adoption/onboarding material, the comparison document and other-host setup guides.
- Reviewed the additional material before copying. No additional file-specific license notices were found; linked external resources and suggested tools were not imported or executed.
- Kept every document byte-for-byte identical to the same pinned upstream revision. Existing imported bytes, source hashes, MIT copyright and other attributions were not replaced. There are still no downstream modifications to imported content.
- Added the 14 original source paths, SHA-256 hashes and Git blob IDs to `UPSTREAM.json`, and removed those paths from its exclusion inventory. The current snapshot contains 66 upstream files and excludes 151 upstream paths; the original 52-file import record above remains historical.
- Added the independently authored `docs/upstream-reference.md` index and clarified the distinction between archived upstream documentation and actual Pi capabilities in `README.md` and `docs/pi-usage.md`. Original links to excluded upstream artifacts remain intact; the index points to their pinned source locations.
- Updated the current import scope in `THIRD_PARTY_NOTICES.md` and added regression checks for the complete document inventory, original Git blob hashes, missing documentation and packed archive inclusion.
- No skill or prompt behavior was changed. Slaver integration remains deferred; no runtime, install settings, remotes or publication changes were made.

## 2026-10-14 - GitHub distribution preparation (unreleased)

- Set `repository`, `homepage` and `bugs` metadata in `package.json` to the owner-provided `alduraimron/pi-agent-skills` repository. No upstream author is represented as the author or maintainer of the downstream package.
- Added SSH/HTTPS Git installation instructions, project-scope guidance and existing-ref pinning notes to `README.md` and `docs/pi-usage.md`. The instructions explicitly require the first approved push; no existing release tag or available remote package is assumed.
- Updated `MAINTENANCE.md` and `CONTRIBUTING.md` to identify the independent repository owner and downstream support/review channels. Preparing local Git state does not authorize publication.
- Retained `private: true` to guard against npm publication while allowing Git installation. Added regression checks for repository metadata, Git install instructions and support links.
- Prepared a new downstream initial commit and configured the local `origin` as `git@github.com:alduraimron/pi-agent-skills.git`. No upstream Git history was imported. No push, npm publication or release tag was performed during this preparation.
- Existing skills, prompts, imported content, license/copyright notices and baseline hashes are unchanged. Slaver integration remains deferred.

## 2026-10-14 - README onboarding and complete catalog (unreleased)

- Rewrote the independently authored `README.md` as a complete project guide with a contents index, skill/prompt/persona mental model, installation management, a beginner walkthrough and Define -> Plan -> Build -> Verify -> Review -> Ship stages.
- Documented all nine actual prompt commands and their loaded workflows, scope and approval boundaries. Linked all 26 shipped skills with purpose and usage guidance, explicitly distinguishing the 25 upstream workflows from the new Pi integration skill.
- Added links to the four reference personas and seven shared checklists, common task recipes, default spec/plan/task artifacts, session-recovery prompts and troubleshooting. Personas, browser tooling, hooks, autonomous builds and deferred Slaver integration are not represented as built-in runtime features.
- Added README regression checks for exact skill/command catalog coverage, workflow/approval/artifact guidance and local documentation links. Updated the Git-install test to verify SSH requirements rather than a stale first-push message.
- Removed the outdated first-push prerequisite from `docs/pi-usage.md` and updated the current distribution wording in `CHANGELOG.md`, without rewriting the earlier historical preparation records.
- Imported files, source hashes, required copyright/license notices, package resource paths and runtime behavior are unchanged. This documentation change does not add commands, modify installed Pi settings, authorize another push or publish to npm.

## Future entries

For every significant change, record the date/release, affected paths, behavior change and reason. For imported-file edits, retain the original hashes in `UPSTREAM.json`, record the current hash and a reviewable explanation in its `modifications` list, and add a prominent change notice without deleting earlier notices. Never silently update baseline hashes to disguise downstream edits.
