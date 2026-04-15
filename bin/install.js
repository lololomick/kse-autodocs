#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const readline = require('readline/promises');

const ASSETS = path.join(__dirname, '..', 'assets');
const CWD = process.cwd();

const args = process.argv.slice(2);
const flags = {
  claude: args.includes('--claude'),
  copilot: args.includes('--copilot'),
  both: args.includes('--both'),
  yes: args.includes('--yes') || args.includes('-y'),
  force: args.includes('--force') || args.includes('-f'),
  help: args.includes('--help') || args.includes('-h'),
};

const HELP = `
kse-autodocs — install Claude Code commands and / or GitHub Copilot prompts
              for scaffolding and maintaining developer documentation.

Usage:
  npx kse-autodocs [options]

Options:
  --claude       Install Claude Code integration only
  --copilot      Install GitHub Copilot integration only
  --both         Install both (this is also the default)
  -y, --yes      Skip the interactive prompt (implies --both)
  -f, --force    Overwrite files that already exist
  -h, --help     Show this help

What gets written (relative to the current working directory):

  .github/kse-autodocs/            shared templates (always)
  .claude/commands/*.md           Claude slash commands         (--claude)
  .github/copilot-instructions.md Copilot authoring instructions (--copilot)
  .github/prompts/*.prompt.md     Copilot prompt files           (--copilot)

Existing files are never overwritten unless --force is passed.
`;

if (flags.help) {
  process.stdout.write(HELP);
  process.exit(0);
}

async function pickTargets() {
  if (flags.both) return { claude: true, copilot: true };
  if (flags.claude && flags.copilot) return { claude: true, copilot: true };
  if (flags.claude) return { claude: true, copilot: false };
  if (flags.copilot) return { claude: false, copilot: true };
  if (flags.yes || !process.stdin.isTTY) return { claude: true, copilot: true };

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  console.log(`\nkse-autodocs installer`);
  console.log(`Target directory: ${CWD}\n`);
  console.log(`Which integrations do you want to install?`);
  console.log(`  1) Both Claude and Copilot  (default)`);
  console.log(`  2) Claude only`);
  console.log(`  3) Copilot only`);
  const raw = (await rl.question(`\nChoice [1]: `)).trim() || '1';
  rl.close();
  switch (raw) {
    case '1': return { claude: true, copilot: true };
    case '2': return { claude: true, copilot: false };
    case '3': return { claude: false, copilot: true };
    default:
      console.error(`Invalid choice: ${raw}`);
      process.exit(1);
  }
}

const stats = { written: 0, skipped: 0 };

function copyFile(src, dest) {
  if (fs.existsSync(dest) && !flags.force) {
    console.log(`  - ${path.relative(CWD, dest)}  (exists, skipped)`);
    stats.skipped++;
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  console.log(`  ${fs.existsSync(dest) ? '✓' : '+'} ${path.relative(CWD, dest)}`);
  stats.written++;
}

function copyDir(srcDir, destDir) {
  for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
    const src = path.join(srcDir, entry.name);
    const dest = path.join(destDir, entry.name);
    if (entry.isDirectory()) copyDir(src, dest);
    else copyFile(src, dest);
  }
}

async function main() {
  const targets = await pickTargets();

  console.log(`\nShared templates → .github/kse-autodocs/`);
  copyDir(path.join(ASSETS, 'shared'), path.join(CWD, '.github', 'kse-autodocs'));

  if (targets.claude) {
    console.log(`\nClaude Code → .claude/commands/`);
    copyDir(path.join(ASSETS, 'claude', 'commands'), path.join(CWD, '.claude', 'commands'));
  }

  if (targets.copilot) {
    console.log(`\nGitHub Copilot → .github/`);
    copyFile(
      path.join(ASSETS, 'copilot', 'copilot-instructions.md'),
      path.join(CWD, '.github', 'copilot-instructions.md')
    );
    copyDir(path.join(ASSETS, 'copilot', 'prompts'), path.join(CWD, '.github', 'prompts'));
  }

  console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log(`✓ kse-autodocs installed (${stats.written} written, ${stats.skipped} skipped)`);
  console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
  console.log();
  console.log(`Next: run /docs-init in Claude Code${targets.copilot ? ' or Copilot Chat' : ''}`);
  console.log(`      to scaffold docs/AUTHORING.md and wire up CI.`);
  console.log();
  if (stats.skipped > 0) {
    console.log(`(${stats.skipped} file(s) skipped because they already exist.`);
    console.log(` Re-run with --force to overwrite.)`);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
