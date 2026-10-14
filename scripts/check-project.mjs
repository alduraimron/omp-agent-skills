#!/usr/bin/env node
// Original pi-agent-skills contribution. See LICENSES/MIT-pi-agent-skills.txt.
import { createHash } from 'node:crypto';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SHA256 = /^[a-f0-9]{64}$/;
const COMMIT = /^[a-f0-9]{40}$/;
const vendorRoot = 'vendor/agent-skills';
const sha256 = (data) => createHash('sha256').update(data).digest('hex');

function localPath(root, relative, kind = 'file') {
  if (typeof relative !== 'string' || relative.includes('\\') || relative.includes('\0')
      || relative.split('/').some((part) => !part || part === '.' || part === '..')
      || path.isAbsolute(relative) || /^[a-z]:/i.test(relative)) {
    throw new Error(`Unsafe path: ${relative}`);
  }
  let current = root;
  for (const component of relative.split('/')) {
    current = path.join(current, component);
    if (fs.lstatSync(current).isSymbolicLink()) throw new Error(`Refusing symlink: ${relative}`);
  }
  const stat = fs.statSync(current);
  if (kind === 'file' ? !stat.isFile() : !stat.isDirectory()) throw new Error(`Expected ${kind}: ${relative}`);
  return current;
}

function inventory(root, relative) {
  const directory = localPath(root, relative, 'directory');
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const name = `${relative}/${entry.name}`;
    if (entry.isDirectory()) return inventory(root, name);
    if (!entry.isFile()) throw new Error(`Refusing non-regular vendor entry or symlink: ${name}`);
    return [name];
  });
}

export function verifyProvenance(root, manifest) {
  const errors = [];
  if (manifest.schemaVersion !== 1) errors.push('Unsupported UPSTREAM.json schema version.');
  if (manifest.source?.repository !== 'https://github.com/addyosmani/agent-skills'
      || !COMMIT.test(manifest.source?.commit || '')) {
    errors.push('Upstream origin must identify agent-skills with a full pinned commit.');
  }
  if (!Array.isArray(manifest.imports) || !Array.isArray(manifest.thirdParty)
      || !Array.isArray(manifest.modifications)) {
    return [...errors, 'Imports, thirdParty and modifications must be arrays.'];
  }
  for (const item of manifest.thirdParty) {
    if (!COMMIT.test(item.commit || '') || !Array.isArray(item.files)) {
      errors.push('Every third-party source must have a pinned commit and files array.');
    }
  }
  const imports = [...manifest.imports, ...manifest.thirdParty.flatMap((item) => item.files || [])];
  const destinations = new Set(imports.map((item) => item.path));
  const changes = new Map();
  for (const item of manifest.modifications) {
    if (!destinations.has(item.path)) errors.push(`Modification is not an imported file: ${item.path}`);
    if (changes.has(item.path)) errors.push(`Duplicate modification: ${item.path}`);
    if (!SHA256.test(item.sha256 || '') || !/^\d{4}-\d{2}-\d{2}$/.test(item.date || '')
        || typeof item.reason !== 'string' || !item.reason.trim()) {
      errors.push(`Modification needs a current SHA-256, date and reason: ${item.path}`);
    }
    if (item.path === 'LICENSE' || item.path?.endsWith('/LICENSE') || item.path?.startsWith('LICENSES/')) {
      errors.push(`License text must remain unchanged: ${item.path}`);
    }
    changes.set(item.path, item);
  }
  const seen = new Set();
  for (const item of imports) {
    if (seen.has(item.path)) errors.push(`Duplicate import: ${item.path}`);
    seen.add(item.path);
    if (!SHA256.test(item.sha256 || '') || !COMMIT.test(item.gitBlob || '')) {
      errors.push(`Import needs its original SHA-256 and Git blob ID: ${item.path}`);
    }
    try {
      const bytes = fs.readFileSync(localPath(root, item.path));
      const modification = changes.get(item.path);
      if (sha256(bytes) !== (modification?.sha256 || item.sha256)) {
        errors.push(`SHA-256 mismatch; record and review downstream changes: ${item.path}`);
      }
      if (modification && !bytes.toString('utf8').includes('Modified by pi-agent-skills')) {
        errors.push(`Modified file lacks a prominent change notice: ${item.path}`);
      }
    } catch (error) {
      errors.push(`${item.path}: ${error.message}`);
    }
  }
  try {
    for (const relative of inventory(root, vendorRoot)) {
      if (!destinations.has(relative)) errors.push(`Unrecorded vendor file; review licensing before import: ${relative}`);
    }
    const original = fs.readFileSync(localPath(root, `${vendorRoot}/LICENSE`));
    const rootLicense = fs.readFileSync(localPath(root, 'LICENSE'));
    if (!rootLicense.equals(original) || !original.toString('utf8').includes('Copyright (c) 2025 Addy Osmani')) {
      errors.push('The original MIT license and Addy Osmani copyright must be preserved verbatim.');
    }
    const simplifier = fs.readFileSync(localPath(root, `${vendorRoot}/skills/code-simplification/SKILL.md`), 'utf8');
    if (!simplifier.includes('Inspired by the [Claude Code Simplifier plugin]')
        || !simplifier.includes('https://github.com/anthropics/claude-plugins-official/')) {
      errors.push('The upstream simplifier attribution must not be removed.');
    }
  } catch (error) {
    errors.push(`Vendor inventory or required notice: ${error.message}`);
  }
  return errors;
}

