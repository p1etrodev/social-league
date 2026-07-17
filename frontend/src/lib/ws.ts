const apiUrl = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export function postsWsUrl(): string {
  return `${apiUrl.replace(/^http/, "ws")}/ws/posts`;
}
