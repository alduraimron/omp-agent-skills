// Original pi-agent-skills contribution. See LICENSES/MIT-pi-agent-skills.txt.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const provenance = JSON.parse(fs.readFileSync(path.join(root, 'UPSTREAM.json'), 'utf8'));
const legalFiles = [
  'LICENSE',
  'LICENSES/MIT-pi-agent-skills.txt',
  'LICENSES/Apache-2.0-code-simplifier.txt',
  'NOTICE',
  'THIRD_PARTY_NOTICES.md',
  'UPSTREAM.json',
  'MODIFICATIONS.md',
];
// Complete docs/ inventory at the pinned upstream revision, not just imported paths.
const upstreamDocs = [
  'adoption-guide.md',
  'advanced-per-agent-configuration.md',
  'agents.md',
  'antigravity-setup.md',
  'codex-setup.md',
  'commandcode-setup.md',
  'comparison.md',
  'copilot-cli-setup.md',
  'copilot-setup.md',
  'cursor-setup.md',
  'developer-onboarding.md',
  'gemini-cli-setup.md',
  'getting-started.md',
  'opencode-setup.md',
  'other-hosts.md',
  'skill-anatomy.md',
  'windsurf-setup.md',
];

test('all upstream documentation is preserved as the complete unchanged snapshot', () => {
  const importedDocs = provenance.imports.filter((item) => item.sourcePath.startsWith('docs/'));
  assert.deepEqual(importedDocs.map((item) => item.sourcePath).sort(), upstreamDocs.map((name) => `docs/${name}`));
  assert.ok(!provenance.excludedUpstreamPaths.some((name) => name.startsWith('docs/')));
  for (const item of importedDocs) {
    assert.equal(item.path, `vendor/agent-skills/${item.sourcePath}`);
    const bytes = fs.readFileSync(path.join(root, item.path));
    const blob = createHash('sha1').update(`blob ${bytes.length}\0`).update(bytes).digest('hex');
    assert.equal(blob, item.gitBlob, `Upstream documentation was changed: ${item.path}`);
  }
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  assert.match(readme, /docs\/upstream-reference\.md/);
  const usage = fs.readFileSync(path.join(root, 'docs/pi-usage.md'), 'utf8');
  assert.match(usage, /not promises about this integration/);
});

test('identity and publication decisions are independent from upstream', () => {
  assert.equal(manifest.name, 'pi-agent-skills');
  assert.equal(manifest.version, '0.1.0');
  assert.equal(manifest.private, true);
  assert.equal(manifest.license, '(MIT AND Apache-2.0)');
  assert.equal(manifest.author, undefined);
  assert.deepEqual(manifest.repository, {
    type: 'git',
    url: 'git+ssh://git@github.com/alduraimron/pi-agent-skills.git',
  });
  assert.equal(manifest.homepage, 'https://github.com/alduraimron/pi-agent-skills#readme');
  assert.deepEqual(manifest.bugs, { url: 'https://github.com/alduraimron/pi-agent-skills/issues' });
  assert.deepEqual(manifest.pi.skills, ['./skills', './vendor/agent-skills/skills']);
  assert.deepEqual(manifest.pi.prompts, ['./prompts']);
});

test('Git install guidance and support links identify the independent repository', () => {
  const source = 'git:git@github.com:alduraimron/pi-agent-skills.git';
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  const usage = fs.readFileSync(path.join(root, 'docs/pi-usage.md'), 'utf8');
  for (const content of [readme, usage]) {
    assert.ok(content.includes(`pi install ${source}`));
    assert.match(content, /After the first approved push/);
  }
  assert.match(readme, /private: true/);
  assert.match(readme, /does not prevent Git installation/);
  const issues = 'https://github.com/alduraimron/pi-agent-skills/issues';
  for (const file of ['MAINTENANCE.md', 'CONTRIBUTING.md']) {
    assert.ok(fs.readFileSync(path.join(root, file), 'utf8').includes(issues), `Missing independent support link: ${file}`);
  }
});

test('origin and non-endorsement are explicit in the distributed documentation', () => {
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  const notice = fs.readFileSync(path.join(root, 'NOTICE'), 'utf8');
  assert.match(readme, /independently maintained/i);
  assert.match(readme, /not affiliated with, sponsored by, or endorsed by/);
  assert.match(notice, /Copyright \(c\) 2025 Addy Osmani/);
  assert.match(notice, /Anthropic/);
  assert.match(notice, /New Pi integration/);
  assert.match(notice, new RegExp(provenance.source.commit));
});

test('the npm distribution retains every imported file and required notice', { timeout: 60_000 }, () => {
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const result = spawnSync(npm, ['pack', '--dry-run', '--json', '--ignore-scripts'], {
    cwd: root,
    encoding: 'utf8',
    timeout: 55_000,
    shell: process.platform === 'win32',
  });
  assert.equal(result.status, 0, result.error?.message || result.stdout + result.stderr);
  // npm 10/11 return an array; npm 12 returns an object keyed by package name.
  const report = JSON.parse(result.stdout);
  const [packed] = Array.isArray(report) ? report : Object.values(report);
  assert.equal(packed.name, manifest.name);
  const files = new Set(packed.files.map((item) => item.path));
  for (const relative of legalFiles) assert.ok(files.has(relative), `Missing legal/provenance file: ${relative}`);
  for (const item of [...provenance.imports, ...provenance.thirdParty.flatMap((entry) => entry.files)]) {
    assert.ok(files.has(item.path), `Missing imported file: ${item.path}`);
  }
  assert.ok(files.has('skills/pi-agent-workflow/SKILL.md'));
  assert.equal([...files].filter((item) => item.endsWith('/SKILL.md')).length, 26);
  assert.equal([...files].filter((item) => /^prompts\/pi-[a-z-]+\.md$/.test(item)).length, 9);
  assert.ok(files.has('scripts/check-project.mjs'));
  assert.ok(files.has('docs/pi-usage.md'));
  assert.ok(files.has('docs/upstream-reference.md'));
  for (const name of upstreamDocs) assert.ok(files.has(`vendor/agent-skills/docs/${name}`), `Missing upstream documentation: ${name}`);
  assert.ok(![...files].some((item) => item.startsWith('.git/')));
});
