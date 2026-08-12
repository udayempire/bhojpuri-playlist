"use client";

import MusicPlayer from "@/components/audioPlayer";
import { Clock } from "@/components/clock";
import MusicWaves from "@/components/MusicWaves";
import OnlineCount from "@/components/OnlineCount";
import PlaylistButton from "@/components/PlaylistButton";
import { Inter } from "next/font/google";
import { useState } from "react";
import type { Song } from "@/lib/playlist";
import playlistData from "@/lib/playlistData.json";
import { MoveUpRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function Home() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const songs: Song[] = playlistData;

  return (
    <div
      className={`${inter.variable} h-screen font-sans overflow-hidden`}
      style={{
        backgroundImage: "url('/bg-1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundAttachment: "fixed",
      }}
    >
      <main className="relative mx-auto flex h-full w-full max-w-5xl flex-col px-6 py-8 sm:px-10 sm:py-10">

        {/* Header */}
        <header className="fixed top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex flex-col sm:flex-row items-center justify-between z-50 gap-3 sm:gap-0 pointer-events-none">
          <div className="pointer-events-auto relative flex items-center gap-3 rounded-full border border-white/20 bg-black/30 px-4 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl text-base text-sm font-semibold tracking-wide text-white">
            <Clock />
          </div>

          <div className="flex gap-2 sm:gap-3 items-center pointer-events-auto">
            <Link
              href={"https://music.youtube.com/playlist?list=PLtMW1pmNGp6x9e8QfkqTheNnoWeOJmhxi"}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-2 sm:px-4 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl text-sm font-medium text-white"
            >
              <Image src="/ytmusic.png" width={20} height={20} alt="YT Music" />
              <p className="hidden sm:block">YT Music</p>
              <span className="hidden sm:block"><MoveUpRight size={16} /></span>
            </Link>
            <Link
              href={"https://open.spotify.com/playlist/1GT0ZbeSxcAVOFkkehNFZk"}
              target="_blank"
              rel="noopener noreferrer"
              className="relative flex items-center gap-2 rounded-full border border-white/20 bg-black/30 px-3 py-2 sm:px-4 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl text-sm font-medium text-white"
            >
              <Image src="/spotify.png" width={20} height={20} alt="YT Music" />
              <p className="hidden sm:block">Spotify</p>
              <span className="hidden sm:block"><MoveUpRight size={16} /></span>
            </Link>
            <div className="relative flex items-center gap-2 sm:gap-3 rounded-full border border-white/20 bg-black/30 px-3 py-2 sm:px-4 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl text-sm font-medium text-white">
              <OnlineCount />
            </div>


          </div>

        </header>

        <section className="flex flex-1 items-center justify-center">

        </section>

        {/* Music Player */}
        <footer className="flex flex-wrap sm:flex-nowrap justify-center items-center gap-2 sm:gap-4 w-full pb-4 sm:pb-0">
          <PlaylistButton
            songs={songs}
            currentIndex={currentIndex}
            onSelect={(index) => {
              setCurrentIndex(index);
            }}
          />
          <div className="w-full sm:w-auto flex-1 flex justify-center order-first sm:order-none">
            <MusicPlayer
              currentIndex={currentIndex}
              onIndexChange={setCurrentIndex}
              onPlayStateChange={setIsPlaying}
            />
          </div>
          <MusicWaves isPlaying={isPlaying} />
        </footer>

      </main>
    </div>
  );
}