"use server";

import type { Song } from "@/lib/playlist";
import { PLAYLIST_ID } from "@/lib/playlist";

export async function getPlaylistSongs(): Promise<Song[]> {
  try {
    const res = await fetch(`https://www.youtube.com/feeds/videos.xml?playlist_id=${PLAYLIST_ID}`, {
      next: { revalidate: 2000 }
    });

    if (!res.ok) {
      throw new Error(`Failed to fetch playlist RSS: ${res.status}`);
    }

    const xml = await res.text();

    // Extract entries using regex
    const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
    const idRegex = /<yt:videoId>(.*?)<\/yt:videoId>/;
    const titleRegex = /<title>(.*?)<\/title>/;
    const authorRegex = /<name>(.*?)<\/name>/;

    const songs: Song[] = [];

    let match;
    while ((match = entryRegex.exec(xml)) !== null) {
      const entry = match[1];
      const idMatch = idRegex.exec(entry);
      const titleMatch = titleRegex.exec(entry);
      const authorMatch = authorRegex.exec(entry);

      if (idMatch && titleMatch) {
        songs.push({
          id: idMatch[1],
          // Unescape XML entities like &amp; &quot;
          title: titleMatch[1].replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'"),
          artist: authorMatch ? authorMatch[1] : "Unknown Artist",
          duration: "" // RSS doesn't provide duration
        });
      }
    }

    return songs;
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return [];
  }
}
