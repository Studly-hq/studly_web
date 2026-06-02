const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, 'src/assets/logo.png');
const outputPathWeb = path.join(__dirname, 'src/assets/logo_cropped.png');
const outputPathLucidFavicon = path.join(__dirname, '../lucid/public/favicon.ico');
const outputPathLucidIcon = path.join(__dirname, '../lucid/src/app/icon.png');

async function processImage() {
  try {
    // Trim the image (removes transparent pixels around it)
    const trimmed = sharp(inputPath).trim();
    
    // Save to the various locations
    await trimmed.toFile(outputPathWeb);
    console.log('Saved cropped logo to studly_web/src/assets/logo_cropped.png');
    
    // Also save as png and copy to lucid (sharp can output png, and we can just use the png file as .ico and .png)
    await trimmed.toFile(outputPathLucidFavicon);
    await trimmed.toFile(outputPathLucidIcon);
    
    console.log('Successfully cropped and updated favicons!');
  } catch (error) {
    console.error('Error processing image:', error);
  }
}

processImage();
