const fs = require('fs');

const data = JSON.parse(fs.readFileSync('playlist-dump.json', 'utf8'));

function formatDuration(seconds) {
    if (!seconds) return "0:00";
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
}

const songs = data.entries.map(entry => ({
    id: entry.id,
    title: entry.title,
    artist: entry.uploader || "Unknown Artist",
    duration: formatDuration(entry.duration)
}));

fs.writeFileSync('lib/playlistData.json', JSON.stringify(songs, null, 2));
console.log(`Saved ${songs.length} songs to lib/playlistData.json`);
