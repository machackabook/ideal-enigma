import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, symlink, writeFile } from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { auditRepo, parseArgs } from '../tools/adam/repo-audit.mjs';

test('ADAM Gate 0 inventories files and hashes bytes without following symlinks', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'adam-audit-'));
  try {
    await mkdir(path.join(root, 'src'));
    await mkdir(path.join(root, 'node_modules'));
    await writeFile(path.join(root, 'src', 'core.txt'), 'immutable source');
    await writeFile(path.join(root, 'node_modules', 'ignored.txt'), 'ignored');
    await symlink(path.join(root, 'src', 'core.txt'), path.join(root, 'source-link'));
    const report = await auditRepo(root);
    assert.equal(report.gate, 'GATE_0_OBSERVE');
    assert.equal(report.mutation, 'none');
    assert.equal(report.summary.files, 1);
    assert.equal(report.summary.symlinks, 1);
    assert.equal(report.entries.find(x => x.path === 'src/core.txt').sha256.length, 64);
    assert.equal(report.entries.find(x => x.path === 'source-link').hashStatus, 'not_followed');
    assert.ok(!report.entries.some(x => x.path.includes('node_modules')));
    assert.equal(await readFile(path.join(root, 'src', 'core.txt'), 'utf8'), 'immutable source');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('ADAM skips hashes above the configured byte limit', async () => {
  const root = await mkdtemp(path.join(os.tmpdir(), 'adam-limit-'));
  try {
    await writeFile(path.join(root, 'large.bin'), '123456789');
    const report = await auditRepo(root, { maxHashBytes: 4 });
    assert.equal(report.summary.skippedHashes, 1);
    assert.equal(report.entries[0].sha256, null);
    assert.equal(report.entries[0].hashStatus, 'size_limit');
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});

test('argument parser preserves explicit root and excludes', () => {
  assert.deepEqual(parseArgs(['--repo-root', '/tmp/project', '--exclude', 'artifacts']), {
    repoRoot: '/tmp/project', write: null, force: false, exclude: ['artifacts']
  });
});
