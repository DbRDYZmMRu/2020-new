const fs = require('fs');
const path = require('path');

// The February array
const February = [
  { date: 'Saturday, February 8, 2020', data: `` },
  { date: 'Sunday, February 9, 2020', data: `` },
  { date: 'Tuesday, February 11, 2020', data: `` },
  { date: 'Wednesday, February 12, 2020', data: `` },
  { date: 'Thursday, February 13, 2020', data: `` },
  { date: 'Friday, February 14, 2020', data: `` },
  { date: 'Saturday, February 15, 2020', data: `` },
  { date: 'Sunday, February 16, 2020', data: `` },
  { date: 'Monday, February 17, 2020', data: `` },
  { date: 'Saturday, February 22, 2020', data: `` },
  { date: 'Monday, February 24, 2020', data: `` },
  { date: 'Tuesday, February 25, 2020', data: `` },
  { date: 'Wednesday, February 26, 2020', data: `` },
  { date: 'Saturday, February 29, 2020', data: `` },
];

// Directory containing the XHTML files
const directoryPath = path.join(__dirname, '2020');

// Function to extract content between <section> tags
const extractContentBetweenSectionTags = (content) => {
  const sectionRegex = /<section[^>]*>([\s\S]*?)<\/section>/i;
  const match = content.match(sectionRegex);
  return match ? match[0] : '';
};

// Read the XHTML files and populate the February array
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

      // Extract content between <section> tags
      const sectionContent = extractContentBetweenSectionTags(data);

      // Find the corresponding date in the February array and update the data field
      const entry = February.find((entry) => entry.date.includes(fileDate));
      if (entry) {
        entry.data = sectionContent;
      }

      // Save the updated February array to a file
      fs.writeFile('updated_February.json', JSON.stringify(February, null, 2), (err) => {
        if (err) {
          console.error('Error writing file:', err);
        } else {
          console.log('File has been saved.');
        }
      });
    });
  });
});