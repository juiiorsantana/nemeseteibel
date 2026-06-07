import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title:    z.string(),
    date:     z.string(),
    pubDate:  z.date(),
    readTime: z.string(),
    tag:      z.string(),
    author:   z.string(),
    excerpt:  z.string(),
    img:      z.string(),
    imgAlt:   z.string(),
  }),
});

export const collections = { blog };
