// convert-auth-images.js
// Converts auth page images to WebP for faster loading.
// Requires sharp (npm install sharp) which is already a dependency of many build steps.

const sharp = require('sharp');
const path = require('path');

const images = [
  { src: path.join(__dirname, 'public', 'auth-bottom-left.jpg'), dest: path.join(__dirname, 'public', 'auth-bottom-left.webp') },
  { src: path.join(__dirname, 'public', 'auth-bottom-left-signup.jpg'), dest: path.join(__dirname, 'public', 'auth-bottom-left-signup.webp') },
];

(async () => {
  for (const img of images) {
    try {
      await sharp(img.src)
        .webp({ quality: 80 })
        .toFile(img.dest);
      console.log(`Converted ${path.basename(img.src)} -> ${path.basename(img.dest)}`);
    } catch (err) {
      console.error('Error converting', img.src, err);
    }
  }
})();
