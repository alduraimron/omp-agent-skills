# Independent maintenance

pi-agent-skills has its own repository, versioning, review, roadmap and release decisions at [alduraimron/pi-agent-skills](https://github.com/alduraimron/pi-agent-skills). The repository owner, [@alduraimron](https://github.com/alduraimron), and accepted downstream contributors maintain it; upstream authors are not represented as members of this maintenance team.

Report pi-agent-skills problems through [this project's own issue tracker](https://github.com/alduraimron/pi-agent-skills/issues). Do not send downstream bug reports to the upstream project as if this were an official release.

The owner-selected Git remote is `git@github.com:alduraimron/pi-agent-skills.git`. Git distribution requires committed content to have been pushed with explicit approval. npm publication remains disabled with `private: true`; this does not block installation as a Git package. Preparing a commit or configuring `origin` does not authorize pushing or creating a release tag.

## Relationship to upstream

- agent-skills is a credited foundation, not a live dependency or release authority.
- No automatic synchronization, update hook or upstream CI is configured.
- Each upstream import is a deliberate downstream review decision. Updates are optional.
- This project can evolve separately, retain its own changes or decline upstream changes.
- Upstream names are used only to identify origin. Do not reuse author portraits, endorsements, popularity badges or marketplace identities as downstream branding.

## Reviewing an upstream update

1. Check out the proposed upstream revision in a separate audit directory. Pin a full commit SHA; do not import an unreviewed moving branch.
2. Enumerate Git-tracked paths, including dotfiles, symlinks and submodules. Review license/NOTICE/COPYING files, in-file copyright/SPDX notices and source/adaptation credits before copying.
3. Resolve third-party terms independently. For Apache-licensed material, keep the full license, existing applicable notices and any supplied NOTICE. Add a prominent file-level change notice to modified derivatives.
4. Select the portable source explicitly. Do not bring in upstream Git metadata, host installers, hooks, dependencies or marketing implicitly.
5. Review content differences and Pi capability assumptions. A source review cannot be replaced by the presence of an MIT root license or a passing checksum.
6. Update the source revision, path mapping, original SHA-256 hashes, Git blob IDs and exclusion inventory in `UPSTREAM.json` only for the deliberate new baseline. Preserve prior import history in Git and record the baseline transition in `MODIFICATIONS.md`.
7. For downstream changes relative to that baseline, keep the original import hash. Add a `modifications` record with `path`, `sha256` (current content), `date` and `reason`, and include a visible `Modified by pi-agent-skills` notice in the changed file. The validator rejects undocumented drift.
8. Run `npm run check`, `npm test` and inspect `npm pack --dry-run --ignore-scripts`. Confirm that legal texts and shared references remain in the distribution.
9. Have an independent downstream maintainer approve the change. Record the version impact and significant modifications before release.

## Release process

1. Review changes and all license scopes; ensure that no authorship or endorsement claims have drifted.
2. Update this project's version, changelog and modification record independently of upstream's version.
3. Run all checks and inspect the actual packed archive, not just the source checkout.
4. Git distribution uses this project's own GitHub repository. Keep `private: true` for Git-only distribution. Remove that npm publication guard only if the repository owner explicitly approves an npm destination and release.
5. Publish/tag from this project's own repository and credentials only with explicit release approval. Preserve `LICENSE`, `LICENSES/`, `NOTICE`, `THIRD_PARTY_NOTICES.md` and `UPSTREAM.json` in every distribution.

No maintenance schedule, support guarantee or upstream author's participation is implied by creating this initial project.
