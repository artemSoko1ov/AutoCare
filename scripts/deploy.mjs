import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const args = new Set(process.argv.slice(2));
const rootDir = process.cwd();
const pnpmCommand = 'pnpm';

const options = {
  install: !args.has('--skip-install'),
  lint: !args.has('--skip-lint'),
  test: !args.has('--skip-test'),
  build: !args.has('--skip-build'),
  migrate: args.has('--migrate'),
  seed: args.has('--seed'),
};

if (!options.migrate && options.seed) {
  console.error('[deploy] The --seed flag requires --migrate.');
  process.exit(1);
}

const requiredPaths = [
  'package.json',
  'client/package.json',
  'server/package.json',
  'shared/package.json',
  'server/prisma/schema.prisma',
];

for (const relativePath of requiredPaths) {
  const absolutePath = resolve(rootDir, relativePath);
  if (!existsSync(absolutePath)) {
    console.error(`[deploy] Required file is missing: ${relativePath}`);
    process.exit(1);
  }
}

if ((options.migrate || options.seed) && !existsSync(resolve(rootDir, 'server/.env'))) {
  console.error('[deploy] The server/.env file is required for migration and seed steps.');
  process.exit(1);
}

const steps = [];

if (options.install) {
  steps.push({
    title: 'Install dependencies',
    args: ['install', '--frozen-lockfile'],
  });
}

if (options.lint) {
  steps.push({
    title: 'Run linters',
    args: ['lint'],
  });
}

if (options.test) {
  steps.push({
    title: 'Run tests',
    args: ['test'],
  });
}

if (options.build) {
  steps.push({
    title: 'Build workspace',
    args: ['build'],
  });
}

if (options.migrate) {
  steps.push({
    title: 'Apply Prisma migrations',
    args: [
      '--dir',
      'server',
      'exec',
      'prisma',
      'migrate',
      'deploy',
      '--schema',
      'prisma/schema.prisma',
    ],
  });
}

if (options.seed) {
  steps.push({
    title: 'Seed database',
    args: [
      '--dir',
      'server',
      'exec',
      'prisma',
      'db',
      'seed',
      '--schema',
      'prisma/schema.prisma',
    ],
  });
}

const runStep = (title, commandArgs) => {
  console.log(`\n[deploy] ${title}`);
  console.log(`[deploy] > ${pnpmCommand} ${commandArgs.join(' ')}`);

  const result = spawnSync(pnpmCommand, commandArgs, {
    cwd: rootDir,
    shell: process.platform === 'win32',
    stdio: 'inherit',
  });

  if (result.error) {
    throw result.error;
  }

  if (result.status !== 0) {
    throw new Error(`${title} failed with exit code ${result.status ?? 'unknown'}.`);
  }
};

const startedAt = Date.now();

try {
  console.log('[deploy] Starting deployment pipeline');

  for (const step of steps) {
    runStep(step.title, step.args);
  }

  const durationMs = Date.now() - startedAt;
  const durationSeconds = (durationMs / 1000).toFixed(1);
  console.log(`\n[deploy] Done in ${durationSeconds}s`);
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`\n[deploy] Failed: ${message}`);
  process.exit(1);
}
