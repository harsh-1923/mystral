import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface BlogMeta {
  title: string;
  slug: string;
  date: string;
  tags: string[];
  tldr: string;
  relPath: string;
}

export interface BlogPost extends BlogMeta {
  content: string;
}

export function getAllWritings(): BlogMeta[] {
  const contentDir = path.join(process.cwd(), 'app/writings/content');
  const files = fs.readdirSync(contentDir).filter(file => file.endsWith('.mdx'));

  return files.map((file) => {
    const filePath = path.join(contentDir, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data } = matter(fileContents);
    const slug = file.replace(/\.mdx$/, '');
    return {
      title: data.title || '',
      slug: `/writings/${slug}`,
      date: data.date || '',
      tags: data.tags || [],
      tldr: data.tldr || '',
      relPath: `/writings/${slug}`,
    };
  });
}

export function getWritingBySlug(slug: string): BlogPost | null {
  const contentDir = path.join(process.cwd(), 'app/writings/content');
  const filePath = path.join(contentDir, `${slug}.mdx`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    title: data.title || '',
    slug: `/writings/${slug}`,
    date: data.date || '',
    tags: data.tags || [],
    tldr: data.tldr || '',
    content,
    relPath: `/writings/${slug}`,
  };
}
