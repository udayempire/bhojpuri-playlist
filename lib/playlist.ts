export interface Song {
  id: string;         // YouTube video ID
  title: string;
  artist: string;
  duration: string;   // "m:ss" format
}

export const BHOJPURI_PLAYLIST: Song[] = [
  {
    id: "kMjVv9VBZ84",
    title: "Kamariya Hila Rahi Hai",
    artist: "Pawan Singh",
    duration: "4:48",
  },
  {
    id: "zv0nIJrfmYQ",
    title: "Lollypop Lagelu",
    artist: "Pawan Singh",
    duration: "4:22",
  },
  {
    id: "FqrGMMHt5cE",
    title: "Patna Se PMCH",
    artist: "Khesari Lal Yadav",
    duration: "5:10",
  },
  {
    id: "EDmL7P9d7kM",
    title: "Teri Aakhya Ka Yo Kajal",
    artist: "Sapna Choudhary",
    duration: "4:00",
  },
  {
    id: "BRxA6o6qMkY",
    title: "Tohse Naina Lage",
    artist: "Nikhil Vinay",
    duration: "4:35",
  },
  {
    id: "V4FoQKPsAbg",
    title: "Aashiq Awara",
    artist: "Indu Sonali",
    duration: "4:15",
  },
  {
    id: "Z6wBx2NG5Ys",
    title: "Raja Ji I Love You",
    artist: "Pawan Singh",
    duration: "4:52",
  },
  {
    id: "0OQ7k9JpVRI",
    title: "Chhalakata Hamro Jawaniya",
    artist: "Pawan Singh",
    duration: "5:03",
  },
];

/** Returns the YouTube thumbnail URL for a given video ID */
export function getThumbUrl(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
}
