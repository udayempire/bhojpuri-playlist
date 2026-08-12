"use client";

import { ListMusic } from "lucide-react";

interface PlaylistButtonProps {
  count?: number;
  onClick?: () => void;
}

export default function PlaylistButton({
  count,
  onClick,
}: PlaylistButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Open playlist"
      className="
        relative
        flex h-16 w-16 shrink-0
        items-center justify-center
        rounded-full
        border border-white/20
        bg-black/30
        text-white/75
        shadow-[0_10px_40px_rgba(0,0,0,0.25)]
        backdrop-blur-xl
        transition
        hover:scale-105
        hover:bg-black/40
        hover:text-white
        active:scale-95
      "
    >
      <ListMusic
        size={19}
        strokeWidth={1.8}
      />
{/* 
      {count !== undefined && (
        <span
          className="
            absolute
            -bottom-0.5
            -right-0.5
            flex h-4 w-4
            items-center justify-center
            rounded-full
            border border-white/20
            bg-black/60
            text-[8px]
            font-medium
            leading-none
            text-white/80
            shadow-[0_2px_8px_rgba(0,0,0,0.25)]
            backdrop-blur-md
          "
        >
          {count}
        </span>
      )} */}
    </button>
  );
}