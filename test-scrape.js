const PLAYLIST_ID = "PLtMW1pmNGp6x9e8QfkqTheNnoWeOJmhxi";
async function run() {
  const res = await fetch(`https://www.youtube.com/playlist?list=${PLAYLIST_ID}`);
  const html = await res.text();
  const match = html.match(/var ytInitialData = (\{.*?\});<\/script>/);
  if (!match) return console.log("No match");
  const data = JSON.parse(match[1]);
  const contents = data.contents.twoColumnBrowseResultsRenderer.tabs[0].tabRenderer.content.sectionListRenderer.contents[0].itemSectionRenderer.contents[0].playlistVideoListRenderer.contents;
  const songs = contents.map(item => {
    if (!item.playlistVideoRenderer) return null;
    return {
      title: item.playlistVideoRenderer.title.runs[0].text,
      id: item.playlistVideoRenderer.videoId
    };
  }).filter(Boolean);
  console.log(songs.length, songs.slice(0, 3));
}
run();
