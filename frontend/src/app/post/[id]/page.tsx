import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/api";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return { title: "Post no encontrado" };

  return {
    title: post.content.slice(0, 60),
    description: post.content.slice(0, 160),
    openGraph: { title: post.content.slice(0, 60), description: post.content.slice(0, 160) },
    twitter: { title: post.content.slice(0, 60), description: post.content.slice(0, 160) },
  };
}

export default async function PostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="max-w-lg text-center text-paper">{post.content}</p>
    </div>
  );
}
