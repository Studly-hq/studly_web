// convert-auth-images.js
// Converts auth page images to WebP and knocks out the white paper background
// so the corner artwork can sit behind the page content without masking it.
// Requires sharp (already a dev dependency).

const sharp = require('sharp');
const path = require('path');

const WHITE_CUTOFF = 238; // at/below this brightness the pixel stays opaque
const WHITE_FLOOR = 250; // at/above this brightness it becomes fully transparent
const OUTPUT_WIDTH = 896; // 2x the 448px the auth pages render it at

const images = [
  { src: path.join(__dirname, 'public', 'auth-bottom-left.jpg'), dest: path.join(__dirname, 'public', 'auth-bottom-left.webp') },
  { src: path.join(__dirname, 'public', 'auth-bottom-left-signup.jpg'), dest: path.join(__dirname, 'public', 'auth-bottom-left-signup.webp') },
];

async function convert({ src, dest }) {
  const { data, info } = await sharp(src).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

  for (let i = 0; i < data.length; i += 4) {
    const min = Math.min(data[i], data[i + 1], data[i + 2]);
    const alpha =
      min >= WHITE_FLOOR
        ? 0
        : min <= WHITE_CUTOFF
          ? 255
          : Math.round(((WHITE_FLOOR - min) / (WHITE_FLOOR - WHITE_CUTOFF)) * 255);
    data[i + 3] = Math.min(data[i + 3], alpha);
  }

  await sharp(data, { raw: { width: info.width, height: info.height, channels: 4 } })
    .resize({ width: OUTPUT_WIDTH, withoutEnlargement: true })
    .webp({ quality: 88, alphaQuality: 100, effort: 6 })
    .toFile(dest);

  console.log(`Converted ${path.basename(src)} -> ${path.basename(dest)} (transparent background)`);
}

(async () => {
  for (const img of images) {
    try {
      await convert(img);
    } catch (err) {
      console.error('Error converting', img.src, err);
    }
  }
})();
