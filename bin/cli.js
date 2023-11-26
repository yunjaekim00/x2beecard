#!/usr/bin/env node

const fs = require('fs');
const https = require('https');
const path = require('path');

// The URL where your button component is hosted
const BASE_COMPONENT_URL = 'https://raw.githubusercontent.com/yunjaekim00/x2beecard/main/ui';

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
const [, , componentName] = process.argv;

// Mapping component names to their URLs and filenames
const components = {
	button: {
		url: `${BASE_COMPONENT_URL}/button.tsx`,
		fileName: 'components/ui/button.tsx'
	},
	card: {
		url: `${BASE_COMPONENT_URL}/card.tsx`,
		fileName: 'components/ui/card.tsx'
	}
};

// Check if the component name is valid
const component = components[componentName];
if (!component) {
	console.error(`Usage: npx @x2bee/ui ${componentName} not available!\nAvailable components: button, card`);
	process.exit(1);
}

// The full path where the button component should be saved
const outputPath = path.join(localDirPath, component.fileName);

// Start the download
downloadFile(component.url, outputPath)
	.then(() => console.log(`${component.fileName} downloaded successfully!`))
	.catch((error) => console.error('Download failed:', error));