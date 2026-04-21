import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'node:fs/promises';
import path from 'node:path';

const CONTENT_DIR = path.resolve('src/content/blog');

function slugify(value) {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-');
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (!token.startsWith('--')) continue;
    const key = token.slice(2);
    const next = argv[i + 1];
    if (!next || next.startsWith('--')) {
      args[key] = true;
    } else {
      args[key] = next;
      i += 1;
    }
  }
  return args;
}

function splitTags(value) {
  return value
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function yamlString(value) {
  return JSON.stringify(value);
}

function yamlArray(values) {
  return `[${values.map((value) => yamlString(value)).join(', ')}]`;
}

async function readBodyFromFile(filePath) {
  if (!filePath) return '';
  return fs.readFile(path.resolve(filePath), 'utf8');
}

const args = parseArgs(process.argv.slice(2));
const rl = createInterface({ input, output });

try {
  const today = new Date().toISOString().slice(0, 10);
  const title = args.title || await rl.question('Title: ');
  const description =
    args.description ||
    await rl.question('Description: ');
  const date = args.date || await rl.question(`Publish date (${today}): `) || today;
  const tagsInput =
    args.tags ||
    await rl.question('Tags (comma separated): ');
  const heroImage =
    args['hero-image'] ||
    await rl.question('Hero image URL (optional): ');
  const featuredInput =
    args.featured !== undefined
      ? String(args.featured)
      : await rl.question('Featured on homepage? (y/N): ');
  const body = (await readBodyFromFile(args.from)).trim() || 'Write here.\n';

  const slug = `${date}-${slugify(title)}`;
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  const tags = splitTags(tagsInput);
  const featured = ['y', 'yes', 'true', '1'].includes(featuredInput.trim().toLowerCase());

  const frontmatter = [
    '---',
    `title: ${yamlString(title)}`,
    `description: ${yamlString(description || 'A note in progress.')}`,
    `publishDate: ${date}`,
    `tags: ${yamlArray(tags)}`,
    heroImage ? `heroImage: ${yamlString(heroImage)}` : null,
    `featured: ${featured ? 'true' : 'false'}`,
    'featureRank: 999',
    'isDraft: false',
    '---',
    '',
    body,
    '',
  ]
    .filter(Boolean)
    .join('\n');

  await fs.writeFile(filePath, frontmatter, 'utf8');
  output.write(`Created writing entry: ${path.relative(process.cwd(), filePath)}\n`);
} finally {
  rl.close();
}
