import { PostCard } from "@/components/PostCard";
import { getBaseUrl } from "@/lib/site";

type BlogMeta = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  updatedAt: string;
};

async function fetchPosts(): Promise<BlogMeta[]> {
  const res = await fetch(`${getBaseUrl()}/api/blogs`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error("Failed to load posts");
  }

  const data = (await res.json()) as { posts: BlogMeta[] };
  return data.posts;
}

export default async function HomePage() {
  const posts = await fetchPosts();

  return (
    <main className="mx-auto flex max-w-5xl flex-col gap-10 px-6 py-14">
      <header className="space-y-4 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
          BLOG
        </p>
        <h1 className="text-4xl font-semibold text-zinc-900 dark:text-zinc-50">
          Blog Website
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-300">
          Every post is written in MDX and served through API routes. Admin Panel - /admin
        </p>
      </header>

      <section className="grid gap-6">
        {posts.length === 0 ? (
          <p className="text-center text-zinc-600 dark:text-zinc-300">
            No posts yet. Head to the admin panel to create the first entry.
          </p>
        ) : (
          posts.map((post) => <PostCard key={post.id} {...post} />)
        )}
      </section>
    </main>
  )
}