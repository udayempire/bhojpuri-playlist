import { Clock } from "@/components/clock";
import { Inter } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export default function Home() {
  return (
    <div className={`${inter.variable} min-h-screen font-sans bg-zinc-50 dark:bg-black p-4 m-4`}>
      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8 sm:px-10 sm:py-10">

        {/* Header */}
        <header className="flex w-full items-center justify-between p-4 m-4">
          <div className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
            <Clock />
          </div>

          <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span>50 online</span>
          </div>
        </header>

        {/* Main content area */}
        <section className="flex flex-1 items-center justify-center">

        </section>

        {/* Music Player */}
        <footer>
          Music Player UI
        </footer>

      </main>
    </div>
  );
}