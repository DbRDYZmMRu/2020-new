const fs = require('fs');
const path = require('path');

// The March array
const March = [
                { date: 'Sunday, March 1, 2020', data: `` },
                { date: 'Monday, March 2, 2020', data: `` },
                { date: 'Thursday, March 5, 2020', data: `` },
                { date: 'Friday, March 6, 2020', data: `` },
                { date: 'Saturday, March 7, 2020', data: `` },
                { date: 'Sunday, March 8, 2020', data: `` },
                { date: 'Monday, March 9, 2020', data: `` },
                { date: 'Tuesday, March 10, 2020', data: `` },
                { date: 'Wednesday, March 11, 2020', data: `` },
                { date: 'Thursday, March 12, 2020', data: `` },
                { date: 'Friday, March 13, 2020', data: `` },
                { date: 'Saturday, March 14, 2020', data: `` },
                { date: 'Sunday, March 15, 2020', data: `` },
                { date: 'Monday, March 16, 2020', data: `` },
                { date: 'Tuesday, March 17, 2020', data: `` },
                { date: 'Thursday, March 19, 2020', data: `` },
                { date: 'Friday, March 20, 2020', data: `` },
                { date: 'Saturday, March 21, 2020', data: `` },
                { date: 'Sunday, March 22, 2020', data: `` },
                { date: 'Tuesday, March 24, 2020', data: `` },
                { date: 'Wednesday, March 25, 2020', data: `` },
                { date: 'Thursday, March 26, 2020', data: `` },
                { date: 'Friday, March 27, 2020', data: `` },
                { date: 'Saturday, March 28, 2020', data: `` },
                { date: 'Sunday, March 29, 2020', data: `` },
                { date: 'Monday, March 30, 2020', data: `` },
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

// Read the XHTML files and populate the March array
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

      // Find the corresponding date in the March array and update the data field
      const entry = March.find((entry) => entry.date.includes(fileDate));
      if (entry) {
        entry.data = pContent;
      }

      // Save the updated March array to a file
      fs.writeFile('updated_March.json', JSON.stringify(March, null, 2), (err) => {
        if (err) {
          console.error('Error writing file:', err);
        } else {
          console.log('File has been saved.');
        }
      });
    });
  });
});