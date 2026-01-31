import { defineCollection, z } from 'astro:content';


// Blog collection (.md)
const blogCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().url().optional(), // Cloudinary URL
    isDraft: z.boolean().default(false)
  })
});


// Photography collection (.md used for metadata; image hosted on Cloudinary)
const photographyCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    captureDate: z.coerce.date(),
    category: z.string().optional(),
    tags: z.array(z.string()).default([]),
    imageUrl: z.string().url(), // Cloudinary URL
    aspectRatio: z.number().default(1)
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