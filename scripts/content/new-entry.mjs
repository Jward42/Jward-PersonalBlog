#!/usr/bin/env node

import { access, writeFile } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

const today = new Date().toISOString().slice(0, 10);
const contentTypes = new Set(['writing', 'travel', 'category']);
const placeholderImage = 'https://picsum.photos/1200/900';

const args = process.argv.slice(2);
const explicitType = contentTypes.has(args[0]) ? args[0] : undefined;
const positional = (explicitType ? args.slice(1) : args).filter((arg) => !arg.startsWith('--'));
const interactive = Boolean(process.stdin.isTTY);

function getFlag(name) {
  const index = args.indexOf(name);
  if (index === -1) return undefined;

  const next = args[index + 1];
  if (!next || next.startsWith('--')) return true;
  return next;
}

function hasFlag(name) {
  return args.includes(name);
}

function printHelp() {
  output.write(`Create a new writing, travel, or photo category entry.

Daily use:
  npm run new
  npm run write -- "A small title"

Options:
  --title "Title"             Set the title without prompting.
  --description "Summary"     Set the short description.
  --tags "one,two"            Add comma-separated tags.
  --from /path/to/file.md     Use an existing text file as the body.
  --body "Text"               Use inline body text.
  --draft                     Keep the entry as a draft.
  --publish                   Mark the entry as publishable.
  --dry-run                   Print the file instead of writing it.
`);
}

if (hasFlag('--help') || hasFlag('-h')) {
  printHelp();
  process.exit(0);
}

const rl = createInterface({ input, output });

async function ask(question, fallback = '', required = false) {
  if (!interactive) {
    if (!required || fallback) return fallback;
    throw new Error(`${question} is required. Pass it as an argument or run this in a terminal.`);
  }

  const suffix = fallback ? ` (${fallback})` : '';
  const answer = (await rl.question(`${question}${suffix}: `)).trim();
  return answer || fallback;
}

async function chooseType() {
  if (explicitType) return explicitType;

  const answer = (await ask('What are you creating? writing / travel / category', 'writing')).toLowerCase();
  if (['w', 'write', 'essay', 'post', 'blog'].includes(answer)) return 'writing';
  if (['t', 'photo', 'photography', 'trip', 'vlog'].includes(answer)) return 'travel';
  if (['c', 'cat', 'photo-category'].includes(answer)) return 'category';
  if (contentTypes.has(answer)) return answer;

  throw new Error(`Unknown content type: ${answer}`);
}

function slugify(inputValue) {
  return inputValue
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/-{2,}/g, '-')
    .slice(0, 72);
}

function splitTags(value = '') {
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

function frontmatter(fields) {
  const lines = ['---'];

  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === '') continue;

    if (Array.isArray(value)) {
      lines.push(`${key}: ${yamlArray(value)}`);
    } else if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
      lines.push(`${key}: ${value}`);
    } else if (typeof value === 'string') {
      lines.push(`${key}: ${yamlString(value)}`);
    } else {
      lines.push(`${key}: ${value}`);
    }
  }

  lines.push('---');
  return lines.join('\n');
}

async function pathExists(filePath) {
  try {
    await access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function availablePath(directory, basename) {
  let candidate = path.join(directory, `${basename}.md`);
  let counter = 2;

  while (await pathExists(candidate)) {
    candidate = path.join(directory, `${basename}-${counter}.md`);
    counter += 1;
  }

  return candidate;
}

async function readBody() {
  const fromFile = getFlag('--from');
  if (typeof fromFile === 'string') {
    const { readFile } = await import('node:fs/promises');
    return (await readFile(path.resolve(fromFile), 'utf8')).trim();
  }

  const inlineBody = getFlag('--body');
  if (typeof inlineBody === 'string') return inlineBody.trim();

  return '';
}

function shouldBeDraft() {
  if (hasFlag('--draft')) return true;
  if (hasFlag('--publish')) return false;
  return false;
}

async function createWriting() {
  const title = String(getFlag('--title') || positional.join(' ') || await ask('Title', '', true));
  const date = String(getFlag('--date') || await ask('Date', today));
  const description = String(getFlag('--description') || await ask('One-sentence description', 'A note in progress.'));
  const tags = splitTags(String(getFlag('--tags') || await ask('Tags, comma-separated', '')));
  const heroImage = String(getFlag('--hero-image') || await ask('Hero image URL, optional', ''));
  const body = await readBody();
  const slug = `${date}-${slugify(title)}`;
  const filePath = await availablePath('src/content/blog', slug);

  return {
    filePath,
    previewUrl: `/writing/${path.basename(filePath, '.md')}`,
    body: `${frontmatter({
      title,
      description,
      publishDate: date,
      tags,
      heroImage,
      featured: false,
      featureRank: 999,
      isDraft: shouldBeDraft(),
    })}

${body || 'Write here.'}
`,
  };
}

async function createTravel() {
  const title = String(getFlag('--title') || positional.join(' ') || await ask('Title', '', true));
  const date = String(getFlag('--date') || await ask('Date photographed / visited', today));
  const description = String(getFlag('--description') || await ask('One-sentence description', 'A travel note in progress.'));
  const location = String(getFlag('--location') || await ask('Location', 'Travel'));
  const category = String(getFlag('--category') || await ask('Category', 'travel'));
  const tags = splitTags(String(getFlag('--tags') || await ask('Tags, comma-separated', category)));
  const imageUrl = String(getFlag('--image-url') || await ask('Image URL', placeholderImage));
  const aspectRatio = Number(getFlag('--aspect-ratio') || await ask('Aspect ratio width/height', '1.25'));
  const body = await readBody();
  const slug = `${date}-${slugify(title)}`;
  const filePath = await availablePath('src/content/photography', slug);

  return {
    filePath,
    previewUrl: `/travel/${path.basename(filePath, '.md')}`,
    body: `${frontmatter({
      title,
      description,
      captureDate: date,
      location,
      category,
      tags,
      imageUrl,
      alt: title,
      aspectRatio: Number.isFinite(aspectRatio) && aspectRatio > 0 ? aspectRatio : 1.25,
      mediaType: 'image',
      featured: false,
      featureRank: 999,
      isDraft: shouldBeDraft(),
    })}

${body || 'Travel notes go here.'}
`,
  };
}

async function createCategory() {
  const name = String(getFlag('--name') || positional.join(' ') || await ask('Category name', '', true));
  const slug = slugify(name) || String(await ask('Category file slug', '', true));
  const description = String(getFlag('--description') || await ask('Description, optional', ''));
  const coverImage = String(getFlag('--cover-image') || await ask('Cover image URL', placeholderImage));
  const filePath = await availablePath('src/content/photoCategories', slug);

  return {
    filePath,
    previewUrl: `/photography/${path.basename(filePath, '.md')}`,
    body: `${frontmatter({
      name,
      coverImage,
      description,
    })}

This file defines a photo category.
`,
  };
}

const creators = {
  writing: createWriting,
  travel: createTravel,
  category: createCategory,
};

try {
  const type = await chooseType();
  const result = await creators[type]();
  rl.close();

  if (hasFlag('--dry-run')) {
    output.write(`\nWould create: ${result.filePath}\n\n${result.body}`);
    process.exit(0);
  }

  await writeFile(result.filePath, result.body, { flag: 'wx' });
  output.write(`\nCreated: ${result.filePath}\n`);
  output.write(`Preview: ${result.previewUrl}\n`);
} catch (error) {
  rl.close();
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
}
