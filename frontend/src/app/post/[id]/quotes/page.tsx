import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { postQueryOptions } from "@/hooks/usePost";
import { getQueryClient } from "@/lib/query-client";
import { isNotFoundError } from "@/lib/errors";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  try {
    const post = await getQueryClient().fetchQuery(postQueryOptions(id));
    const excerpt = post.content.slice(0, 40);
    return {
      title: `Citas de "${excerpt}"`,
      description: `Todas las citas del post: ${post.content.slice(0, 120)}`,
    };
  } catch (error) {
    if (isNotFoundError(error)) return { title: "Post no encontrado" };
    throw error;
  }
}

export default async function PostQuotesPage({ params }: Props) {
  const { id } = await params;

  try {
    await getQueryClient().fetchQuery(postQueryOptions(id));
  } catch (error) {
    if (isNotFoundError(error)) notFound();
    throw error;
  }

  return (
    <div className="flex flex-1 items-center justify-center">
      <p className="text-muted">Citas de este post — próximamente.</p>
    </div>
  );
}
