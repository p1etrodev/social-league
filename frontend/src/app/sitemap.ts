import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/site";
import { fetchChampions } from "@/lib/data-dragon";
import { fetchPosts, type Post } from "@/lib/api";

const POST_PAGE_SIZE = 100;

/** Root posts only (quotes/reposts are standalone root posts too, so this
 * already covers them -- responses only exist nested under their parent's
 * page and aren't worth their own sitemap entries). */
async function fetchAllRootPosts(): Promise<Post[]> {
  const posts: Post[] = [];
  let offset = 0;
  let total = Infinity;
  while (offset < total) {
    const page = await fetchPosts({ limit: POST_PAGE_SIZE, offset });
    posts.push(...page.posts);
    total = page.count;
    offset += POST_PAGE_SIZE;
  }
  return posts;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [champions, posts] = await Promise.all([fetchChampions(), fetchAllRootPosts()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: siteUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteUrl}/champions`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/trending`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.7,
    },
  ];

  const championRoutes: MetadataRoute.Sitemap = champions.map((champion) => ({
    url: `${siteUrl}/champions/${champion.id}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.flatMap((post) => [
    {
      url: `${siteUrl}/post/${post.id}`,
      lastModified: post.createdAt,
      changeFrequency: "daily" as const,
      priority: 0.5,
    },
    {
      url: `${siteUrl}/post/${post.id}/quotes`,
      lastModified: post.createdAt,
      changeFrequency: "daily" as const,
      priority: 0.3,
    },
    {
      url: `${siteUrl}/post/${post.id}/reposts`,
      lastModified: post.createdAt,
      changeFrequency: "daily" as const,
      priority: 0.3,
    },
  ]);

  return [...staticRoutes, ...championRoutes, ...postRoutes];
}
