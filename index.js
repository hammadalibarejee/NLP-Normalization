const fs = require('fs');
const path = require('path');
const util = require('util');
const pdf = require('pdf-parse');
const natural = require('natural');

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const appendFile = util.promisify(fs.appendFile);

const pdfDirectory = '/Users/tvmbp/Downloads/'; 
const outputFilename = './output/normalized.txt';

// English-specific text normalization function without spelling checking
function normalizeEnglishText(text) {
  // Lowercasing
  text = text.toLowerCase();

  // Tokenization
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(text);

  // Join the tokens back into text
  const normalizedText = tokens.join(' ');

  return normalizedText;
}

async function processPDFs() {
  try {
    const files = await readdir(pdfDirectory);

    for (const file of files) {
      const filePath = path.join(pdfDirectory, file);

      // Check if the file is a PDF (you can use a more sophisticated check)
      if (path.extname(file) === '.pdf') {
        const dataBuffer = await readFile(filePath);
        const data = await pdf(dataBuffer);

        const pdfText = data.text;

        // Normalize and process the pdfText as needed using English-specific normalization
        const normalizedText = normalizeEnglishText(pdfText);

        // Append the normalized text to the output file in append mode
        await appendFile(outputFilename, normalizedText + '\n');

        console.log(`Processed ${file}`);
      }
    }

    console.log(`Appended normalized text to ${outputFilename}`);
  } catch (error) {
    console.error('Error reading PDF files:', error);
  }
}

processPDFs();
