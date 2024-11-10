const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readline = require('readline');

const stat = promisify(fs.stat);
const copyFile = promisify(fs.copyFile);

const OUTPUT_FOLDER = 'D:\\Output';
const CHECK_INTERVAL = 15000; // 15 seconds

// Function to prompt user for input folder path
function askUserForInputFolder() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question('Please enter the full path for the Input folder: ', (inputPath) => {
            rl.close();
            resolve(inputPath);
        });
    });
}

// Function to find the latest FX_*.csv file with specified date format
async function findLatestFXFile(folder) {
    const files = await fs.promises.readdir(folder);
    const fxFiles = files.filter(file => /^FX_\d{2}\.\d{2}\.\d{4}\.csv$|^FX_\d{8}\.csv$/.test(file));

    if (fxFiles.length === 0) return null;

    let latestFile = fxFiles[0];
    let latestTime = (await stat(path.join(folder, latestFile))).mtime;

    for (let file of fxFiles.slice(1)) {
        const fileTime = (await stat(path.join(folder, file))).mtime;
        if (fileTime > latestTime) {
            latestFile = file;
            latestTime = fileTime;
        }
    }
    return latestFile;
}

// Function to copy the latest FX file to Output folder
async function copyFileToOutput(inputFolder, fileName) {
    const srcPath = path.join(inputFolder, fileName);
    const destPath = path.join(OUTPUT_FOLDER, fileName);
    await copyFile(srcPath, destPath);
    console.log(`${fileName} has been copied to Output folder.`);
}

// Function to monitor Output folder
function monitorOutputFolder(fileName) {
    const filePath = path.join(OUTPUT_FOLDER, fileName);
    const intervalId = setInterval(() => {
        if (!fs.existsSync(filePath)) {
            console.log(`${fileName} has been consumed by the system.`);
            clearInterval(intervalId);
        }
    }, CHECK_INTERVAL);
}

// Main function
async function main() {
    try {
        const inputFolder = await askUserForInputFolder();

        // Check if the provided input folder exists
        if (!fs.existsSync(inputFolder)) {
            console.log('The provided Input folder path does not exist.');
            return;
        }

        const latestFXFile = await findLatestFXFile(inputFolder);
        if (!latestFXFile) {
            console.log('No FX file found with the specified naming pattern.');
            return;
        }

        await copyFileToOutput(inputFolder, latestFXFile);
        monitorOutputFolder(latestFXFile);

    } catch (error) {
        console.error('An error occurred:', error);
    }
}

// Run the main function
main();
