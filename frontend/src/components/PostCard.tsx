"use client";

import { relativeDate, toIdentifier } from "@/lib/format";

import { ChampionIcon } from "./ChampionIcon";
import Link from "next/link";
import { Modal } from "./Modal";
import { NewQuoteForm } from "./NewQuoteForm";
import { NewRepostForm } from "./NewRepostForm";
import type { Post } from "@/lib/api";
import { ReactionBar } from "./ReactionBar";
import { championQueryOptions } from "@/hooks/useChampion";
import { postQueryOptions } from "@/hooks/usePost";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type Props = {
  post: Post;
  /** Renders without its own card chrome, for when a post is shown nested
   * inside another card (a repost embed, or a quote/repost preview) so it
   * doesn't double up on background/border/shadow. */
  embedded?: boolean;
  /** Skips the "Respuesta a: ..." banner -- for response lists already
   * grouped under their parent post, where it would just repeat itself
   * on every card. */
  hideParentContext?: boolean;
};

export function PostCard({ post, embedded, hideParentContext }: Props) {
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

  const { data: quoted } = useQuery({
    ...postQueryOptions(post.quoteOf ?? ""),
    enabled: Boolean(post.quoteOf),
  });

  const { data: respondedTo } = useQuery({
    ...postQueryOptions(post.responseOf ?? ""),
    enabled: Boolean(post.responseOf) && !embedded && !hideParentContext,
  });

  if (post.repostOf) {
    if (!reposted) return null;
    return (
      <div className={`relative ${embedded ? "" : "panel p-4"}`}>
        <Link
          href={`/post/${post.id}`}
          className="absolute inset-0 -z-10"
          aria-label={`Ver repost de ${champion?.name ?? post.championId}`}
        />
        <div className="mb-2 flex items-center gap-2 text-sm text-muted">
          <Link href={`/champions/${post.championId}`} className="shrink-0">
            <div className="grid ring-2 ring-primary/30 rounded-full overflow-hidden">
              <ChampionIcon
                championId={post.championId}
                alt={post.championId}
                size={20}
                className="scale-110 place-self-center"
              />
            </div>
          </Link>
          <Link href={`/champions/${post.championId}`} className="hover:text-paper">
            {champion?.name ?? post.championId}
          </Link>
          <span>reposteó</span>
          <span className="font-mono">· {relativeDate(post.createdAt)}</span>
        </div>
        <div className="panel overflow-hidden">
          <PostCard post={reposted} embedded />
        </div>
      </div>
    );
  }

  return (
    <article className={`relative flex gap-3 p-4 ${embedded ? "" : "panel panel-hover"}`}>
      <Link
        href={`/post/${post.id}`}
        className="absolute inset-0 -z-10"
        aria-label={`Ver post de ${champion?.name ?? post.championId}`}
      />
      <Link href={`/champions/${post.championId}`} className="shrink-0">
        <div className="grid ring-2 ring-primary/30 rounded-full overflow-hidden">
          <ChampionIcon
            championId={post.championId}
            alt={post.championId}
            size={48}
            className="scale-110 place-self-center"
          />
        </div>
      </Link>
      <div className="flex flex-1 flex-col gap-1">
        {respondedTo && !hideParentContext && (
          <Link href={`/post/${respondedTo.id}`} className="block text-sm text-muted">
            Respuesta a: <span className="text-paper">{respondedTo.content}</span>
          </Link>
        )}
        <div className="flex flex-wrap items-baseline gap-2">
          <Link href={`/champions/${post.championId}`} className="font-bold text-paper">
            {champion?.name ?? post.championId}
          </Link>
          <span className="font-mono text-sm text-muted">· {relativeDate(post.createdAt)}</span>
        </div>
        {champion && <span className="text-sm text-muted">{toIdentifier(champion.title)}</span>}
        <Link href={`/post/${post.id}`}>
          <p className="text-paper">{post.content}</p>
        </Link>
        {quoted && (
          <div className="panel overflow-hidden">
            <PostCard post={quoted} embedded />
          </div>
        )}
        {!embedded && (
          <>
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
              <button
                type="button"
                onClick={() => setReposting(true)}
                className="hover:text-primary"
              >
                Repostear
              </button>
            </div>
            <ReactionBar postId={post.id} />
          </>
        )}
      </div>

      {!embedded && quoting && (
        <Modal onClose={() => setQuoting(false)}>
          <NewQuoteForm post={post} onClose={() => setQuoting(false)} />
        </Modal>
      )}

      {!embedded && reposting && (
        <Modal onClose={() => setReposting(false)}>
          <NewRepostForm post={post} onClose={() => setReposting(false)} />
        </Modal>
      )}
    </article>
  );
}
