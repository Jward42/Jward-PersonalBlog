import { getCollection, type CollectionEntry } from 'astro:content';

export type WritingEntry = CollectionEntry<'blog'>;
export type TravelEntry = CollectionEntry<'photography'>;

export type HighlightItem =
  | {
      kind: 'writing';
      href: string;
      title: string;
      description: string;
      date: Date;
      image?: string;
      aspectRatio: number;
      tags: string[];
    }
  | {
      kind: 'travel';
      href: string;
      title: string;
      description: string;
      date: Date;
      image: string;
      aspectRatio: number;
      tags: string[];
      location?: string;
    };

function sortByDateDesc<T extends WritingEntry | TravelEntry>(
  left: T,
  right: T,
  getDate: (entry: T) => Date,
) {
  return getDate(right).getTime() - getDate(left).getTime();
}

function sortByFeaturedThenDate<T extends WritingEntry | TravelEntry>(
  left: T,
  right: T,
  getDate: (entry: T) => Date,
) {
  const leftRank = left.data.featured ? left.data.featureRank : Number.MAX_SAFE_INTEGER;
  const rightRank = right.data.featured ? right.data.featureRank : Number.MAX_SAFE_INTEGER;

  if (leftRank !== rightRank) {
    return leftRank - rightRank;
  }

  return sortByDateDesc(left, right, getDate);
}

export async function getWritingEntries() {
  return (await getCollection('blog'))
    .filter((entry) => !entry.data.isDraft)
    .sort((left, right) => sortByDateDesc(left, right, (entry) => entry.data.publishDate));
}

export async function getTravelEntries() {
  return (await getCollection('photography'))
    .filter((entry) => !entry.data.isDraft)
    .sort((left, right) => sortByDateDesc(left, right, (entry) => entry.data.captureDate));
}

export async function getHomepageHighlights(limit = 6): Promise<HighlightItem[]> {
  const [writingEntries, travelEntries] = await Promise.all([getWritingEntries(), getTravelEntries()]);

  const featuredWriting = writingEntries
    .filter((entry) => entry.data.featured)
    .sort((left, right) => sortByFeaturedThenDate(left, right, (entry) => entry.data.publishDate))
    .map<HighlightItem>((entry) => ({
      kind: 'writing',
      href: `/writing/${entry.slug}`,
      title: entry.data.title,
      description: entry.data.description,
      date: entry.data.publishDate,
      image: entry.data.heroImage,
      aspectRatio: 1.28,
      tags: entry.data.tags,
    }));

  const featuredTravel = travelEntries
    .filter((entry) => entry.data.featured)
    .sort((left, right) => sortByFeaturedThenDate(left, right, (entry) => entry.data.captureDate))
    .map<HighlightItem>((entry) => ({
      kind: 'travel',
      href: `/travel/${entry.slug}`,
      title: entry.data.title,
      description: entry.data.description ?? 'A travel note in progress.',
      date: entry.data.captureDate,
      image: entry.data.posterImage ?? entry.data.imageUrl,
      aspectRatio: entry.data.aspectRatio,
      tags: entry.data.tags,
      location: entry.data.location,
    }));

  return [...featuredWriting, ...featuredTravel]
    .sort((left, right) => right.date.getTime() - left.date.getTime())
    .slice(0, limit);
}
