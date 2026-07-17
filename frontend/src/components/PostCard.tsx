"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { championQueryOptions } from "@/hooks/useChampion";
import { postQueryOptions } from "@/hooks/usePost";
import type { Post } from "@/lib/api";
import { relativeDate, toIdentifier } from "@/lib/format";
import { ChampionIcon } from "./ChampionIcon";
import { Modal } from "./Modal";
import { NewQuoteForm } from "./NewQuoteForm";
import { NewRepostForm } from "./NewRepostForm";
import { ReactionBar } from "./ReactionBar";

export function PostCard({ post }: { post: Post }) {
  // Regular (non-suspense) query on purpose: a transient failure fetching
  // one card's champion shouldn't crash the whole feed via the error
  // boundary -- it just falls back to showing the raw championId.
  const { data: champion } = useQuery(championQueryOptions(post.championId));
  const [quoting, setQuoting] = useState(false);
  const [reposting, setReposting] = useState(false);

  // A repost carries no content of its own -- it's a thin pointer to the
  // original post, so it renders as "X reposteó" plus the original embedded,
  // instead of the usual champion/content layout.
  const { data: reposted } = useQuery({
    ...postQueryOptions(post.repostOf ?? ""),
    enabled: Boolean(post.repostOf),
  });

  if (post.repostOf) {
    if (!reposted) return null;
    return (
      <div className="border-b border-extra p-4">
        <div className="mb-2 flex items-center gap-2 text-sm text-muted">
          <ChampionIcon
            championId={post.championId}
            alt={post.championId}
            size={20}
            className="size-5 rounded-full ring-2 ring-primary/40"
          />
          <span>{champion?.name ?? post.championId} reposteó</span>
          <span className="font-mono">· {relativeDate(post.createdAt)}</span>
        </div>
        <div className="rounded border border-extra">
          <PostCard post={reposted} />
        </div>
      </div>
    );
  }

  return (
    <article className="flex gap-3 border-b border-extra p-4">
      <Link href={`/champions/${post.championId}`} className="shrink-0">
        <ChampionIcon
          championId={post.championId}
          alt={post.championId}
          size={48}
          className="size-12 rounded-full ring-2 ring-primary/40"
        />
      </Link>
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <Link href={`/champions/${post.championId}`} className="font-bold text-paper">
            {champion?.name ?? post.championId}
          </Link>
          {champion && <span className="text-sm text-muted">{toIdentifier(champion.title)}</span>}
          <span className="font-mono text-sm text-muted">· {relativeDate(post.createdAt)}</span>
        </div>
        <Link href={`/post/${post.id}`}>
          <p className="text-paper">{post.content}</p>
        </Link>
        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm text-muted">
          <Link href={`/post/${post.id}`} className="hover:text-primary">
            <span className="font-mono">{post.responsesCount}</span> respuestas
          </Link>
          <Link href={`/post/${post.id}/quotes`} className="hover:text-primary">
            <span className="font-mono">{post.quotesCount}</span> citas
          </Link>
          <button type="button" onClick={() => setQuoting(true)} className="hover:text-primary">
            Citar
          </button>
          <Link href={`/post/${post.id}/reposts`} className="hover:text-primary">
            <span className="font-mono">{post.repostsCount}</span> reposts
          </Link>
          <button type="button" onClick={() => setReposting(true)} className="hover:text-primary">
            Repostear
          </button>
        </div>
        <ReactionBar postId={post.id} />
      </div>

      {quoting && (
        <Modal onClose={() => setQuoting(false)}>
          <NewQuoteForm post={post} onClose={() => setQuoting(false)} />
        </Modal>
      )}

      {reposting && (
        <Modal onClose={() => setReposting(false)}>
          <NewRepostForm post={post} onClose={() => setReposting(false)} />
        </Modal>
      )}
    </article>
  );
}
