export function getBaseUrl() {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_URL;

  if (url) {
    return url.startsWith("http") ? url : `https://${url}`;
  }

  return "http://localhost:3000";
}
