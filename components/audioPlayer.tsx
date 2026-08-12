"use client";

import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface MusicPlayerProps {
    title?: string;
    artist?: string;
    albumIArt?: string;
    duration?: string;
}

export default function MusicPlayer({
    title = "Kamariya Hila Rahi Hai",
    artist = "Pawan Singh",
    albumArt = "/album.jpg",
    duration = "4:48",
}: MusicPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);

    return (
        <div className="w-full max-w-3xl">
            <div
                className="relative flex items-center gap-3 rounded-full border border-white/20
          bg-black/30
          px-3 py-2
          shadow-[0_10px_40px_rgba(0,0,0,0.25)]
          backdrop-blur-xl
        "
            >
                {/* Album Art */}
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
                    <Image
                        src={albumArt}
                        alt={title}
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                    />

                    {/* subtle dark overlay */}
                    <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* Song Info + Progress */}
                <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-white">
                        {title}
                    </div>

                    <div className="text-xs text-white/65">
                        {artist}
                    </div>

                    {/* Progress */}
                    <div className="mt-1.5 flex items-center gap-3">
                        <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/25">
                            <div className="absolute left-0 top-0 h-full w-[18%] rounded-full bg-white" />
                        </div>

                        <span className="whitespace-nowrap text-[11px] text-white/60">
                            0:05 / {duration}
                        </span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex shrink-0 items-center gap-5 pr-2">
                    <button
                        className="text-white/70 transition hover:text-white"
                        aria-label="Previous"
                    >
                        <SkipBack size={16} fill="currentColor" />
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="flex h-13 w-13 items-center justify-center rounded-full
                        transition hover:scale-105 active:scale-95"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {isPlaying ? (
                            <Pause size={21} fill="currentColor" />
                        ) : (
                            <Play
                                size={21}
                                fill="currentColor"
                                className="translate-x-px"
                            />
                        )}
                    </button>

                    <button
                        className="text-white/70 transition hover:text-white"
                        aria-label="Next"
                    >
                        <SkipForward size={16} fill="currentColor" />
                    </button>
                </div>
            </div>
        </div>
    );
}