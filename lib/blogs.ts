import { randomUUID } from "crypto";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

export type BlogMeta = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  updatedAt: string;
};

export type BlogRecord = BlogMeta & {
  content: string;
};

export type CreateBlogInput = {
  title: string;
  summary: string;
  content: string;
  publishedAt?: string;
};

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "blogs.json");
const POSTS_DIR = path.join(DATA_DIR, "posts");

function getFsErrorCode(error: unknown) {
  return (error as NodeJS.ErrnoException | undefined)?.code;
}

async function ensureWritableDir(target: string) {
  try {
    await fs.mkdir(target, { recursive: true });
  } catch (error) {
    const code = getFsErrorCode(error);
    if (code === "EEXIST" || code === "EROFS") {
      return;
    }
    throw error;
  }
}

async function readDb(): Promise<BlogMeta[]> {
  try {
    const file = await fs.readFile(DB_PATH, "utf-8");
    const parsed = JSON.parse(file) as { posts: BlogMeta[] };
    return parsed.posts ?? [];
  } catch (error) {
    const code = getFsErrorCode(error);
    if (code === "ENOENT") {
      return [];
    }
    console.error("Failed to read blog database", error);
    return [];
  }
}

async function writeDb(posts: BlogMeta[]) {
  await ensureWritableDir(DATA_DIR);
  try {
    await fs.writeFile(
      DB_PATH,
      JSON.stringify({ posts }, null, 2),
      "utf-8"
    );
  } catch (error) {
    if (getFsErrorCode(error) === "EROFS") {
      throw new Error("Cannot persist posts on a read-only filesystem.");
    }
    throw error;
  }
}

function slugify(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "")
    .slice(0, 60) || "post";
}

export async function listBlogMetadata(): Promise<BlogMeta[]> {
  const posts = await readDb();
  return posts.sort(
    (a, b) =>
      new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export async function getBlogMetaBySlug(slug: string) {
  const posts = await readDb();
  return posts.find((post) => post.slug === slug) ?? null;
}

export async function getBlogRecord(slug: string): Promise<BlogRecord | null> {
  const meta = await getBlogMetaBySlug(slug);
  if (!meta) return null;

  const filePath = path.join(POSTS_DIR, `${slug}.mdx`);
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const { content } = matter(raw);
    return { ...meta, content };
  } catch (err) {
    console.error("Failed to read MDX for", slug, err);
    return null;
  }
}

export async function createBlog(input: CreateBlogInput): Promise<BlogMeta> {
  const posts = await readDb();
  const now = new Date().toISOString();
  const slugBase = slugify(input.title);
  let slug = slugBase;
  let suffix = 1;
  while (posts.some((p) => p.slug === slug)) {
    slug = `${slugBase}-${suffix++}`;
  }

  const newPost: BlogMeta = {
    id: randomUUID(),
    slug,
    title: input.title,
    summary: input.summary,
    publishedAt: input.publishedAt ?? now,
    updatedAt: now,
  };

  await ensureWritableDir(POSTS_DIR);
  const postFile = path.join(POSTS_DIR, `${slug}.mdx`);
  try {
    await fs.writeFile(postFile, input.content, "utf-8");
  } catch (error) {
    if (getFsErrorCode(error) === "EROFS") {
      throw new Error("Cannot create posts on a read-only filesystem.");
    }
    throw error;
  }

  await writeDb([newPost, ...posts]);
  return newPost;
}
