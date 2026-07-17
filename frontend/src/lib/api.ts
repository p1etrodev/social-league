const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export type Post = {
  id: string;
  createdAt: string;
  championId: string;
  content: string;
  responseOf: string | null;
  quoteOf: string | null;
  repostOf: string | null;
  responsesCount: number;
  quotesCount: number;
};

export async function getPost(id: string): Promise<Post | null> {
  const res = await fetch(`${apiUrl}/api/v1/posts/${id}`, { cache: "no-store" });
  // Only a real 404 from the API means "this post doesn't exist" -- any
  // other failure (backend down, 5xx) should surface as a real error
  // instead of being silently treated as not-found.
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to fetch post ${id}: ${res.status}`);
  return res.json();
}
