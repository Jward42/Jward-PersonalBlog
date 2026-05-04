#!/usr/bin/env node

import { execFileSync } from 'node:child_process';
import process from 'node:process';

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const noBuild = args.includes('--no-build');
const noPush = args.includes('--no-push');

const safePathspecs = [
  'src/content/',
  'public/uploads/',
  'public/images/',
  'public/media/',
  'public/photos/',
];

function getArgValue(name) {
  const index = args.indexOf(name);
  if (index === -1) return undefined;
  return args[index + 1];
}

function run(command, commandArgs, options = {}) {
  return execFileSync(command, commandArgs, {
    encoding: 'utf8',
    stdio: options.stdio ?? 'pipe',
  });
}

function runVisible(command, commandArgs) {
  execFileSync(command, commandArgs, { stdio: 'inherit' });
}

function splitNul(value) {
  return value.split('\0').filter(Boolean);
}

function normalize(filePath) {
  return filePath.replace(/\\/g, '/');
}

function isSafeFile(filePath) {
  const normalized = normalize(filePath);
  return safePathspecs.some((pathspec) => normalized.startsWith(pathspec));
}

function stagedFiles() {
  return splitNul(run('git', ['diff', '--cached', '--name-only', '-z']));
}

function changedSafeFiles() {
  const output = run('git', ['status', '--porcelain', '-z', '--untracked-files=all', '--', ...safePathspecs]);
  const entries = splitNul(output);

  return entries
    .map((entry) => entry.slice(3))
    .filter(Boolean)
    .map(normalize);
}

function printFiles(label, files) {
  console.log(label);
  for (const file of files) {
    console.log(`  - ${file}`);
  }
}

try {
  const repoRoot = run('git', ['rev-parse', '--show-toplevel']).trim();
  process.chdir(repoRoot);

  const branch = run('git', ['branch', '--show-current']).trim();
  if (!branch) {
    throw new Error('Cannot publish from a detached HEAD. Switch to a branch first.');
  }

  const alreadyStaged = stagedFiles();
  const unsafeStaged = alreadyStaged.filter((file) => !isSafeFile(file));
  if (unsafeStaged.length) {
    printFiles('These files are already staged but are outside the weekly publishing allowlist:', unsafeStaged);
    throw new Error('Unstage those files before running weekly publishing.');
  }

  if (!noBuild) {
    console.log('Running production build...');
    runVisible('npm', ['run', 'build']);
  }

  const changedBeforeAdd = changedSafeFiles();
  if (!changedBeforeAdd.length) {
    console.log('No safe content changes found. Nothing to publish.');
    process.exit(0);
  }

  printFiles('Safe content changes found:', changedBeforeAdd);

  if (dryRun) {
    console.log('\nDry run only. No git add, commit, or push was performed.');
    process.exit(0);
  }

  runVisible('git', ['add', '--', ...safePathspecs]);

  const stagedAfterAdd = stagedFiles().filter(isSafeFile);
  if (!stagedAfterAdd.length) {
    console.log('No safe staged changes after git add. Nothing to publish.');
    process.exit(0);
  }

  printFiles('Staged for weekly publishing:', stagedAfterAdd);

  const date = new Date().toISOString().slice(0, 10);
  const message = getArgValue('--message') || `Publish weekly site updates: ${date}`;

  runVisible('git', ['commit', '-m', message]);

  if (noPush) {
    console.log('\nCommitted locally. Skipped push because --no-push was provided.');
    process.exit(0);
  }

  runVisible('git', ['push', 'origin', branch]);
  console.log(`\nPushed ${branch} to origin. Vercel will deploy the site from GitHub.`);
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
