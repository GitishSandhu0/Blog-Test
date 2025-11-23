import Link from "next/link";

export type PostCardProps = {
  slug: string;
  title: string;
  summary: string;
  publishedAt: string;
};

export function PostCard({ slug, title, summary, publishedAt }: PostCardProps) {
  const date = new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(publishedAt));

  return (
    <article className="rounded-xl border border-zinc-200 bg-white/80 p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900/80">
      <p className="text-sm uppercase tracking-wide text-amber-600">
        {date}
      </p>
      <h2 className="mt-2 text-2xl font-semibold text-zinc-900 dark:text-zinc-100">
        <Link href={`/blog/${slug}`}>{title}</Link>
      </h2>
      <p className="mt-3 text-base text-zinc-600 dark:text-zinc-300">{summary}</p>
      <div className="mt-4">
        <Link
          className="text-sm font-semibold text-amber-600 hover:text-amber-500"
          href={`/blog/${slug}`}
        >
          Read post →
        </Link>
      </div>
    </article>
  );
}
