import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';
import { createInterface } from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import fs from 'node:fs/promises';
import path from 'node:path';

const CONTENT_DIR = path.resolve('src/content/photography');
const DEFAULT_FOLDER = process.env.CLOUDINARY_UPLOAD_FOLDER || 'jward-atlas';

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

function toAspectRatio(width, height) {
  if (!width || !height) return 1.25;
  return Number((width / height).toFixed(2));
}

function isConfiguredForCloudinary() {
  return (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );
}

function configureCloudinary() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

async function uploadLocalAsset(filePath, mediaType, folder) {
  if (!isConfiguredForCloudinary()) {
    throw new Error('Missing Cloudinary credentials. Fill in .env first.');
  }

  configureCloudinary();

  const result = await cloudinary.uploader.upload(path.resolve(filePath), {
    folder,
    resource_type: mediaType === 'video' ? 'video' : 'image',
  });

  if (mediaType === 'video') {
    const posterImage = cloudinary.url(result.public_id, {
      resource_type: 'video',
      secure: true,
      format: 'jpg',
      transformation: [{ start_offset: '0' }],
    });

    return {
      imageUrl: posterImage,
      videoUrl: result.secure_url,
      aspectRatio: toAspectRatio(result.width, result.height),
    };
  }

  return {
    imageUrl: result.secure_url,
    videoUrl: '',
    aspectRatio: toAspectRatio(result.width, result.height),
  };
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
  const date = args.date || await rl.question(`Capture date (${today}): `) || today;
  const location = args.location || await rl.question('Location: ');
  const category = args.category || await rl.question('Category (street / landscape / vlog / etc): ');
  const tagsInput =
    args.tags ||
    await rl.question('Tags (comma separated): ');
  const mediaTypeInput =
    args.type ||
    await rl.question('Media type (image/video) [image]: ');
  const featuredInput =
    args.featured !== undefined
      ? String(args.featured)
      : await rl.question('Featured on homepage? (y/N): ');
  const body = (await readBodyFromFile(args.notes)).trim() || 'Travel notes go here.\n';

  const mediaType = mediaTypeInput.trim().toLowerCase() === 'video' ? 'video' : 'image';
  const localMediaPath =
    args.file ||
    await rl.question('Local file path to upload (optional): ');

  let imageUrl = args['image-url'] || '';
  let videoUrl = args['video-url'] || '';
  let posterImage = args['poster-image'] || '';
  let aspectRatio = Number(args['aspect-ratio'] || 0);

  if (localMediaPath.trim()) {
    const uploaded = await uploadLocalAsset(localMediaPath.trim(), mediaType, `${DEFAULT_FOLDER}/${category || 'travel'}`);
    imageUrl = uploaded.imageUrl;
    videoUrl = uploaded.videoUrl;
    aspectRatio = uploaded.aspectRatio;
    posterImage = mediaType === 'video' ? uploaded.imageUrl : '';
  } else {
    if (!imageUrl) {
      imageUrl = await rl.question(
        mediaType === 'video'
          ? 'Poster image URL: '
          : 'Image URL: ',
      );
    }
    if (mediaType === 'video' && !videoUrl) {
      videoUrl = await rl.question('Video URL: ');
    }
    if (!aspectRatio) {
      const ratioInput = await rl.question('Aspect ratio (width/height, e.g. 1.5): ');
      aspectRatio = Number(ratioInput || 1.25);
    }
  }

  if (mediaType === 'video' && !posterImage) {
    posterImage = imageUrl;
  }

  const slug = `${date}-${slugify(title)}`;
  const filePath = path.join(CONTENT_DIR, `${slug}.md`);
  const tags = splitTags(tagsInput);
  const featured = ['y', 'yes', 'true', '1'].includes(featuredInput.trim().toLowerCase());

  const frontmatter = [
    '---',
    `title: ${yamlString(title)}`,
    `description: ${yamlString(description || 'A travel note in progress.')}`,
    `captureDate: ${date}`,
    `location: ${yamlString(location || 'Travel')}`,
    `category: ${yamlString(category || 'travel')}`,
    `tags: ${yamlArray(tags)}`,
    `imageUrl: ${yamlString(imageUrl)}`,
    `aspectRatio: ${Number(aspectRatio || 1.25).toFixed(2)}`,
    `mediaType: ${yamlString(mediaType)}`,
    mediaType === 'video' ? `videoUrl: ${yamlString(videoUrl)}` : null,
    mediaType === 'video' ? `posterImage: ${yamlString(posterImage)}` : null,
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
  output.write(`Created travel entry: ${path.relative(process.cwd(), filePath)}\n`);
} finally {
  rl.close();
}
