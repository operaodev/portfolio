import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

// Files are date-prefixed so they sort chronologically; keep URLs date-free.
const generateId = ({ entry }: { entry: string }) =>
  entry.replace(/(^|\/)\d{4}-\d{2}-\d{2}-/, '$1').replace(/\.md$/, '');

const postSchema = z.object({
  title: z.string(),
  description: z.string(),
  date: z.coerce.date(),
  tags: z.array(z.string()).default([]),
  draft: z.boolean().optional().default(false),
  ogImage: z.string().optional()
});

const archives = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/archives',
    generateId
  }),
  schema: postSchema
});

const projects = defineCollection({
  loader: glob({
    pattern: '**/*.md',
    base: './src/content/projects',
    generateId
  }),
  schema: postSchema.extend({
    image: z.string().optional(),
    url: z.url().optional()
  })
});

export const collections = { archives, projects };
