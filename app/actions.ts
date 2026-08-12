"use server";

import type { Song } from "@/lib/playlist";
import { PLAYLIST_ID } from "@/lib/playlist";

// Helper to convert ISO 8601 duration (e.g. PT5M38S) to "m:ss" format
function parseDuration(isoString: string): string {
  const match = isoString.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return "0:00";
  
  const hours = match[1] ? parseInt(match[1]) : 0;
  const minutes = match[2] ? parseInt(match[2]) : 0;
  const seconds = match[3] ? parseInt(match[3]) : 0;
  
  let result = "";
  if (hours > 0) {
    result += `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  } else {
    result += `${minutes}:${seconds.toString().padStart(2, '0')}`;
  }
  return result;
}

export async function getPlaylistSongs(): Promise<Song[]> {
  try {
    const API_KEY = process.env.YOUTUBE_API_KEY;
    if (!API_KEY) {
      console.warn("YouTube API Key is missing.");
      return [];
    }

    // 1. Fetch playlist items (gives us video IDs, titles, artists)
    const playlistUrl = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet,contentDetails&maxResults=50&playlistId=${PLAYLIST_ID}&key=${API_KEY}`;
    const playlistRes = await fetch(playlistUrl, { next: { revalidate: 3600 } });
    
    if (!playlistRes.ok) {
      throw new Error(`Failed to fetch YouTube API: ${playlistRes.status}`);
    }
    
    const playlistData = await playlistRes.json();
    const items = playlistData.items || [];
    
    if (items.length === 0) return [];

    // Extract basic song info
    const songsMap: Record<string, Song> = {};
    const videoIds: string[] = [];

    items.forEach((item: any) => {
      const videoId = item.contentDetails.videoId;
      videoIds.push(videoId);
      
      let artist = item.snippet.videoOwnerChannelTitle || "Unknown Artist";
      artist = artist.replace(" - Topic", "");
      
      songsMap[videoId] = {
        id: videoId,
        title: item.snippet.title,
        artist: artist,
        duration: "0:00"
      };
    });

    // 2. Fetch video details to get the exact durations
    const videosUrl = `https://youtube.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoIds.join(',')}&key=${API_KEY}`;
    const videosRes = await fetch(videosUrl, { next: { revalidate: 3600 } });
    
    if (videosRes.ok) {
      const videosData = await videosRes.json();
      (videosData.items || []).forEach((video: any) => {
        const id = video.id;
        const durationIso = video.contentDetails.duration;
        if (songsMap[id]) {
          songsMap[id].duration = parseDuration(durationIso);
        }
      });
    }

    // Return the songs in the original order they appeared in the playlist
    return videoIds.map(id => songsMap[id]);
  } catch (error) {
    console.error("Error fetching playlist:", error);
    return [];
  }
}
