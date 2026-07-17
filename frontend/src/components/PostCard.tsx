"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { championQueryOptions } from "@/hooks/useChampion";
import type { Post } from "@/lib/api";
import { relativeDate, toIdentifier } from "@/lib/format";
import { ChampionIcon } from "./ChampionIcon";
import { Modal } from "./Modal";
import { NewQuoteForm } from "./NewQuoteForm";

export function PostCard({ post }: { post: Post }) {
  // Regular (non-suspense) query on purpose: a transient failure fetching
  // one card's champion shouldn't crash the whole feed via the error
  // boundary -- it just falls back to showing the raw championId.
  const { data: champion } = useQuery(championQueryOptions(post.championId));
  const [quoting, setQuoting] = useState(false);

  return (
    <article className="flex gap-3 border-b border-extra p-4">
      <Link href={`/champions/${post.championId}`} className="shrink-0">
        <ChampionIcon
          championId={post.championId}
          alt={post.championId}
          size={48}
          className="size-12 rounded-full"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <Link href={`/champions/${post.championId}`} className="font-bold text-paper">
            {champion?.name ?? post.championId}
          </Link>
          {champion && <span className="text-sm text-muted">{toIdentifier(champion.title)}</span>}
          <span className="text-sm text-muted">· {relativeDate(post.createdAt)}</span>
        </div>
        <Link href={`/post/${post.id}`}>
          <p className="text-paper">{post.content}</p>
        </Link>
        <div className="mt-2 flex gap-6 text-sm text-muted">
          <Link href={`/post/${post.id}`} className="hover:text-primary">
            {post.responsesCount} respuestas
          </Link>
          <Link href={`/post/${post.id}/quotes`} className="hover:text-primary">
            {post.quotesCount} citas
          </Link>
          <button type="button" onClick={() => setQuoting(true)} className="hover:text-primary">
            Citar
          </button>
        </div>
      </div>

      {quoting && (
        <Modal onClose={() => setQuoting(false)}>
          <NewQuoteForm post={post} onClose={() => setQuoting(false)} />
        </Modal>
      )}
    </article>
  );
}
