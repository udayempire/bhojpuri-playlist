export interface Song {
  id: string;
  title: string;
  artist: string;
  duration: string;   // "m:ss" format
}

/** ✏️ Change this to any YouTube playlist ID */
export const PLAYLIST_ID = "PLtMW1pmNGp6x9e8QfkqTheNnoWeOJmhxi";

/** thumbnail URL for a given video ID */
export function getThumbUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}
