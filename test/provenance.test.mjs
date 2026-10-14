// Original pi-agent-skills contribution. See LICENSES/MIT-pi-agent-skills.txt.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';
import { validateProject, verifyProvenance } from '../scripts/check-project.mjs';

const project = fileURLToPath(new URL('../', import.meta.url));
const provenance = JSON.parse(fs.readFileSync(path.join(project, 'UPSTREAM.json'), 'utf8'));
const skill = 'vendor/agent-skills/skills/idea-refine/SKILL.md';
const apache = 'LICENSES/Apache-2.0-code-simplifier.txt';
const allImports = [...provenance.imports, ...provenance.thirdParty.flatMap((item) => item.files)];
const sha256 = (data) => createHash('sha256').update(data).digest('hex');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'pi-agent-skills-test-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const item of allImports) {
    const destination = path.join(root, item.path);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    fs.copyFileSync(path.join(project, item.path), destination);
  }
  return { root, manifest: structuredClone(provenance) };
}

function recordModification(root, manifest, relative, notice = true) {
  const file = path.join(root, relative);
  fs.appendFileSync(file, notice ? '\nModified by pi-agent-skills: test-only documented change.\n' : '\nUndocumented content.\n');
  manifest.modifications.push({
    path: relative,
    sha256: sha256(fs.readFileSync(file)),
    date: '2026-10-14',
    reason: 'Exercise explicit downstream modification tracking.',
  });
}

test('the actual project passes all independent checks', () => {
  assert.deepEqual(validateProject(project), []);
});

test('unchanged audited imports pass', (t) => {
  const { root, manifest } = fixture(t);
  assert.deepEqual(verifyProvenance(root, manifest), []);
});

test('the root license is the unchanged upstream MIT notice', () => {
  assert.deepEqual(fs.readFileSync(path.join(project, 'LICENSE')), fs.readFileSync(path.join(project, 'vendor/agent-skills/LICENSE')));
  assert.match(fs.readFileSync(path.join(project, 'LICENSE'), 'utf8'), /Copyright \(c\) 2025 Addy Osmani/);
});

for (const relative of ['LICENSE', apache, skill, 'vendor/agent-skills/docs/adoption-guide.md']) {
  test(`missing import is rejected: ${relative}`, (t) => {
    const { root, manifest } = fixture(t);
    fs.unlinkSync(path.join(root, relative));
    assert.match(verifyProvenance(root, manifest).join('\n'), new RegExp(relative.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  });
}

test('unrecorded source changes fail rather than silently becoming downstream authorship', (t) => {
  const { root, manifest } = fixture(t);
  fs.appendFileSync(path.join(root, skill), '\nChanged without a provenance record.\n');
  assert.match(verifyProvenance(root, manifest).join('\n'), /SHA-256 mismatch/);
});

test('unreviewed extra vendor files fail inventory validation', (t) => {
  const { root, manifest } = fixture(t);
  fs.writeFileSync(path.join(root, 'vendor/agent-skills/unreviewed.js'), 'unknown third-party work');
  assert.match(verifyProvenance(root, manifest).join('\n'), /Unrecorded vendor file/);
});

test('symlinks are rejected instead of reading outside the audited tree', { skip: process.platform === 'win32' }, (t) => {
  const { root, manifest } = fixture(t);
  fs.unlinkSync(path.join(root, skill));
  fs.symlinkSync(path.join(project, skill), path.join(root, skill));
  assert.match(verifyProvenance(root, manifest).join('\n'), /symlink/i);
});

test('manifest paths cannot escape the project', (t) => {
  const { root, manifest } = fixture(t);
  manifest.imports[0].path = '../outside.txt';
  assert.match(verifyProvenance(root, manifest).join('\n'), /Unsafe path/);
});

test('duplicate import destinations are rejected', (t) => {
  const { root, manifest } = fixture(t);
  manifest.imports.push(structuredClone(manifest.imports[0]));
  assert.match(verifyProvenance(root, manifest).join('\n'), /Duplicate import/);
});

test('upstream origin must use a pinned commit', (t) => {
  const { root, manifest } = fixture(t);
  manifest.source.commit = 'main';
  assert.match(verifyProvenance(root, manifest).join('\n'), /pinned commit/);
});

test('explicitly recorded modifications retain their original baseline hash', (t) => {
  const { root, manifest } = fixture(t);
  const originalHash = manifest.imports.find((item) => item.path === skill).sha256;
  recordModification(root, manifest, skill);
  assert.deepEqual(verifyProvenance(root, manifest), []);
  assert.equal(manifest.imports.find((item) => item.path === skill).sha256, originalHash);
});

test('modified files require a prominent change notice', (t) => {
  const { root, manifest } = fixture(t);
  recordModification(root, manifest, skill, false);
  assert.match(verifyProvenance(root, manifest).join('\n'), /change notice/);
});

test('modification records cannot refer to unimported files', (t) => {
  const { root, manifest } = fixture(t);
  manifest.modifications.push({ path: 'unknown.md', sha256: 'a'.repeat(64), date: '2026-10-14', reason: 'Not imported.' });
  assert.match(verifyProvenance(root, manifest).join('\n'), /not an imported file/);
});

for (const relative of ['LICENSE', 'vendor/agent-skills/LICENSE', apache]) {
  test(`license text cannot be changed through a modification exception: ${relative}`, (t) => {
    const { root, manifest } = fixture(t);
    recordModification(root, manifest, relative);
    assert.match(verifyProvenance(root, manifest).join('\n'), /License text must remain unchanged/);
  });
}
