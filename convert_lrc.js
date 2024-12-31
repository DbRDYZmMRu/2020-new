const fs = require('fs');

const lrcFile = 'lyrics.lrc';
const outputFile = 'lyrics.json';

const lrcContent = fs.readFileSync(lrcFile, 'utf8');
const lines = lrcContent.split('\n');

const metadata = {};
const lyrics = [];

lines.forEach((line) => {
  const match = line.match(/\[(\d{2}):(\d{2}).(\d{2})\](.*)/);
  if (match) {
    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const seconds = parseInt(match[3]);
    const text = match[4].trim();
    const milliseconds = hours * 3600000 + minutes * 60000 + seconds * 1000;

    lyrics.push({ time: milliseconds, line: text });
  } else if (line.startsWith('[ti:')) {
    metadata.title = line.substring(4).trim();
  } else if (line.startsWith('[ar:')) {
    metadata.artist = line.substring(4).trim();
  } else if (line.startsWith('[al:')) {
    metadata.album = line.substring(4).trim();
  }
});

const jsonData = JSON.stringify({ metadata, lyrics }, null, 2);
fs.writeFileSync(outputFile, jsonData);
