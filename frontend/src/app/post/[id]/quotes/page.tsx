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

  const excerpt = post.content.slice(0, 40);
  return {
    title: `Citas de "${excerpt}"`,
    description: `Todas las citas del post: ${post.content.slice(0, 120)}`,
  };
}

export default async function PostQuotesPage({ params }: Props) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-muted">Citas de este post — próximamente.</p>
    </div>
  );
}