export function validateProject(root) {
  const read = (relative) => fs.readFileSync(localPath(root, relative), 'utf8');
  const provenance = JSON.parse(read('UPSTREAM.json'));
  const errors = verifyProvenance(root, provenance);
  // Do not execute even the reviewed linter if its imported bytes have drifted.
  if (errors.length) return errors;
  const manifest = JSON.parse(read('package.json'));
  if (manifest.name !== 'pi-agent-skills') errors.push('The independent package name must be pi-agent-skills.');
  if (manifest.license !== '(MIT AND Apache-2.0)') errors.push('The combined distribution must disclose MIT and Apache-2.0.');
  if (JSON.stringify(manifest.pi?.skills) !== JSON.stringify(['./skills', './vendor/agent-skills/skills'])
      || JSON.stringify(manifest.pi?.prompts) !== JSON.stringify(['./prompts'])) {
    errors.push('Pi resource paths must retain the complete skill and reference layout.');
  }
  for (const relative of ['LICENSES/MIT-pi-agent-skills.txt', 'LICENSES/Apache-2.0-code-simplifier.txt',
    'NOTICE', 'THIRD_PARTY_NOTICES.md', 'MODIFICATIONS.md', 'MAINTENANCE.md', 'CONTRIBUTING.md', 'CHANGELOG.md']) {
    if (!read(relative).trim()) errors.push(`Required notice or maintenance document is empty: ${relative}`);
  }
  const require = createRequire(import.meta.url);
  const lint = require(localPath(root, `${vendorRoot}/scripts/lib/skill-lint.js`));
  const names = (relative) => fs.readdirSync(localPath(root, relative, 'directory'), { withFileTypes: true })
    .filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  const ownSkills = names('skills');
  const knownSkills = new Set([...ownSkills, ...names(`${vendorRoot}/skills`)]);
  for (const name of ownSkills) {
    const result = lint.lintSkill(name, path.join(root, 'skills'), knownSkills);
    errors.push(...result.errors.map((error) => `skills/${name}: ${error}`));
  }
  const prompts = fs.readdirSync(localPath(root, 'prompts', 'directory')).filter((name) => name.endsWith('.md'));
  if (prompts.length !== 9) errors.push('Expected nine independently authored Pi lifecycle prompts.');
  for (const name of prompts) {
    const content = read(`prompts/${name}`);
    const frontmatter = lint.parseFrontmatter(content);
    if (!/^pi-[a-z-]+\.md$/.test(name) || !frontmatter?.description) errors.push(`Invalid Pi prompt identity: ${name}`);
    errors.push(...lint.frontmatterYamlErrors(content).map((error) => `${name}: ${error}`));
    if (!content.includes('$ARGUMENTS') || !content.includes('Read the `pi-agent-workflow` skill')) {
      errors.push(`Prompt must load the Pi integration and forward user arguments: ${name}`);
    }
    const references = [...content.matchAll(/read the `([a-z0-9-]+)` skill/gi)].map((match) => match[1]);
    if (references.length < 2) errors.push(`Prompt must also load its actual workflow: ${name}`);
    for (const reference of references) {
      if (!knownSkills.has(reference)) errors.push(`Unknown prompt workflow: ${name} -> ${reference}`);
    }
  }
  return errors;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const root = fileURLToPath(new URL('../', import.meta.url));
    const errors = validateProject(root);
    if (errors.length) {
      for (const error of errors) console.error(`ERROR: ${error}`);
      process.exitCode = 1;
    } else {
      console.log('Independent project checks passed: provenance, notices, Pi integration and prompt routing.');
    }
  } catch (error) {
    console.error(`ERROR: ${error.message}`);
    process.exitCode = 1;
  }
}
