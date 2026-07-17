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
            className={`flex items-center gap-1 rounded px-2 py-0.5 ${
              mine ? "bg-primary/20 text-primary" : "text-muted hover:text-primary"
            }`}
          >
            <span>{emoji}</span>
            {count > 0 && <span>{count}</span>}
          </button>
        );
      })}
    </div>
  );
}
