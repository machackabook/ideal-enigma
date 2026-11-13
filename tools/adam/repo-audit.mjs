#!/usr/bin/env node
/**
 * ADAM Gate 0 — read-only repository inventory and provenance snapshot.
 * It never changes tracked files, Git refs, remotes, hooks, or configuration.
 */
import { createHash } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { lstat, mkdir, readdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import process from 'node:process';

export const DEFAULT_EXCLUDES = new Set([
  '.git', 'node_modules', 'vendor', '.next', '.nuxt', 'dist', 'build',
  'coverage', '.turbo', '.cache'
]);
export const MAX_HASH_BYTES = 50 * 1024 * 1024;

function gitValue(root, args) {
  try {
    return execFileSync('git', ['-C', root, ...args], {
      encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'], timeout: 5000
    }).trim();
  } catch {
    return null;
  }
}

async function sha256File(file) {
  const hash = createHash('sha256');
  await new Promise((resolve, reject) => {
    const stream = createReadStream(file);
    stream.on('data', chunk => hash.update(chunk));
    stream.on('error', reject);
    stream.on('end', resolve);
  });
  return hash.digest('hex');
}

export async function auditRepo(repoRoot, options = {}) {
  const root = path.resolve(repoRoot);
  const rootInfo = await lstat(root);
  if (!rootInfo.isDirectory()) throw new Error('repo_root_not_directory');
  const excludes = new Set([...DEFAULT_EXCLUDES, ...(options.exclude ?? [])]);
  const entries = [];
  const pending = [root];

  while (pending.length) {
    const current = pending.pop();
    const children = await readdir(current, { withFileTypes: true });
    children.sort((a, b) => a.name.localeCompare(b.name));
    for (const child of children) {
      if (excludes.has(child.name)) continue;
      const absolute = path.join(current, child.name);
      const relative = path.relative(root, absolute).split(path.sep).join('/');
      const info = await lstat(absolute);
      if (info.isSymbolicLink()) {
        entries.push({ path: relative, kind: 'symlink', bytes: info.size, sha256: null, hashStatus: 'not_followed' });
      } else if (info.isDirectory()) {
        pending.push(absolute);
      } else if (info.isFile()) {
        const canHash = info.size <= (options.maxHashBytes ?? MAX_HASH_BYTES);
        entries.push({
          path: relative,
          kind: 'file',
          bytes: info.size,
          sha256: canHash ? await sha256File(absolute) : null,
          hashStatus: canHash ? 'sha256' : 'size_limit'
        });
      }
    }
  }

  entries.sort((a, b) => a.path.localeCompare(b.path));
  const gitRoot = gitValue(root, ['rev-parse', '--show-toplevel']);
  const git = gitRoot ? {
    root: path.resolve(gitRoot),
    branch: gitValue(root, ['branch', '--show-current']),
    head: gitValue(root, ['rev-parse', 'HEAD']),
    statusPorcelain: gitValue(root, ['status', '--porcelain=v1'])
  } : null;
  const payload = {
    schema: 'adam.repository-audit.v1',
    gate: 'GATE_0_OBSERVE',
    mutation: 'none',
    generatedAt: new Date().toISOString(),
    root,
    git,
    policy: {
      symlinks: 'record_only_never_follow',
      defaultExcludedDirectories: [...DEFAULT_EXCLUDES].sort(),
      maxHashBytes: options.maxHashBytes ?? MAX_HASH_BYTES,
      fileContentsPersisted: false
    },
    summary: {
      files: entries.filter(x => x.kind === 'file').length,
      symlinks: entries.filter(x => x.kind === 'symlink').length,
      bytes: entries.reduce((sum, x) => sum + x.bytes, 0),
      hashed: entries.filter(x => x.hashStatus === 'sha256').length,
      skippedHashes: entries.filter(x => x.hashStatus === 'size_limit').length
    },
    entries
  };
  payload.snapshotSha256 = createHash('sha256').update(JSON.stringify(payload)).digest('hex');
  return payload;
}

function usage() {
  return 'Usage: node tools/adam/repo-audit.mjs [--repo-root DIR] [--write RELATIVE.json] [--force] [--exclude NAME]';
}

export function parseArgs(argv) {
  const args = { repoRoot: process.cwd(), write: null, force: false, exclude: [] };
  for (let i = 0; i < argv.length; i++) {
    const value = argv[i];
    if (value === '--repo-root' && argv[i + 1]) args.repoRoot = argv[++i];
    else if (value === '--write' && argv[i + 1]) args.write = argv[++i];
    else if (value === '--exclude' && argv[i + 1]) args.exclude.push(argv[++i]);
    else if (value === '--force') args.force = true;
    else if (value === '--help' || value === '-h') args.help = true;
    else throw new Error(`unknown_or_incomplete_argument:${value}`);
  }
  return args;
}

async function main() {
  try {
    const args = parseArgs(process.argv.slice(2));
    if (args.help) {
      process.stdout.write(`${usage()}\n`);
      return;
    }
    const report = await auditRepo(args.repoRoot, { exclude: args.exclude });
    if (args.write) {
      const root = path.resolve(args.repoRoot);
      const destination = path.resolve(root, args.write);
      const relative = path.relative(root, destination);
      if (!relative || relative === '..' || relative.startsWith(`..${path.sep}`) || path.isAbsolute(relative)) {
        throw new Error('report_path_must_be_inside_repo_and_not_root');
      }
      if (!args.force) {
        try { await lstat(destination); throw new Error('report_exists_use_force'); }
        catch (error) { if (error.code !== 'ENOENT') throw error; }
      }
      await mkdir(path.dirname(destination), { recursive: true });
      await writeFile(destination, `${JSON.stringify(report, null, 2)}\n`, { flag: args.force ? 'w' : 'wx' });
      process.stdout.write(`${JSON.stringify({ status: 'written', path: relative, snapshotSha256: report.snapshotSha256 })}\n`);
    } else {
      process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    }
  } catch (error) {
    process.stderr.write(`${error.message}\n${usage()}\n`);
    process.exitCode = 2;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) await main();
