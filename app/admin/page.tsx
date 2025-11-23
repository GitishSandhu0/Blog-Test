"use client";

import { FormEvent, useEffect, useState, useTransition } from "react";

type BlogMeta = {
  id: string;
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
  updatedAt: string;
};

const initialForm = {
  title: "",
  summary: "",
  content: `# New draft\n\nStart writing your MDX post here...`,
  publishedAt: "",
};

const UNAVAILABLE_MESSAGE = "Databse not hosted yet, feature unavailable";

export default function AdminPage() {
  const [form, setForm] = useState(initialForm);
  const [posts, setPosts] = useState<BlogMeta[]>([]);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  async function refreshPosts() {
    const res = await fetch("/api/blogs", { cache: "no-store" });
    if (res.ok) {
      const data = (await res.json()) as { posts: BlogMeta[] };
      setPosts(data.posts);
    }
  }

  useEffect(() => {
    startTransition(() => {
      refreshPosts();
    });
  }, []);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage(UNAVAILABLE_MESSAGE);
  }

  return (
    <main className="mx-auto grid max-w-5xl gap-10 px-6 py-14 md:grid-cols-[2fr,1fr]">
      <section>
        <header className="mb-6 space-y-2">
          <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
            Admin panel
          </p>
          <h1 className="text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
            Draft a new MDX post
          </h1>
          <p className="text-base text-zinc-600 dark:text-zinc-300">
            Posts are text-only. Paste or type MDX and publish instantly.
          </p>
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800 dark:border-amber-900/40 dark:bg-amber-500/10 dark:text-amber-200">
            {UNAVAILABLE_MESSAGE}
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              Title
            </label>
            <input
              type="text"
              required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              placeholder="An engaging headline"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              Summary
            </label>
            <textarea
              required
              rows={3}
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
              placeholder="One or two sentences summarizing the post"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              Body (MDX)
            </label>
            <textarea
              required
              rows={12}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base font-mono text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
              Published date (optional)
            </label>
            <input
              type="datetime-local"
              value={form.publishedAt}
              onChange={(e) => setForm({ ...form, publishedAt: e.target.value })}
              className="mt-1 w-full rounded-lg border border-zinc-300 bg-white px-3 py-2 text-base text-zinc-900 shadow-sm focus:border-amber-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-50"
            />
          </div>

          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-zinc-400 px-5 py-2 text-base font-semibold text-white shadow-sm"
          >
            {UNAVAILABLE_MESSAGE}
          </button>

          {message && (
            <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
              {message}
            </p>
          )}
        </form>
      </section>

      <aside className="rounded-2xl border border-zinc-200 bg-white/70 p-5 shadow-sm dark:border-zinc-800 dark:bg-zinc-900/70">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Recent posts
          </h2>
          {isPending && (
            <span className="text-xs uppercase tracking-wide text-amber-600">
              Refreshing...
            </span>
          )}
        </div>
        <ul className="mt-4 space-y-4">
          {posts.length === 0 && (
            <li className="text-sm text-zinc-600 dark:text-zinc-300">
              Nothing published yet.
            </li>
          )}

          {posts.map((post) => (
            <li key={post.id} className="space-y-1">
              <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {post.title}
              </p>
              <p className="text-xs uppercase tracking-[0.3em] text-amber-600">
                {new Intl.DateTimeFormat("en-GB", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                }).format(new Date(post.publishedAt))}
              </p>
              <a
                href={`/blog/${post.slug}`}
                target="_blank"
                rel="noreferrer"
                className="text-sm font-semibold text-amber-600 hover:text-amber-500"
              >
                View post ↗
              </a>
            </li>
          ))}
        </ul>
      </aside>
    </main>
  );
}
