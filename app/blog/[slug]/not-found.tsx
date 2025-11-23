import Link from "next/link";

export default function BlogPostNotFound() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-20 text-center">
      <p className="text-sm uppercase tracking-[0.3em] text-amber-600">
        404
      </p>
      <h1 className="mt-3 text-3xl font-semibold text-zinc-900 dark:text-zinc-50">
        Error 404
      </h1>
      <p className="mt-2 text-zinc-600 dark:text-zinc-300">
        incorrect url
      </p>
      <Link
        href="/"
        className="mt-6 inline-flex items-center justify-center rounded-full bg-amber-500 px-6 py-2 text-sm font-semibold text-white hover:bg-amber-400"
      >
        Home
      </Link>
    </main>
  );
}
