#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const path = require('path');

// The URL where your button component is hosted
const BUTTON_COMPONENT_URL = 'https://github.com/yunjaekim00/x2beecard.git/ui/';

// The name of the file to save locally
const FILE_NAME = 'card.tsx';

// The path to the current working directory where the command is executed
const localDirPath = process.cwd();

// Function to download the file
function downloadFile(fileUrl, outputPath) {
	return new Promise((resolve, reject) => {
		const fileStream = fs.createWriteStream(outputPath);
		https.get(fileUrl, function (response) {
			response.pipe(fileStream);
			fileStream.on('finish', function () {
				fileStream.close(resolve);
			});
		}).on('error', function (error) {
			fs.unlink(outputPath, () => reject(error.message));
		});
	});
}

// Parse command line arguments
const [, , ...args] = process.argv;

if (args.length === 0 || args[0] !== 'button') {
	console.error('Usage: npx @myname add button');
	process.exit(1);
}

// The full path where the button component should be saved
const outputPath = path.join(localDirPath, FILE_NAME);

// Start the download
downloadFile(BUTTON_COMPONENT_URL, outputPath)
	.then(() => console.log(`${FILE_NAME} downloaded successfully!`))
	.catch((error) => console.error('Download failed:', error));