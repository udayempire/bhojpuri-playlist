"use client";

interface MusicWavesProps {
  isPlaying: boolean;
}

export default function MusicWaves({
  isPlaying,
}: MusicWavesProps) {
  const bars = [
    "h-6",
    "h-3",
    "h-6",
    "h-4",
    "h-6",
  ];

  return (
    <div
      className="
        flex h-16 w-16 shrink-0
        items-center justify-center gap-0.75
        rounded-full
        border border-white/20
        bg-black/30
        px-5
        shadow-[0_10px_40px_rgba(0,0,0,0.25)]
        backdrop-blur-xl
        active:scale-95
      "
    >
      {bars.map((height, index) => (
        <span
          key={index}
          className={`
            w-0.75
            rounded-full
            bg-white/70
            ${height}
            ${isPlaying ? "animate-music-bar" : ""}
          `}
          style={{
            animationDelay: `${index * 40}ms`,
          }}
        />
      ))}
    </div>
  );
}