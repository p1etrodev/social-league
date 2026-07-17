"use client";

import { REACTION_EMOJIS } from "@/lib/api";
import { useReactions } from "@/hooks/useReactions";

const LABELS: Record<string, string> = {
  "⚡": "Pentakill",
  "🛡️": "GG",
  "💀": "Ace",
};

export function ReactionBar({ postId }: { postId: string }) {
  const { reactions, toggle } = useReactions(postId);

  return (
    <div className="flex gap-2 text-sm">
      {REACTION_EMOJIS.map((emoji) => {
        const count = reactions?.counts[emoji] ?? 0;
        const mine = reactions?.mine.includes(emoji) ?? false;
        return (
          <button
            key={emoji}
            type="button"
            onClick={() => toggle(emoji)}
            title={LABELS[emoji]}
            className={`flex items-center gap-1 rounded-full border px-2 py-0.5 ${
              mine
                ? "glow-blue border-secondary/40 bg-secondary/15 text-secondary"
                : "border-extra/20 text-muted hover:text-secondary"
            }`}
          >
            <span>{emoji}</span>
            {count > 0 && <span className="font-mono">{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
