"use client";

import { PLAYLIST_ID } from "@/lib/playlist";
import { Pause, Play, SkipBack, SkipForward } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

/*YouTube IFrame API types*/
declare global {
    interface Window {
        YT: {
            Player: new (
                el: string | HTMLElement,
                opts: {
                    playerVars?: Record<string, string | number>;
                    events?: {
                        onReady?: (e: { target: YTPlayer }) => void;
                        onStateChange?: (e: { data: number }) => void;
                        onError?: (e: { data: number }) => void;
                    };
                }
            ) => YTPlayer;
            PlayerState: { PLAYING: number; PAUSED: number; ENDED: number };
        };
        onYouTubeIframeAPIReady: () => void;
    }
    interface YTPlayer {
        playVideo(): void;
        pauseVideo(): void;
        nextVideo(): void;
        previousVideo(): void;
        seekTo(seconds: number, allowSeekAhead: boolean): void;
        getCurrentTime(): number;
        getDuration(): number;
        getVideoData(): { video_id: string; title: string; author: string };
        destroy(): void;
    }
}

interface SongInfo {
    title: string;
    artist: string;
    videoId: string;
}

export default function MusicPlayer() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isReady, setIsReady] = useState(false);
    const [progress, setProgress] = useState(0);
    const [elapsed, setElapsed] = useState("0:00");
    const [song, setSong] = useState<SongInfo>({
        title: "—",
        artist: "—",
        videoId: "",
    });

    const playerRef = useRef<YTPlayer | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const tickRef = useRef<ReturnType<typeof setInterval> | null>(null);

    /*Pull live metadata from YT player */
    const syncSongInfo = () => {
        const data = playerRef.current?.getVideoData();
        if (data?.title) {
            setSong({
                title: data.title,
                artist: data.author,
                videoId: data.video_id,
            });
        }
    };

    /*Initialize YouTube player once API is ready */
    useEffect(() => {
        const init = () => {
            if (!containerRef.current || playerRef.current) return;
            playerRef.current = new window.YT.Player(containerRef.current, {
                playerVars: {
                    listType: "playlist",
                    list: PLAYLIST_ID,
                    autoplay: 0,
                    controls: 0,
                    disablekb: 1,
                    fs: 0,
                    iv_load_policy: 3,
                    modestbranding: 1,
                    playsinline: 1,
                    rel: 0,
                },
                events: {
                    onReady: () => {
                        console.log("[YT] Player ready ✅");
                        setIsReady(true);
                        syncSongInfo();
                    },
                    onError: (e) => {
                        console.warn("[YT] Skipping unembeddable video, error:", e.data);
                        setProgress(0);
                        setElapsed("0:00");
                        playerRef.current?.nextVideo();
                    },
                    onStateChange: (e) => {
                        if (e.data === window.YT.PlayerState.PLAYING) {
                            setIsPlaying(true);
                            startTick();
                            syncSongInfo(); // title/artist from YT directly
                        } else if (e.data === window.YT.PlayerState.PAUSED) {
                            setIsPlaying(false);
                            stopTick();
                        } else if (e.data === window.YT.PlayerState.ENDED) {
                            setProgress(0);
                            setElapsed("0:00");
                            playerRef.current?.nextVideo();
                        }
                    },
                },
            });
        };

        const tryInit = () => {
            if (window.YT && window.YT.Player) {
                init();
            } else {
                const prev = window.onYouTubeIframeAPIReady;
                window.onYouTubeIframeAPIReady = () => {
                    prev?.();
                    init();
                };
            }
        };

        tryInit();

        return () => {
            stopTick();
            playerRef.current?.destroy();
            playerRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Progress tick 
    const startTick = () => {
        stopTick();
        tickRef.current = setInterval(() => {
            const p = playerRef.current;
            if (!p) return;
            const cur = p.getCurrentTime();
            const dur = p.getDuration();
            if (dur > 0) {
                setProgress((cur / dur) * 100);
                setElapsed(fmt(cur));
            }
        }, 500);
    };

    const stopTick = () => {
        if (tickRef.current) clearInterval(tickRef.current);
    };

    const fmt = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = Math.floor(s % 60);
        return `${m}:${sec.toString().padStart(2, "0")}`;
    };

    /*Controls */
    const handlePlayPause = () => {
        isPlaying ? playerRef.current?.pauseVideo() : playerRef.current?.playVideo();
    };

    const handleNext = () => {
        setProgress(0);
        setElapsed("0:00");
        playerRef.current?.nextVideo();
    };

    const handlePrev = () => {
        setProgress(0);
        setElapsed("0:00");
        playerRef.current?.previousVideo();
    };

    const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
        const ratio = e.nativeEvent.offsetX / e.currentTarget.clientWidth;
        const p = playerRef.current;
        if (!p) return;
        const dur = p.getDuration();
        if (dur > 0) {
            p.seekTo(ratio * dur, true);
            setProgress(ratio * 100);
            setElapsed(fmt(ratio * dur));
        }
    };

    const thumbUrl = song.videoId
        ? `https://img.youtube.com/vi/${song.videoId}/mqdefault.jpg`
        : null;

    return (
        <div className="w-full max-w-3xl">
            {/* Hidden YouTube iframe*/}
            <div
                ref={containerRef}
                style={{
                    position: "fixed",
                    top: "-9999px",
                    left: "-9999px",
                    width: "320px",
                    height: "180px",
                    pointerEvents: "none",
                }}
            />

            <div
                className="relative flex items-center gap-3 rounded-full border border-white/20
          bg-black/30 px-3 py-2
          shadow-[0_10px_40px_rgba(0,0,0,0.25)]
          backdrop-blur-xl"
            >
                {/* Album Art — live YouTube thumbnail */}
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white/10">
                    {thumbUrl && (
                        <Image
                            src={thumbUrl}
                            alt={song.title}
                            width={48}
                            height={48}
                            className="h-full w-full object-cover scale-125"
                            unoptimized
                        />
                    )}
                    <div className="absolute inset-0 bg-black/10" />
                </div>

                {/* Song info + progress */}
                <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-white">
                        {song.title}
                    </div>
                    <div className="text-xs text-white/65">
                        {isReady ? song.artist : "Loading player…"}
                    </div>

                    <div className="mt-1.5 flex items-center gap-3">
                        <div
                            className="relative h-1 flex-1 cursor-pointer overflow-hidden rounded-full bg-white/25"
                            onClick={handleSeek}
                        >
                            <div
                                className="absolute left-0 top-0 h-full rounded-full bg-white transition-all"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="whitespace-nowrap text-[11px] text-white/60">
                            {elapsed}
                        </span>
                    </div>
                </div>

                {/* Controls */}
                <div className="flex shrink-0 items-center gap-5 pr-2">
                    <button
                        onClick={handlePrev}
                        disabled={!isReady}
                        className="text-white/70 transition hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Previous"
                    >
                        <SkipBack size={16} fill="currentColor" />
                    </button>

                    <button
                        onClick={handlePlayPause}
                        disabled={!isReady}
                        className="flex h-13 w-13 items-center justify-center rounded-full transition hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        aria-label={isPlaying ? "Pause" : "Play"}
                    >
                        {!isReady ? (
                            <span className="h-5 w-5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                        ) : isPlaying ? (
                            <Pause size={21} fill="currentColor" className="text-white" />
                        ) : (
                            <Play size={21} fill="currentColor" className="translate-x-px text-white" />
                        )}
                    </button>

                    <button
                        onClick={handleNext}
                        disabled={!isReady}
                        className="text-white/70 transition hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
                        aria-label="Next"
                    >
                        <SkipForward size={16} fill="currentColor" />
                    </button>
                </div>
            </div>
        </div>
    );
}