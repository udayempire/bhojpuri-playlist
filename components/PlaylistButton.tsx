"use client";

import { ListMusic, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import type { Song } from "@/lib/playlist";
import { getThumbUrl } from "@/lib/playlist";

interface PlaylistButtonProps {
  count?: number;
  onClick?: () => void;

  // Added for playlist popup
  songs: Song[];
  currentIndex: number;
  onSelect: (index: number) => void;
}

export default function PlaylistButton({
  onClick,
  songs,
  currentIndex,
  onSelect,
}: PlaylistButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  // Close when clicking anywhere outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside,
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside,
      );
    };
  }, [isOpen]);

  const handleButtonClick = () => {
    setIsOpen((prev) => !prev);

    // Preserve your existing onClick
    onClick?.();
  };

  return (
    <div
      ref={containerRef}
      className="relative shrink-0"
    >
      {/* =========================
          Playlist Popup
         ========================= */}
      <div
        className={`
          fixed sm:absolute
          top-1/2 sm:top-auto
          left-1/2 sm:left-auto
          bottom-auto sm:bottom-full
          right-auto sm:right-0
          -translate-x-1/2 sm:translate-x-0
          -translate-y-1/2 sm:translate-y-0
          sm:mb-3
          z-[100]
          w-[90vw] sm:w-80
          origin-center sm:origin-bottom-right
          overflow-hidden
          rounded-2xl
          border border-white/20
          bg-black/60
          shadow-[0_10px_40px_rgba(0,0,0,0.35)]
          backdrop-blur-xl

          transition-all
          duration-300
          ease-out

          ${
            isOpen
              ? "pointer-events-auto scale-100 opacity-100"
              : "pointer-events-none scale-95 opacity-0"
          }
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
          <div>
            <p className="text-sm font-semibold text-white">
              Playlist
            </p>

            {/* <p className="text-xs text-white/40">
              {songs.length} songs
            </p> */}
          </div>

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="
              flex h-7 w-7
              items-center justify-center
              rounded-full
              text-white/50
              transition-colors
              hover:bg-white/10
              hover:text-white
            "
            aria-label="Close playlist"
          >
            <X size={15} />
          </button>
        </div>

        {/* Songs */}
        <div className="max-h-80 overflow-y-auto p-2">
          {songs.map((song, index) => {
            const isCurrent = index === currentIndex;

            return (
              <button
                key={song.id}
                type="button"
                onClick={() => {
                  onSelect(index);
                  setIsOpen(false);
                }}
                className={`
                  flex w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-2 py-2
                  text-left
                  transition-colors

                  ${
                    isCurrent
                      ? "bg-white/15"
                      : "hover:bg-white/10"
                  }
                `}
              >
                {/* Index */}
                <span
                  className={`
                    w-5
                    shrink-0
                    text-center
                    text-xs

                    ${
                      isCurrent
                        ? "text-white"
                        : "text-white/30"
                    }
                  `}
                >
                  {isCurrent ? "▶" : index + 1}
                </span>

                {/* Thumbnail */}
                <div className="h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-white/10">
                  <img
                    src={getThumbUrl(song.id)}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Song info */}
                <div className="min-w-0 flex-1">
                  <p
                    className={`
                      truncate
                      text-sm
                      font-medium

                      ${
                        isCurrent
                          ? "text-white"
                          : "text-white/75"
                      }
                    `}
                  >
                    {song.title}
                  </p>

                  <p className="truncate text-xs text-white/40">
                    {song.artist}
                  </p>
                </div>

                {/* Duration */}
                <span className="shrink-0 text-[11px] text-white/30">
                  {song.duration}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <button
        type="button"
        onClick={handleButtonClick}
        aria-label="Open playlist"
        aria-expanded={isOpen}
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
      </button>
    </div>
  );
}