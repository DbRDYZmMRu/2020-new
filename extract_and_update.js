const fs = require('fs');
const path = require('path');

// The May array
const May = [
                { date: 'Friday, May 1, 2020', data: `` },
                { date: 'Saturday, May 2, 2020', data: `` },
                { date: 'Sunday, May 3, 2020', data: `` },
                { date: 'Monday, May 4, 2020', data: `` },
                { date: 'Tuesday, May 5, 2020', data: `` },
                { date: 'Wednesday, May 6, 2020', data: `` },
                { date: 'Thursday, May 7, 2020', data: `` },
                { date: 'Friday, May 8, 2020', data: `` },
                { date: 'Saturday, May 9, 2020', data: `` },
                { date: 'Sunday, May 10, 2020', data: `` },
                { date: 'Monday, May 11, 2020', data: `` },
                { date: 'Tuesday, May 12, 2020', data: `` },
                { date: 'Wednesday, May 13, 2020', data: `` },
                { date: 'Thursday, May 14, 2020', data: `` },
                { date: 'Friday, May 15, 2020', data: `` },
                { date: 'Saturday, May 16, 2020', data: `` },
                { date: 'Sunday, May 17, 2020', data: `` },
                { date: 'Monday, May 18, 2020', data: `` },
                { date: 'Tuesday, May 19, 2020', data: `` },
                { date: 'Wednesday, May 20, 2020', data: `` },
                { date: 'Thursday, May 21, 2020', data: `` },
                { date: 'Friday, May 22, 2020', data: `` },
                { date: 'Saturday, May 23, 2020', data: `` },
                { date: 'Monday, May 25, 2020', data: `` },
                { date: 'Tuesday, May 26, 2020', data: `` },
                { date: 'Wednesday, May 27, 2020', data: `` },
                { date: 'Thursday, May 28, 2020', data: `` },
                { date: 'Saturday, May 30, 2020', data: `` },
                { date: 'Sunday, May 31, 2020', data: `` },
];

// Directory containing the XHTML 
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

// Read the XHTML files and populate the May array
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

      // Find the corresponding date in the May array and update the data field
      const entry = May.find((entry) => entry.date.includes(fileDate));
      if (entry) {
        entry.data = pContent;
      }

      // Save the updated May array to a file
      fs.writeFile('updated_May.json', JSON.stringify(May, null, 2), (err) => {
        if (err) {
          console.error('Error writing file:', err);
        } else {
          console.log('File has been saved.');
        }
      });
    });
  });
});