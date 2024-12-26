const fs = require('fs');
const path = require('path');

// The April array
const April = [
                { date: 'Thursday, April 2, 2020', data: `` },
                { date: 'Friday, April 3, 2020', data: `` },
                { date: 'Saturday, April 4, 2020', data: `` },
                { date: 'Sunday, April 5, 2020', data: `` },
                { date: 'Tuesday, April 7, 2020', data: `` },
                { date: 'Wednesday, April 8, 2020', data: `` },
                { date: 'Thursday, April 9, 2020', data: `` },
                { date: 'Friday, April 10, 2020', data: `` },
                { date: 'Saturday, April 11, 2020', data: `` },
                { date: 'Sunday, April 12, 2020', data: `` },
                { date: 'Monday, April 13, 2020', data: `` },
                { date: 'Tuesday, April 14, 2020', data: `` },
                { date: 'Wednesday, April 15, 2020', data: `` },
                { date: 'Thursday, April 16, 2020', data: `` },
                { date: 'Friday, April 17, 2020', data: `` },
                { date: 'Saturday, April 18, 2020', data: `` },
                { date: 'Sunday, April 19, 2020', data: `` },
                { date: 'Monday, April 20, 2020', data: `` },
                { date: 'Tuesday, April 21, 2020', data: `` },
                { date: 'Wednesday, April 22, 2020', data: `` },
                { date: 'Thursday, April 23, 2020', data: `` },
                { date: 'Friday, April 24, 2020', data: `` },
                { date: 'Saturday, April 25, 2020', data: `` },
                { date: 'Sunday, April 26, 2020', data: `` },
                { date: 'Monday, April 27, 2020', data: `` },
                { date: 'Tuesday, April 28, 2020', data: `` },
                { date: 'Wednesday, April 29, 2020', data: `` },
                { date: 'Thursday, April 30, 2020', data: `` },
];

// Directory containing the XHTML files
const directoryPath = path.join(__dirname, '2020-main/2020');

// Function to extract content between first <p> and last <p> tags within <section>
const extractContentBetweenPTags = (content) => {
  const sectionRegex = /<section[^>]*>([\s\S]*?)<\/section>/i;
  const sectionMatch = content.match(sectionRegex);

  if (!sectionMatch) return '';

  const sectionContent = sectionMatch[1];
  const pTagRegex = /<p[^>]*>([\s\S]*?)<\/p>/gi;
  const pTags = [...sectionContent.matchAll(pTagRegex)];

  if (pTags.length === 0) return '';

  // Extract content from the first <p> to the last <p>
  const firstPTagIndex = pTags[0].index;
  const lastPTagIndex = pTags[pTags.length - 1].index + pTags[pTags.length - 1][0].length;
  return sectionContent.slice(firstPTagIndex, lastPTagIndex);
};

// Read the XHTML files and populate the April array
fs.readdir(directoryPath, (err, files) => {
  if (err) {
    return console.log('Unable to scan directory: ' + err);
  }

  files.forEach((file) => {
    const filePath = path.join(directoryPath, file);
    const fileDate = path.basename(file, '.xhtml').replace('_', ' ');

    // Read the XHTML file
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return console.log('Unable to read file: ' + err);
      }

      // Extract content between the first <p> and the last <p> tags within <section>
      const pContent = extractContentBetweenPTags(data);

      // Find the corresponding date in the April array and update the data field
      const entry = April.find((entry) => entry.date.includes(fileDate));
      if (entry) {
        entry.data = pContent;
      }

      // Save the updated April array to a file
      fs.writeFile('updated_April.json', JSON.stringify(April, null, 2), (err) => {
        if (err) {
          console.error('Error writing file:', err);
        } else {
          console.log('File has been saved.');
        }
      });
    });
  });
});