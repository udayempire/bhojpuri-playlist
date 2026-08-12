const YouTube = require("youtube-sr").default;
const fs = require("fs");

async function fetchPlaylist() {
  try {
    const playlist = await YouTube.getPlaylist("PLtMW1pmNGp6x9e8QfkqTheNnoWeOJmhxi", { fetchAll: true });
    
    const songs = playlist.videos.map(video => ({
      id: video.id,
      title: video.title,
      artist: video.channel.name,
      duration: video.durationFormatted
    }));
    
    fs.writeFileSync('./lib/playlistData.json', JSON.stringify(songs, null, 2));
    console.log(`Saved ${songs.length} songs to playlistData.json`);
  } catch (err) {
    console.error("Error fetching playlist:", err);
  }
}

fetchPlaylist();
