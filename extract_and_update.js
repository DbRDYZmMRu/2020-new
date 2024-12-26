const fs = require('fs');
const path = require('path');

// The November array
const November = [
                { date: 'Tuesday, November 3, 2020', data: `` },
                { date: 'Friday, November 6, 2020', data: `` },
                { date: 'Tuesday, November 10, 2020', data: `` },
                { date: 'Wednesday, November 11, 2020', data: `` },
                { date: 'Thursday, November 12, 2020', data: `` },
                { date: 'Thursday, November 19, 2020', data: `` },
                { date: 'Friday, November 20, 2020', data: `` },
                { date: 'Saturday, November 21, 2020', data: `` },
                { date: 'Tuesday, November 24, 2020', data: `` },
                { date: 'Thursday, November 26, 2020', data: `` },
                { date: 'Monday, November 30, 2020', data: `` },
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

// Read the XHTML files and populate the November array
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

      // Find the corresponding date in the November array and update the data field
      const entry = November.find((entry) => entry.date.includes(fileDate));
      if (entry) {
        entry.data = pContent;
      }

      // Save the updated November array to a file
      fs.writeFile('updated_November.json', JSON.stringify(November, null, 2), (err) => {
        if (err) {
          console.error('Error writing file:', err);
        } else {
          console.log('File has been saved.');
        }
      });
    });
  });
});