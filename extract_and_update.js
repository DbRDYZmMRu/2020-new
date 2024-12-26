const fs = require('fs');
const path = require('path');

// The June array
const June = [
                { date: 'Thursday, June 3, 2020', data: `` },
                { date: 'Saturday, June 6, 2020', data: `` },
                { date: 'Sunday, June 7, 2020', data: `` },
                { date: 'Monday, June 8, 2020', data: `` },
                { date: 'Tuesday, June 9, 2020', data: `` },
                { date: 'Wednesday, June 10, 2020', data: `` },
                { date: 'Thursday, June 11, 2020', data: `` },
                { date: 'Friday, June 12, 2020', data: `` },
                { date: 'Saturday, June 13, 2020', data: `` },
                { date: 'Sunday, June 14, 2020', data: `` },
                { date: 'Monday, June 15, 2020', data: `` },
                { date: 'Friday, June 19, 2020', data: `` },
                { date: 'Saturday, June 20, 2020', data: `` },
                { date: 'Monday, June 22, 2020', data: `` },
                { date: 'Tuesday, June 23, 2020', data: `` },
                { date: 'Wednesday, June 24, 2020', data: `` },
                { date: 'Sunday, June 28, 2020', data: `` },
                { date: 'Monday, June 29, 2020', data: `` },
                { date: 'Tuesday, June 30, 2020', data: `` },
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

// Read the XHTML files and populate the June array
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

      // Find the corresponding date in the June array and update the data field
      const entry = June.find((entry) => entry.date.includes(fileDate));
      if (entry) {
        entry.data = pContent;
      }

      // Save the updated June array to a file
      fs.writeFile('updated_June.json', JSON.stringify(June, null, 2), (err) => {
        if (err) {
          console.error('Error writing file:', err);
        } else {
          console.log('File has been saved.');
        }
      });
    });
  });
});