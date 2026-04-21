import { defineCollection, z } from 'astro:content';


// Blog collection (.md)
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().url().optional(),
    featured: z.boolean().default(false),
    featureRank: z.number().int().default(999),
    isDraft: z.boolean().default(false)
  })
});


// Photography collection powers the Travel section.
const photographyCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    captureDate: z.coerce.date(),
    location: z.string().optional(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    imageUrl: z.string().url(),
    alt: z.string().optional(),
    aspectRatio: z.number().positive().default(1.25),
    mediaType: z.enum(['image', 'video']).default('image'),
    videoUrl: z.string().url().optional(),
    posterImage: z.string().url().optional(),
    featured: z.boolean().default(false),
    featureRank: z.number().int().default(999),
    isDraft: z.boolean().default(false)
  })
});

// Homepage collection (.md)
const homepageCollection = defineCollection({
  type: 'content',
  schema: z.object({
    heroImage: z.string().url(),
    heroImageAlt: z.string(),
    title: z.string(),
    description: z.string(),
  })
});

// Photography Categories collection
const photoCategoriesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    coverImage: z.string().url(),
    description: z.string().optional(),
  })
});


export const collections = {
  blog: blogCollection,
  photography: photographyCollection,
  homepage: homepageCollection,
  photoCategories: photoCategoriesCollection,
};
