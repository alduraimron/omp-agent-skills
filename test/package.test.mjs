// Original omp-agent-skills contribution. See LICENSES/MIT-omp-agent-skills.txt.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const plugin = JSON.parse(fs.readFileSync(path.join(root, '.omp-plugin/plugin.json'), 'utf8'));
const claudePlugin = JSON.parse(fs.readFileSync(path.join(root, '.claude-plugin/plugin.json'), 'utf8'));
const marketplace = JSON.parse(fs.readFileSync(path.join(root, '.omp-plugin/marketplace.json'), 'utf8'));
const provenance = JSON.parse(fs.readFileSync(path.join(root, 'UPSTREAM.json'), 'utf8'));
const legalFiles = [
  'LICENSE',
  'LICENSES/MIT-omp-agent-skills.txt',
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
  const usage = fs.readFileSync(path.join(root, 'docs/omp-usage.md'), 'utf8');
  assert.match(usage, /not promises about this integration/);
});

test('identity and publication decisions are independent from upstream', () => {
  assert.equal(manifest.name, 'omp-agent-skills');
  assert.equal(manifest.version, '0.2.0');
  assert.equal(manifest.private, true);
  assert.equal(manifest.license, '(MIT AND Apache-2.0)');
  assert.equal(manifest.author, undefined);
  assert.deepEqual(manifest.repository, {
    type: 'git',
    url: 'git+ssh://git@github.com/alduraimron/omp-agent-skills.git',
  });
  assert.equal(manifest.homepage, 'https://github.com/alduraimron/omp-agent-skills#readme');
  assert.deepEqual(manifest.bugs, { url: 'https://github.com/alduraimron/omp-agent-skills/issues' });
  assert.equal(manifest.pi, undefined);
  assert.equal(plugin.name, 'omp');
  assert.equal(plugin.version, manifest.version);
  assert.deepEqual(plugin.skills, ['./skills', './vendor/agent-skills/skills']);
  assert.deepEqual(plugin.commands, ['./commands']);
  assert.equal(claudePlugin.name, 'omp');
  assert.equal(claudePlugin.version, manifest.version);
  assert.deepEqual(claudePlugin.skills, plugin.skills);
  assert.deepEqual(claudePlugin.commands, plugin.commands);
  assert.equal(marketplace.name, 'omp-agent-skills-marketplace');
  assert.equal(marketplace.plugins.length, 1);
  assert.equal(marketplace.plugins[0].name, 'omp');
  assert.equal(marketplace.plugins[0].version, manifest.version);
  assert.equal(marketplace.plugins[0].source, './');
  for (const relative of ['skills/', 'commands/', '.omp-plugin/', '.claude-plugin/', 'vendor/']) {
    assert.ok(manifest.files.includes(relative), `Package files must include ${relative}`);
  }
  assert.ok(!fs.existsSync(path.join(root, 'prompts')), 'Legacy prompts directory must be removed');
  assert.ok(!fs.existsSync(path.join(root, 'skills/pi-agent-workflow')), 'Legacy integration skill must be removed');
});

test('omp install guidance and support links identify the independent repository', () => {
  const repository = 'alduraimron/omp-agent-skills';
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  const usage = fs.readFileSync(path.join(root, 'docs/omp-usage.md'), 'utf8');
  for (const content of [readme, usage]) {
    assert.ok(content.includes(`omp plugin marketplace add ${repository}`));
    assert.ok(content.includes('omp plugin install'));
    assert.match(content, /\bGit\b.*\bSSH\b/);
  }
  assert.match(readme, /private: true/);
  assert.match(readme, /does not block Git or plugin installation/);
  const issues = 'https://github.com/alduraimron/omp-agent-skills/issues';
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
  assert.match(notice, /New omp integration/);
  assert.match(notice, new RegExp(provenance.source.commit));
});

test('README catalogs every shipped skill and lifecycle command', () => {
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  const expectedSkills = plugin.skills.flatMap((base) =>
    fs.readdirSync(path.resolve(root, base), { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && fs.existsSync(path.resolve(root, base, entry.name, 'SKILL.md')))
      .map((entry) => path.posix.join(base, entry.name, 'SKILL.md')));
  const documentedSkills = new Set([...readme.matchAll(/\[[^\]]+\]\(([^)\s]+\/SKILL\.md)\)/g)].map((match) => match[1]));
  assert.equal(expectedSkills.length, 26);
  assert.deepEqual([...documentedSkills].sort(), expectedSkills.sort());
  const expectedCommands = fs.readdirSync(path.join(root, 'commands'))
    .filter((name) => name.endsWith('.md')).map((name) => name.slice(0, -3));
  const documentedCommands = new Set([...readme.matchAll(/^\| `\/omp:([a-z-]+)` \|/gm)].map((match) => match[1]));
  assert.deepEqual([...documentedCommands].sort(), expectedCommands.sort());
});

test('README explains approval gates, workflow artifacts and session recovery', () => {
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  assert.match(readme, /^## Workflow stages$/m);
  for (const phase of ['Define', 'Plan', 'Build', 'Verify', 'Review', 'Ship']) {
    assert.ok(readme.includes(`| ${phase} |`), `Missing workflow stage: ${phase}`);
  }
  for (const artifact of ['SPEC.md', 'tasks/plan.md', 'tasks/todo.md']) {
    assert.ok(readme.includes(artifact), `Missing default workflow artifact: ${artifact}`);
  }
  assert.match(readme, /^## If you forget where you stopped$/m);
  assert.ok(readme.includes('not blanket approval'));
  assert.ok(readme.includes('does not authorize deployment'));
});

test('README relative documentation links resolve in the package checkout', () => {
  const readme = fs.readFileSync(path.join(root, 'README.md'), 'utf8');
  for (const match of readme.matchAll(/\[[^\]]+\]\(([^)\s]+)\)/g)) {
    const target = match[1];
    if (target.startsWith('#') || /^[a-z][a-z0-9+.-]*:/i.test(target)) continue;
    const relative = target.split('#')[0];
    assert.ok(fs.existsSync(path.resolve(root, relative)), `Broken README link: ${target}`);
  }
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
  assert.ok(files.has('skills/omp-agent-workflow/SKILL.md'));
  assert.equal([...files].filter((item) => item.endsWith('/SKILL.md')).length, 26);
  assert.equal([...files].filter((item) => /^commands\/[a-z-]+\.md$/.test(item)).length, 9);
  assert.ok(files.has('.omp-plugin/plugin.json'));
  assert.ok(files.has('.claude-plugin/plugin.json'));
  assert.ok(files.has('.omp-plugin/marketplace.json'));
  assert.ok(files.has('scripts/check-project.mjs'));
  assert.ok(files.has('docs/omp-usage.md'));
  assert.ok(files.has('docs/upstream-reference.md'));
  assert.ok(![...files].some((item) => item.startsWith('prompts/')));
  for (const name of upstreamDocs) assert.ok(files.has(`vendor/agent-skills/docs/${name}`), `Missing upstream documentation: ${name}`);
  assert.ok(![...files].some((item) => item.startsWith('.git/')));
});
