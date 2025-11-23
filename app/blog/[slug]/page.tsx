import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import Highlight from "@/components/Highlight";
import { getBaseUrl } from "@/lib/site";

type BlogRecord = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  publishedAt: string;
  updatedAt: string;
};

const mdxComponents = {
  Highlight,
};

async function fetchPost(slug: string): Promise<BlogRecord | null> {
  const res = await fetch(`${getBaseUrl()}/api/blogs/${slug}`, {
    cache: "no-store",
  });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    throw new Error("Failed to load post");
  }

  return (await res.json()) as BlogRecord;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: `${post.title} | MDX Blog Demo`,
    description: post.summary,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await fetchPost(slug);
  if (!post) {
    notFound();
  }

  const formattedDate = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(post.publishedAt));

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16">
      <div className="space-y-2">
        <Link
          href="/"
          className="text-sm font-semibold text-amber-600 hover:text-amber-500"
        >
          ← Back to posts
        </Link>
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
          {formattedDate}
        </p>
        <h1 className="text-4xl font-semibold text-zinc-900 dark:text-zinc-50">
          {post.title}
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-300">{post.summary}</p>
      </div>

      <article className="space-y-6 text-lg leading-relaxed text-zinc-700 dark:text-zinc-200">
        <MDXRemote source={post.content} components={mdxComponents} />
      </article>
    </main>
  );
}
