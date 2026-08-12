import MusicPlayer from "@/components/audioPlayer";
import { Clock } from "@/components/clock";
import OnlineCount from "@/components/OnlineCount";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function Home() {
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
        <header className="fixed top-4 left-4 right-4 sm:top-6 sm:left-6 sm:right-6 flex items-center justify-between z-50">
          <div className="relative flex items-center gap-3 rounded-full border border-white/20 bg-black/30 px-4 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl text-base text-sm font-semibold tracking-wide text-white">
            <Clock />
          </div>

          <div className="relative flex items-center gap-3 rounded-full border border-white/20 bg-black/30 px-4 py-2 shadow-[0_10px_40px_rgba(0,0,0,0.25)] backdrop-blur-xl text-sm font-medium text-white">
            <OnlineCount/>
          </div>
        </header>

        {/* Main content area */}
        <section className="flex flex-1 items-center justify-center">

        </section>

        {/* Music Player */}
        <footer className="flex justify-center">
          <MusicPlayer />
        </footer>

      </main>
    </div>
  );
}