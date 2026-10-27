import { getCollection, type CollectionEntry } from 'astro:content';
import type { Post } from './search';

export type ProjectEntry = CollectionEntry<'projects'>;

export interface Project extends Post {
  image: string;
  url?: string;
}

export interface ProjectDataOptions {
  includeDrafts?: boolean;
}

export function formatProject(entry: ProjectEntry): Project {
  const dateObj = entry.data.date instanceof Date
    ? entry.data.date
    : new Date(entry.data.date);
  const dateStr = !isNaN(dateObj.getTime())
    ? dateObj.toISOString().slice(0, 10)
    : String(entry.data.date ?? '');

  return {
    slug: entry.id,
    href: `/projects/${entry.id}`,
    title: entry.data.title,
    date: dateStr,
    excerpt: entry.data.description,
    tags: entry.data.tags ?? [],
    image: entry.data.image ?? entry.data.ogImage ?? '/placeholder.svg',
    url: entry.data.url,
  };
}

export async function getProjectPosts(options: ProjectDataOptions = {}): Promise<Project[]> {
  const { includeDrafts = false } = options;

  const entries = await getCollection('projects', (entry) => {
    return includeDrafts || !entry.data.draft;
  });

  entries.sort((a, b) => {
    const timeA = a.data.date instanceof Date ? a.data.date.getTime() : new Date(a.data.date).getTime();
    const timeB = b.data.date instanceof Date ? b.data.date.getTime() : new Date(b.data.date).getTime();
    return timeB - timeA;
  });

  return entries.map(formatProject);
}

export const getProjectData = getProjectPosts;
